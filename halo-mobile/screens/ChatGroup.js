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

const ChatGroup = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const userSender = useSelector((state) => state.userLogin.user);
  const userReceiver = route.params.member[1];
  //   const members = route.params.member;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isIconPickerModalVisible, setIconPickerModalVisible] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState(""); // State để lưu trữ nội dung nhận được
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [imageURL, setImageURL] = useState();

  const formatTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  };
  console.log("Messages:", messages);
  const getAllChat = async () => {
    const data = {
      sender: userSender.phone,
      receiver: userReceiver.phone,
    };
    const res = await chatApi.getAllChat(data);
    setMessages(res.DT);
  };
  useEffect(() => {
    socket.on("receiveMessenger", (res) => {
      console.log("Res:", res);
      setMessages((prevState) => [
        ...prevState,
        {
          idMessenger: res.idMessenger,
          isDeleted: res.isDeleted,
          sender: userReceiver._id,
          text: res.text,
          receiver: userSender._id,
          createdAt: res.createdAt,
        },
      ]);
    });
    getAllChat();
  }, [socket]);

  useEffect(() => {
    socket.on("retrieveMes", (res) => {
      console.log("Res:", res);
      setMessages((prevState) => {
        const updatedMessages = prevState.map((message) => {
          if (message.idMessenger === res.idMessenger) {
            return {
              ...message,
              isDeleted: res.isDeleted,
              // text: res.text,
              // createdAt: res.createdAt,
            };
          }
          return message;
        });
        return updatedMessages;
      });
    });
  }, [socket]);
  const iconRef = useRef(null);
  const navigation = useNavigation();

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result) {
      setSelectedImage(result.uri);
      console.log("Hình ảnh đã được chọn:", result.uri);
    }
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
  };

  // Hàm xử lý gửi
  const handleSendImage = () => {};
  // Thực hiện cấu hình AWS SDK với thông tin xác thực của bạn
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION,
  });

  const s3 = new AWS.S3();

  const handlerUpdateImageToS3 = async (selectedImage) => {
    try {
      const imageUri = selectedImage;
      const imageInfo = await FileSystem.getInfoAsync(imageUri);
      const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Chuyển dữ liệu base64 thành ArrayBuffer
      const arrayBuffer = base64ToArrayBuffer(imageBase64);

      const fileName = `${userSender._id}-${Date.now()}.jpg`;

      const params = {
        Bucket: "imagemessagehalo",
        Key: fileName,
        Body: arrayBuffer,
        ContentType: imageInfo.mimeType,
      };
      const imageUrl = await s3
        .upload(params)
        .promise()
        .then((data) => data.Location);
      console.log("Upload hình ảnh thành công:", imageUrl);
      return imageUrl; // Trả về giá trị imageUrl cho hàm gọi
    } catch (error) {
      Alert.alert("Có lỗi xảy ra khi tải ảnh lên");
      return null; // Trả về null nếu có lỗi
    }
  };

  // Hàm chuyển đổi base64 thành ArrayBuffer
  const base64ToArrayBuffer = (base64) => {
    const binaryString = decode(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  };
  const generateUUID = async () => {
    const randomBytes = await Crypto.getRandomBytesAsync(16);
    const uuid = Array.from(new Uint8Array(randomBytes))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return `${uuid.substr(0, 8)}-${uuid.substr(8, 4)}-${uuid.substr(
      12,
      4
    )}-${uuid.substr(16, 4)}-${uuid.substr(20)}`;
  };
  const handleSend = async () => {
    console.log("anh sau khi an gui:", selectedImage);
    if (selectedImage != null) {
      try {
        const imageUrl = await handlerUpdateImageToS3(selectedImage);
        console.log("link anh:", imageUrl);

        if (imageUrl) {
          const data = {
            idMessenger: await generateUUID(),
            sender: userSender.phone,
            receiver: userReceiver.phone,
            text: `${imageUrl}`,
            createdAt: Date.now(),
          };

          setMessages([
            ...messages,
            {
              ...data,
              sender: userSender._id,
              text: `${imageUrl}`,
              receiver: userReceiver._id,
              isDeleted: false,
            },
          ]);

          senderMessenger({
            ...data,
            isDeleted: false,
          });

          const res = await chatApi.sendMessenger(data);
          setSelectedImage(null);
          setImageURL(null);
          console.log(res);
        }
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn kèm hình ảnh:", error);
      }
    } else if (newMessage.trim() !== "") {
      // Nếu người dùng không chọn hình ảnh và có tin nhắn văn bản, gửi tin nhắn văn bản
      const data = {
        idMessenger: await generateUUID(),
        sender: userSender.phone,
        receiver: userReceiver.phone,
        text: newMessage,
        createdAt: Date.now(),
      };
      setMessages([
        ...messages,
        {
          ...data,
          sender: userSender._id,
          text: newMessage,
          receiver: userReceiver._id,
          isDeleted: false,
        },
      ]);
      setNewMessage("");

      senderMessenger({
        ...data,
        isDeleted: false,
      });
      const res = await chatApi.sendMessenger(data);
      console.log(res);
    }
  };

  const handleSendWithLike = () => {
    // Tương tự như hàm handleSend, bạn có thể thêm logic xử lý khi gửi chat icon thích ở đây
    // Ví dụ: setMessages([...], setNewMessage(""), setSelectedImage(null), ...);
  };

  // Cập nhật tin nhắn được chọn khi người dùng ấn vào
  const handleSelectMessage = (messageId) => {
    if (selectedMessage === messageId) {
      // Nếu tin nhắn đã được chọn rồi, ẩn nó đi
      setSelectedMessage(null);
    } else {
      // Nếu tin nhắn chưa được chọn, hiển thị nó
      setSelectedMessage(messageId);
    }
  };
  const handleDeleteMessage = async (messageId) => {
    const updatedMessages = messages.map((message) => {
      if (message.idMessenger === messageId) {
        return { ...message, isDeleted: true };
      }
      return message;
    });
    const user = {
      idMessenger: selectedMessage,
    };
    setMessages(updatedMessages);
    const res = await chatApi.retrieveMessenger(user);
    const data = {
      ...res.DT,
      sender: userSender.phone,
      receiver: userReceiver.phone,
    };
    retrieveMessenger({ ...data });
    console.log("Data update:", res.DT);
  };
  const handleOpenIconPicker = () => {
    setIconPickerModalVisible(true);
  };

  const handleIconPick = (selectedIcon) => {
    // Cập nhật biểu tượng khi người dùng chọn
    // setSelectedIcon(selectedIcon);
    // setIconPickerModalVisible(false);
  };
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{userReceiver.name}</Text>
        <TouchableOpacity style={{ position: "absolute", right: 120 }}>
          <Feather name="phone" size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={{ position: "absolute", right: 66 }}>
          <Feather name="video" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={{ position: "absolute", right: 18 }}>
          <Feather name="list" size={25} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSendWithLike}
          style={styles.likeButton}
        ></TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        // keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.imagePickerButton}
          onPress={handleImagePick}
        >
          <Ionicons name="image" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconPickerButton}
          onPress={handleOpenIconPicker}
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
              onPress={handleDeleteImage}
              style={styles.imageButtonXoa}
            >
              <Text style={styles.imageButtonText}>Xóa ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSendImage}
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
        <IconPickerModal onIconPick={handleIconPick} ref={iconRef} />
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
