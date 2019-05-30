import React from 'react';
import { StyleSheet, Text, View, Animated, PanResponder } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import axios from "axios";

import FactCard from './components/fact-card';

const MAX_LEFT_ROTATION_DISTANCE = wp("-150%");
const MAX_RIGHT_ROTATION_DISTANCE = wp("150%");
const LEFT_TRESHOLD_BEFORE_SWIPE = wp("-50%");
const RIGHT_TRESHOLD_BEFORE_SWIPE = wp("50%");
const RANDOM_IMAGE_URL = "https://picsum.photos/243/337?image=";
const FACT_URL = "http://randomuselessfact.appspot.com/random.json?language=en";
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      panResponder: undefined,
      topFact: undefined,
      bottomFact: undefined
    };
    this.position = new Animated.ValueXY();
  }

  componentDidMount() {
    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (event, gesture) => {
        return Math.abs(gesture.dx) > Math.abs(gesture.dy * 4)
      },
      onPanResponderMove: (event, gesture) => {
        this.position.setValue({
          x: gesture.dx
        })
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx < LEFT_TRESHOLD_BEFORE_SWIPE) {
          this.forceLeftExit();
        } else if (gesture.dx > RIGHT_TRESHOLD_BEFORE_SWIPE) {
          this.forceRightExit();
        } else {
          this.resetPosSoft();
        }
      }
    });
    this.setState({panResponder}, () => {
      this.loadTopFact();
      this.loadBottomFact();
    });
  }

  loadTopFact() {
    return (
      axios.get(FACT_URL).then(response => {
        this.setState({
          topFact: {
            ...response.data,
            image: this.getRandomImageURL()
          }
        })
      })
    );
  }

  loadBottomFact() {
    return (
      axios.get(FACT_URL).then(response => {
        this.setState({
          bottomFact: {
            ...response.data,
            image: this.getRandomImageURL()
          }
        })
      })
    );
  }

  onCardExitDone = () => {
    this.setState({
      topFact: this.state.bottomFact
    });
    this.loadBottomFact();
    this.position.setValue(0);
  };

  forceLeftExit() {
    Animated.timing(this.position, {
      toValue: { x: wp("-100%"), y: 0 }
    }).start(this.onCardExitDone());
  }

  forceRightExit() {
    Animated.timing(this.position, {
      toValue: { x: wp("100%"), y: 0 }
    }).start(this.onCardExitDone());
  }

  resetPosSoft() {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  getCardStyle() {
    const rotation = this.position.x.interpolate({
      inputRange: [MAX_LEFT_ROTATION_DISTANCE, 0, MAX_RIGHT_ROTATION_DISTANCE],
      outputRange: ["-110deg", "0deg", "110deg"]
    });
    return {
      transform: [{
        rotate: rotation
      }],
      ...this.position.getLayout()
    }
  }

  getRandomImageURL() {
    return RANDOM_IMAGE_URL + Math.floor(Math.random()*500 + 1);
  }

  renderBottomCard() {
    return (
      <View style={{ zIndex: -1, position: "absolute" }}>
        <FactCard
          disabled={true}
          fact={this.state.bottomFact}
        />
      </View>
    );
  }

  renderTopCard() {
    return (
        <Animated.View
          {...this.state.panResponder.panHandlers}
          style={this.getCardStyle()}
        >
          <FactCard
            disabled={false}
            fact={this.state.topFact}
          />
        </Animated.View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Fact Swipe</Text>
        <View style={styles.container}>
          {this.state.topFact && this.renderTopCard()}
          {this.state.bottomFact && this.renderBottomCard()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: 30,
    marginBottom: 50
  }
});
