import React from 'react';
import { Text, View, Image, Button, Linking, ScrollView } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

export default class FactCard extends React.Component {
  render () {
    return (
      <View style={{
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: 0.7,
        width: wp("90%"),
        backgroundColor: "#fff"
      }}>
        <Image
          style={{
            width: wp("90%"),
            height: hp("30%")
          }}
          source={{
            uri: this.props.fact.image
          }}
        />
        <ScrollView height={150}>
          <Text style={{ padding: 10 }}>
            {this.props.fact.text}
          </Text>
        </ScrollView>
        <Button
          title="See the source"
          disabled={this.props.disabled}
          onPress={() => Linking.openURL(this.props.fact.source_url)} />
      </View>
    );
  }
}