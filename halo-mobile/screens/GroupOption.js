import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import { AntDesign, Entypo, Feather, FontAwesome5 } from "@expo/vector-icons";
import { Avatar } from "@rneui/themed";
import { useRoute } from "@react-navigation/core";
import { useState } from "react";
import socket from "../config/configSocket";
import { useDispatch, useSelector } from "react-redux";
import groupApi from "../api/groupApi";
import { deleteGroupSocket } from "../config/configSocket";
import { useEffect } from "react";
const GroupOption = ({ navigation }) => {
  const route = useRoute();
  const user = useSelector((state) => state.userLogin.user);
  const groupOption = useSelector((state) => state.groupsInit.group);
  useEffect(() => {
    socket.on("deleteGroup", (call) => {
      alert("Nhóm đã bị xóa");
      navigation.navigate("ChatList");
    });
  }, [socket]);

  const handlerDeleteGroup = async () => {
    const data = {
      _id: groupOption._id,
    };
    const res = await groupApi.deleteGroup(data);
    if (res) {
      deleteGroupSocket();
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            navigation.navigate("ChatGroup");
          }}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
          <Text style={styles.headerTitle}>Tùy chọn</Text>
        </Pressable>
      </View>
      <View style={styles.avatarContainer}>
        <Avatar
          size={90}
          rounded
          source={require("../assets/avatar-default.jpeg")}
        />
      </View>
      <Text style={styles.groupName}>{groupOption.name}</Text>
      <View style={styles.functionIconsContainer}>
        <View style={styles.functionIcon}>
          <Pressable
            onPress={() => {
              navigation.navigate("AddMember");
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 150,
                backgroundColor: "#dfe2e7",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AntDesign name="adduser" size={22} color="#424344" />
            </View>

            <Text
              style={{ width: 70, height: 40, fontSize: 13, paddingTop: 5 }}
            >
              Thêm thành viên
            </Text>
          </Pressable>
        </View>
        <View style={styles.functionIcon}>
          <Pressable>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 150,
                backgroundColor: "#dfe2e7",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AntDesign name="search1" size={22} color="#424344" />
            </View>
            <Text
              style={{ width: 70, height: 40, fontSize: 13, paddingTop: 5 }}
            >
              Tìm tin nhắn
            </Text>
          </Pressable>
        </View>
        <View style={styles.functionIcon}>
          <Pressable>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 150,
                backgroundColor: "#dfe2e7",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AntDesign name="edit" size={22} color="#424344" />
            </View>
            <Text
              style={{ width: 70, height: 40, fontSize: 13, paddingTop: 5 }}
            >
              Đổi tên nhóm
            </Text>
          </Pressable>
        </View>
        <View style={styles.functionIcon}>
          <Pressable>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 150,
                backgroundColor: "#dfe2e7",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Entypo name="image" size={22} color="#424344" />
            </View>
            <Text
              style={{ paddingTop: 5, width: 70, height: 40, fontSize: 13 }}
            >
              Đổi ảnh nhóm
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.descriptionContainer}>
        <View style={styles.inputContainer}>
          <Feather name="info" size={24} color="gray" />
          <TextInput style={styles.input} placeholder="Thêm mô tả nhóm" />
        </View>
      </View>
      <View style={styles.pressablesContainer}>
        <Pressable style={styles.pressable}>
          <Text style={styles.pressableText}>Ảnh, file, đã gửi</Text>
          <Entypo name="folder-images" size={21} color="gray" />
        </Pressable>
        <Pressable
          style={styles.pressable}
          onPress={() => {
            navigation.navigate("MemberGroup");
          }}
        >
          <Text style={styles.pressableText}>Xem thành viên</Text>
          <FontAwesome5 name="users" size={21} color="gray" />
        </Pressable>
        <Pressable style={styles.pressable}>
          <Text style={styles.pressableText}>Chuyển quyền trưởng nhóm</Text>
          <AntDesign name="addusergroup" size={23} color="gray" />
        </Pressable>
        <Pressable style={styles.pressable}>
          <Text style={styles.pressableText}>Xóa thành viên nhóm</Text>
          <AntDesign name="deleteuser" size={23} color="gray" />
        </Pressable>

        <Pressable style={styles.pressable} onPress={handlerDeleteGroup}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "red",
            }}
          >
            Xóa nhóm
          </Text>
          <AntDesign name="deleteusergroup" size={23} color="gray" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaedf0",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    // padding: 10,
  },
  groupName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    alignSelf: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "600",
  },
  avatarContainer: {
    alignSelf: "center",

    justifyContent: "center",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 150,
  },
  functionIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  functionIcon: {
    marginLeft: 20,
    alignItems: "center",
    flex: 1,
  },

  descriptionContainer: {
    backgroundColor: "white",
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,
    padding: 5,
  },
  input: {
    marginLeft: 10,
    flex: 1,
  },
  pressablesContainer: {
    backgroundColor: "white",
    marginTop: 20,
    borderRadius: 10,
  },
  pressable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "lightgray",
  },
  pressableText: {
    fontSize: 16,
    fontWeight: "600",
  },
  icon: {
    marginRight: 10,
  },
});

export default GroupOption;
