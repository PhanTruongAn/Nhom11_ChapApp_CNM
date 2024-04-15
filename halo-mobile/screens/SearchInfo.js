import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { Avatar } from "@rneui/themed";
import { useRoute } from "@react-navigation/core";
import { useSelector } from "react-redux";
import extendFunctions from "../constants/extendFunctions";
import Icon from "react-native-vector-icons/AntDesign";
import friendApi from "../api/friendApi";
const SearchInfo = ({ navigation }) => {
  const userLogin = useSelector((state) => state.userLogin.user);
  const route = useRoute();
  const user = route.params.searchResults;

  const handlerSendAddFriend = async () => {
    let data = {
      phoneSender: userLogin.phone,
      phoneReceiver: user.phone,
    };
    const req = await friendApi.sendAddFriend(data);
    console.log("Req:", req);
  };
  const image = extendFunctions.randomImage();
  return (
    <View style={styles.container}>
      <View style={styles.headerTop}>
        <Image
          source={{
            uri: image,
          }}
          style={{
            flex: 1,
            width: null,
            height: null,
            resizeMode: "cover",
          }}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Icon
          name="arrowleft"
          size={25}
          style={{ paddingLeft: 20, marginTop: -170, color: "white" }}
        />
      </TouchableOpacity>
      <View style={styles.header}>
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
        <Text style={styles.headerName}>{user.name}</Text>
      </View>
      <View style={styles.information}>
        <Text style={styles.information_title}>Thông tin giới thiệu</Text>
        <TouchableOpacity
          style={{
            width: 70,
            height: 40,
            backgroundColor: "#1faeeb",
            justifyContent: "center",
            borderRadius: 10,
            marginLeft: 300,
            marginTop: -50,
          }}
          onPress={handlerSendAddFriend}
        >
          <Text style={{ fontSize: 16, alignSelf: "center" }}>Kết bạn</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 70,
            height: 40,
            backgroundColor: "#1faeeb",
            justifyContent: "center",
            borderRadius: 10,
            marginLeft: 210,
            marginTop: -40,
          }}
        >
          <Text style={{ fontSize: 16, alignSelf: "center" }}>Chat</Text>
        </TouchableOpacity>
        <View style={styles.index_container}></View>
      </View>
    </View>
  );
};

export default SearchInfo;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  headerTop: {
    width: "100%",
    height: 190,

    overflow: "hidden",
  },
  header: {
    width: "80%",
    height: 50,
    marginTop: -80,
    flexDirection: "row",
    marginLeft: 20,
    marginBottom: 10,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 600,
    alignSelf: "center",
    marginLeft: 20,
    color: "white",
  },
  information: {
    backgroundColor: "white",
    width: "100%",
    height: 280,
  },
  information_title: {
    fontSize: 16,
    fontWeight: 500,
    padding: 17,
  },
  index_container: {
    width: "95%",
    height: "55%",
    marginLeft: 17,
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  custom: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#dadada",
  },
  index: {
    padding: 7,
  },
  button: {
    backgroundColor: "#dadada",
    width: "80%",
    height: 35,
    alignSelf: "center",
    borderRadius: 20,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
  },
  icon: {
    alignSelf: "center",
  },
});
