import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Modal,
  Text,
} from "react-native";
import {
  AntDesign,
  Ionicons,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
// import ImagePicker from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";
import IconPickerModal from "./IconPickerModal";
import { Avatar } from "@rneui/themed";
import extendFunctions from "../constants/extendFunctions";
import { useRoute } from "@react-navigation/core";
import { useDispatch, useSelector } from "react-redux";
import { senderMessenger } from "../config/configSocket";
import { receiveMessenger } from "../config/configSocket";
import { retrieveMessenger } from "../config/configSocket";
import socket from "../config/configSocket";
import chatApi from "../api/chatApi";
import { lastMessenger } from "../redux/conversationSlice";
import { Pressable } from "react-native";
import { v4 as uuidv4 } from "uuid";
import * as ImagePicker from "expo-image-picker";
import AWS from "aws-sdk";
import * as FileSystem from "expo-file-system";
import { decode } from "base-64";
import * as Crypto from "expo-crypto";
import { test } from "../config/configSocket";
const ChatGroup = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const userSender = useSelector((state) => state.userLogin.user);
  // const userReceiver = route.params.member;
  const groupData = useSelector((state) => state.groupsInit.group);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isIconPickerModalVisible, setIconPickerModalVisible] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState(""); // State để lưu trữ nội dung nhận được
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [imageURL, setImageURL] = useState();
  const iconRef = useRef(null);
  const navigation = useNavigation();
  const formatTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  };
  const handleSend = () => {
    test({ roomId: groupData._id, messenger: newMessage });
    setNewMessage("");
  };
  const handlerGroupOption = () => {
    navigation.navigate("GroupOption");
  };
  useEffect(() => {
    socket.on("receiveMessage", (call) => {
      console.log("Test from Client FE:", call);
    });
  }, [socket]);
  const renderItem = ({ item }) => (
    <Pressable onPress={() => handleSelectMessage(item.idMessenger)}>
      {item.sender !== userSender._id && (
        <View style={{ position: "absolute", top: 15 }}>
          <Avatar
            size={30}
            rounded
            title={extendFunctions.getAvatarName(userReceiver.name)}
            containerStyle={{ backgroundColor: userReceiver.avatar.color }}
          />
        </View>
      )}
      <View
        style={
          item.sender === userSender._id
            ? styles.sentMessage
            : styles.receivedMessage
        }
      >
        {item.sender === userSender._id &&
          selectedMessage === item.idMessenger && (
            <View
              style={{
                position: "absolute",
                left: -110,
                top: 30,
                backgroundColor: "#f1f1f5",
                borderRadius: 8,
                height: 25,
                width: 100,
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <TouchableOpacity>
                <MaterialIcons name="delete" size={20} color="gray" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons
                  name="reload"
                  size={20}
                  color="gray"
                  onPress={() => handleDeleteMessage(item.idMessenger)}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <AntDesign name="back" size={20} color="gray" />
              </TouchableOpacity>
            </View>
          )}

        {item.text.includes(
          "https://imagemessagehalo.s3.ap-southeast-1.amazonaws.com"
        ) ? (
          <View style={{ width: 150, height: 200, marginBottom: 10 }}>
            <Image
              source={{ uri: item.text }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain",
              }}
            />
          </View>
        ) : (
          <Text style={styles.messageContent}>
            {item.isDeleted ? "Tin nhắn đã thu hồi" : item.text}
          </Text>
        )}

        <Text style={styles.messageTime}>
          {item.isDeleted ? null : formatTime(item.createdAt)}
        </Text>
      </View>
    </Pressable>
  );

  // const headerTitle =
  // messages.length > 0 ? messages[messages.length - 1].sender : "";

  const renderBackButton = () => (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <AntDesign name="arrowleft" size={24} color="white" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("BottomTabNavigator");
          }}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{groupData.name}</Text>
        <TouchableOpacity style={{ position: "absolute", right: 120 }}>
          <Feather name="phone" size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={{ position: "absolute", right: 66 }}>
          <Feather name="video" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlerGroupOption}
          style={{ position: "absolute", right: 18 }}
        >
          <Feather name="list" size={25} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          // onPress={handleSendWithLike}
          style={styles.likeButton}
        ></TouchableOpacity>
      </View>

      <FlatList data={messages} renderItem={renderItem} />

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.imagePickerButton}
          // onPress={handleImagePick}
        >
          <Ionicons name="image" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconPickerButton}
          // onPress={handleOpenIconPicker}
        >
          <Ionicons name="happy" size={20} color="white" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={(e) => setNewMessage(e)}
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          {/* <Text style={styles.sendButtonText}>Gửi</Text> */}
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
      {selectedImage && (
        <View style={[styles.selectedImageContainer, styles.centeredContent]}>
          <View style={styles.selectedImage}>
            <Image
              source={{ uri: selectedImage }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain",
              }}
            />
          </View>

          <View style={styles.imageButtonsContainer}>
            <TouchableOpacity
              // onPress={handleDeleteImage}
              style={styles.imageButtonXoa}
            >
              <Text style={styles.imageButtonText}>Xóa ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              // onPress={handleSendImage}
              style={styles.imageButton}
            >
              <Text style={styles.imageButtonText}>Gửi ảnh</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Modal
        visible={isIconPickerModalVisible}
        transparent={true}
        animationType="slide"
      >
        {/* <IconPickerModal onIconPick={handleIconPick} ref={iconRef} /> */}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: "#c1c1bf",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498db",
    paddingVertical: 10,
    borderRadius: 10,
    paddingLeft: 10,
  },
  messageTime: {
    fontSize: 12,
    color: "gray",
  },
  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 15,
    marginTop: -15,
  },
  likeButton: {
    padding: 10,
    marginLeft: "auto",
  },
  sentMessage: {
    marginTop: 15,
    alignSelf: "flex-end",
    backgroundColor: "#e5efff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    maxWidth: "50%",
  },
  receivedMessage: {
    marginLeft: 36,
    marginTop: 15,
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    maxWidth: "50%",
  },
  messageImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  messageContent: {
    fontSize: 15,
    fontWeight: "500",
    color: "black",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  imagePickerButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#3498db",
  },
  iconPickerButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#3498db",
    marginLeft: 10,
  },
  input: {
    marginLeft: 10,
    flex: 1,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginRight: 10,
  },
  sendButton: {
    flexDirection: "row",
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  sendButtonText: {
    color: "white",
    marginRight: 5,
  },
  selectedImageContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
  },
  selectedImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  imageButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  imageButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 8,
  },
  imageButtonXoa: {
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 8,
  },
  imageButtonText: {
    color: "white",
  },
});

export default ChatGroup;
