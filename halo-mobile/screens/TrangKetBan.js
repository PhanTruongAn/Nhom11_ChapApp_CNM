import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { Octicons, Fontisto, Ionicons } from "@expo/vector-icons";
import { Avatar } from "@rneui/themed";
import { useRoute } from "@react-navigation/core";
import { useDispatch, useSelector } from "react-redux";
import extendFunctions from "../constants/extendFunctions";
import Icon from "react-native-vector-icons/AntDesign";
import friendApi from "../api/friendApi";
import { updateUser } from "../redux/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handlerSendText } from "../config/configSocket";
const TrangKetBan = ({ navigation }) => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin.user);
  const route = useRoute();
  const user = route.params.searchResults;
  const handlerSendMessenger = () => {
    navigation.navigate("ChatScreen", { user: user });
  };
  const handlerSendAddFriend = async () => {
    let data = {
      phoneSender: userLogin.phone,
      phoneReceiver: user.phone,
    };
    const req = await friendApi.sendAddFriend(data);
    const senderData = {
      _id: req.DT._id,
      name: req.DT.name,
      phone: req.DT.phone,
      avatar: req.DT.avatar,
    };
    dispatch(updateUser(req.DT));
    handlerSendText({
      sender: userLogin.phone,
      receiver: user.phone,
      user: senderData,
    });
    // await AsyncStorage.setItem("login", JSON.stringify(req.DT));
    console.log("Req:", req);
  };
  const image = extendFunctions.randomImage();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}
        onPress={() => navigation.goBack()}
      >
        <Octicons name="arrow-left" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}
        onPress={() => navigation.navigate("BaCham")}
      >
        <Octicons name="kebab-horizontal" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.ViewAnhBia}>
        <Image style={styles.ViewAnhBiaImage} source={{ uri: image }} />
      </View>
      <View style={styles.ViewAvatar}>
        {user.avatar.uri ? ( // Nếu chưa chọn ảnh mới, nhưng người dùng đã có ảnh, hiển thị ảnh của người dùng
          <Avatar size={100} rounded source={{ uri: user.avatar.uri }} />
        ) : (
          // Nếu chưa chọn ảnh mới và người dùng cũng chưa có ảnh, hiển thị avatar mặc định
          <Avatar
            size={100}
            rounded
            title={extendFunctions.getAvatarName(user.name)}
            containerStyle={{ backgroundColor: user.avatar.color }}
          />
        )}
      </View>
      <View style={styles.viewNameText}>
        <Text style={styles.nameText}>{user.name}</Text>
      </View>
      <View style={styles.viewBio}>
        <Text style={styles.bio}>
          Bạn chưa thể xem nhật ký của {user.name} khi chưa là bạn bè
        </Text>
      </View>
      <View style={styles.action}>
        <TouchableOpacity
          onPress={handlerSendMessenger}
          style={styles.BtnNhanTin}
        >
          <Octicons name="comment-discussion" size={24} color="blue" />
          <Text
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "blue",
              marginLeft: 10,
            }}
          >
            Nhắn tin
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlerSendAddFriend}
          style={styles.BtnKetBan}
        >
          <Octicons name="person-add" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TrangKetBan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
  },
  viewNameText: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  viewBio: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    textAlign: "center",
  },
  bio: {
    fontSize: 16,
    fontColor: "lightgray",
  },
  action: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    paddingHorizontal: 50,
    alignItems: "center",
  },
  ViewAnhBia: {
    width: "100%",
    height: 180,
    backgroundColor: "#e5e5e5",
    overflow: "hidden",
  },
  ViewAnhBiaImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover",
  },
  ViewAvatar: {
    justifyContent: "center",
    width: 140,
    height: 140,
    // borderWidth: 2,
    // borderColor: "black",
    borderRadius: 100,
    overflow: "hidden",
    marginTop: -50,
    position: "absolute",
    top: 150,
    left: "50%" /* Căn giữa theo chiều rộng của màn hình */,
    marginLeft: -70,
  },
  ViewAvatarImage: {
    width: 100,
    height: 100,
  },
  BtnNhanTin: {
    padding: 15,
    backgroundColor: "#a6b4de",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 5,
    height: 50,
    width: "70%",
    flexDirection: "row",
  },
  BtnKetBan: {
    padding: 15,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 5,
    height: 50,
    width: "25%",
  },
});
