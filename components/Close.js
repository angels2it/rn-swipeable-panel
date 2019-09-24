import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

export const Close = ({ onBack, onNext, caption }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "red",
        position: "absolute",
        bottom: 150,
        left: 40,
        right: 40,
        display: "flex",
        justifyContent: "center",
		alignItems: "center",
		zIndex: 3,
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
      <TouchableOpacity onPress={onNext} style={CloseStyles.nextButton}>
        <Text style={{ color: "white", alignSelf: "center", fontSize: 20 }}>
          {caption}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const CloseStyles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    left: 0,
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
    position: "absolute",
    right: 0,
    width: 250,
    height: 50,
    borderRadius: 12,
    position: "absolute",
    justifyContent: "center",
    backgroundColor: "#3370bc"
  },
  iconLine: {
    position: "absolute",
    width: 18,
    height: 2,
    borderRadius: 2,
    backgroundColor: "gray",
    alignSelf: "center"
  }
});
