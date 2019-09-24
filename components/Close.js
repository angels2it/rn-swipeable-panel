import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Dimensions, PixelRatio, StatusBar } from 'react-native';
import ExtraDimensions from 'react-native-extra-dimensions-android';
const FULL_HEIGHT = Dimensions.get("window").height;
let screenWidth = Dimensions.get('window').width;
const navHeight = ExtraDimensions.getSoftMenuBarHeight();
const width100 = PixelRatio.roundToNearestPixel(screenWidth);

export const Close = ({ onBack, onNext, caption, largeHeight, actionColor }) => {
  var extHeight = (FULL_HEIGHT - 50 - largeHeight);
  const bgColor = actionColor != null ? actionColor : '#3370bc';
  return (
    <View
      style={{
        flexDirection: "row",
        position: "absolute",
        backgroundColor: 'white',
        height: 127,
        paddingBottom: 47,
        paddingTop: 10,
        bottom: navHeight + (extHeight > 0 ? extHeight : 0),
        paddingHorizontal: 30,
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 3,
        flex: 1,
        width: width100
      }}
    >
      <TouchableOpacity onPress={onBack} style={CloseStyles.closeButton}>
        <View
          style={[CloseStyles.iconLine, { transform: [{ rotateZ: "45deg" }] }]}
        />
        <View
          style={[CloseStyles.iconLine, { transform: [{ rotateZ: "135deg" }] }]}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onNext} style={[CloseStyles.nextButton, { backgroundColor: bgColor }]}>
        <Text style={{ color: "white", alignSelf: "center", fontSize: 15 }}>
          {caption}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const CloseStyles = StyleSheet.create({
  closeButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 1,
      height: 1
    },
    elevation: 1,
    shadowOpacity: 0.7,
    shadowRadius: 1.0
  },
  nextButton: {
    height: 50,
    width: width100 - 130,
    borderRadius: 12,
    justifyContent: "center",
    backgroundColor: "#3370bc"
  },
  iconLine: {
    width: 18,
    height: 2,
    borderRadius: 2,
    backgroundColor: "gray",
    alignSelf: "center"
  }
});
