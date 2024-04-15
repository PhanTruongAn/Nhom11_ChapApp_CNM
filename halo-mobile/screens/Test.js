import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
const Test = () => {
  const formatTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  };
  return (
    // <View style={styles.sentMessage}>
    //   {/* {item.image && (
    //     <Image source={{ uri: item.image }} style={styles.messageImage} />
    //   )} */}
    //   <Text style={styles.messageContent}>Hello</Text>
    //   <Text style={styles.messageTime}>{formatTime(Date.now())}</Text>
    // </View>
    <View style={{ flexDirection: "row" }}>
      <View
        style={{
          backgroundColor: "#f1f1f5",
          borderRadius: 8,
          height: 25,
          width: 100,
          alignSelf: "center",
          //   left: -50,
          //   top: 70,
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <TouchableOpacity>
          <MaterialIcons name="delete" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="reload" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity>
          <AntDesign name="back" size={20} color="gray" />
        </TouchableOpacity>
      </View>
      <View style={styles.sentMessage}>
        <Text style={styles.messageContent}>vdsnjkvvbdhjv</Text>
        <Text style={styles.messageTime}>{formatTime(Date.now())}</Text>
      </View>
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({
  sentMessage: {
    marginTop: 15,
    alignSelf: "flex-end",
    backgroundColor: "#e5efff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    maxWidth: 180,
    alignSelf: "center",
    marginLeft: 200,
  },
  messageContent: {
    fontSize: 15,
    fontWeight: "500",
    color: "black",
  },
  messageTime: {
    fontSize: 12,
    color: "gray",
  },
});
