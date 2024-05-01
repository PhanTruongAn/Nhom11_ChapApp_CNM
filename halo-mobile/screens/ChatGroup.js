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
  Keyboard,
  Alert,
} from "react-native";
import {
  AntDesign,
  Ionicons,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";

import IconPickerModal from "./IconPickerModal";
import { Avatar } from "@rneui/themed";
import extendFunctions from "../constants/extendFunctions";
import { useRoute } from "@react-navigation/core";
import { useDispatch, useSelector } from "react-redux";
import { retrieveMessGroup } from "../config/configSocket";
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
import { sendMessInGroup } from "../config/configSocket";
import groupApi from "../api/groupApi";
import Constants from "expo-constants";
import gifApi from "../api/gifApi";
const EmojiBoard = ({ onEmojiPick, isVisible, onClose }) => {
  const emojis = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😜",
    "🤪",
    "😝",
    "🤑",
    "🤗",
    "🤭",
    "🤫",
    "🤔",
  ];
  const emojiWidth = 40; // Đặt chiều rộng của mỗi emoji
  const emojiSpacing = 10; // Đặt khoảng cách giữa các emoji
  const snapToInterval = emojiWidth + emojiSpacing;

  const handleEmojiPick = (emoji) => {
    onEmojiPick(emoji);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.emojiBoard}>
      <View style={styles.emojiContainer}>
        <FlatList
          data={emojis}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          snapToInterval={snapToInterval}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleEmojiPick(item)}
              style={styles.emojiButton}
            >
              <Text style={styles.emojiText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const GifBoard = ({ onGifPick, isVisible, onClose, allGif }) => {
  const [selectedGif, setSelectedGif] = useState(null);

  const handleGifPick = (gif) => {
    setSelectedGif(gif);
    onGifPick(gif);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.gifBoard}>
      <FlatList
        data={allGif}
        horizontal={true}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleGifPick(item.uri)}
            style={styles.gifButton}
          >
            <Image source={{ uri: item.uri }} style={styles.gifImage} />
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text>Close</Text>
      </TouchableOpacity>
    </View>
  );
};
const ChatGroup = ({ navigation }) => {
  const route = useRoute();
  const dispatch = useDispatch();
  const userSender = useSelector((state) => state.userLogin.user);

  const groupData = useSelector((state) => state.groupsInit.group);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isIconPickerModalVisible, setIconPickerModalVisible] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState(""); // State để lưu trữ nội dung nhận được
  const [selectedIcon, setSelectedIcon] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isEmojiVisible, setEmojiVisible] = useState(false);
  const [isGifModalVisible, setGifModalVisible] = useState(false);
  const [selectedGif, setSelectedGif] = useState(null);
  const [allGif, setAllGif] = useState([]);
  const getGiff = async () => {
    const result = await gifApi.getAllGif();
    setAllGif(result.DT);
  };
  useEffect(() => {
    getGiff();
  }, []);
  // Hàm mở Modal chứa danh sách gif
  const handleOpenGifModal = () => {
    setGifModalVisible(true);
    Keyboard.dismiss();
    setEmojiVisible(false);
    if (selectedImage !== null) {
      Alert.alert("Bạn chỉ có thể gửi ảnh hoặc xóa ảnh để gửi gif");
      setGifModalVisible(false);
    }
  };
  // Hàm đóng Modal chứa danh sách gif
  const handleCloseGifModal = () => {
    setGifModalVisible(false);
  };
  const [members, setMembers] = useState([
    ...groupData.members,
    groupData.author,
  ]);
  const memberFilter = members.filter(
    (member) => member._id !== userSender._id
  );
  const getAllChat = async () => {
    const data = {
      groupId: groupData._id,
    };
    const res = await groupApi.getAllChatGroup(data);
    const filteredMessages = [];
    for (const message of res.DT) {
      if (message.deletedBy !== userSender._id) {
        filteredMessages.push(message);
      }
    }
    setMessages(filteredMessages);
  };

  useEffect(() => {
    socket.on("test", (res) => {
      setMessages((prevState) => [
        ...prevState,
        {
          idMessenger: res.idMessenger,
          sender: res.sender,
          groupId: res.groupId,
          isDeleted: res.isDeleted,
          text: res.text,
          createdAt: res.createdAt,
          receiver: res.receiver,
        },
      ]);
    });
    socket.on("RetrieveMessGroup", (res) => {
      setMessages((prevState) => {
        const updatedMessages = prevState.map((message) => {
          if (message.idMessenger === res.idMessenger) {
            return {
              ...message,
              isDeleted: res.isDeleted,
            };
          }
          return message;
        });
        return updatedMessages;
      });
    });
    socket.on("retrieveDelete", (call) => {
      navigation.navigate("ChatList");
    });
    socket.on("deleteGroup", (call) => {
      navigation.navigate("ChatList");
    });
    getAllChat();
  }, [socket]);

  console.log("Messages:", messages);
  const formatTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  };
  //Chon anh
  const handleImagePick = async () => {
    setNewMessage("");
    setEmojiVisible(false);
    Keyboard.dismiss();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result.uri);
      console.log("Hình ảnh đã được chọn:", result.uri);
    }
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
  };
  // Thực hiện cấu hình AWS SDK với thông tin xác thực của bạn
  const { ACCESS_KEY, SECRET_KEY, REGION } = Constants.manifest.extra;
  AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION,
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
            sender: userSender._id,
            isDeleted: false,
            groupId: groupData._id,
            text: `${imageUrl}`,
            createdAt: Date.now(),
            receiver: memberFilter,
          };

          // Gửi tin nhắn qua socket
          sendMessInGroup({
            ...data,
            sender: userSender,
            isDeleted: false,
          });

          // Cập nhật UI ngay lập tức
          setMessages((prevState) => [
            ...prevState,
            {
              idMessenger: data.idMessenger,
              sender: userSender,
              isDeleted: data.isDeleted,
              groupId: data.groupId,
              text: data.text,
              createdAt: data.createdAt,
            },
          ]);

          setNewMessage("");
          console.log("Data:", data);
          const res = await groupApi.sendMessGroup(data);
          setSelectedImage(null);
        }
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn kèm hình ảnh:", error);
      }
    } else if (newMessage.trim() !== "") {
      const data = {
        idMessenger: await generateUUID(),
        sender: userSender._id,
        isDeleted: false,
        groupId: groupData._id,
        text: newMessage,
        createdAt: Date.now(),
        receiver: memberFilter,
      };

      // Gửi tin nhắn qua socket
      sendMessInGroup({
        ...data,
        sender: userSender,
        isDeleted: false,
      });

      // Cập nhật UI ngay lập tức
      setMessages((prevState) => [
        ...prevState,
        {
          idMessenger: data.idMessenger,
          sender: userSender,
          isDeleted: data.isDeleted,
          groupId: data.groupId,
          text: data.text,
          createdAt: data.createdAt,
        },
      ]);

      setNewMessage("");
      console.log("Data:", data);
      const res = await groupApi.sendMessGroup(data);
    }
  };
  const handlerGroupOption = () => {
    navigation.navigate("GroupOption");
  };
  const handleSelectMessage = (messageId) => {
    if (selectedMessage === messageId) {
      // Nếu tin nhắn đã được chọn rồi, ẩn nó đi
      setSelectedMessage(null);
    } else {
      // Nếu tin nhắn chưa được chọn, hiển thị nó
      setSelectedMessage(messageId);
    }
  };
  const handlerDeleteMessage = async () => {
    const data = {
      _id: userSender._id,
      idMessenger: selectedMessage,
    };
    const newMessages = messages.filter(
      (item) => item.idMessenger !== selectedMessage
    );
    setMessages(newMessages);
    const rs = await groupApi.deleteMessage(data);
    console.log("Result: ", rs.DT);
  };
  const handleRetrieveMessage = async (messageId) => {
    const updatedMessages = messages.map((message) => {
      if (message.idMessenger === messageId) {
        return { ...message, isDeleted: true };
      }
      return message;
    });
    const user = {
      idMessenger: selectedMessage,
    };
    console.log("IdMess:", selectedMessage);
    setMessages(updatedMessages);
    const res = await groupApi.retrieveMessage(user);
    console.log("Data update:", res.DT);
    // const data = {
    //   ...res.DT,
    //   sender: userSender.phone,
    //   receiver: userReceiver.phone,
    // };
    retrieveMessGroup({ ...res.DT, sender: userSender });
  };
  // Hàm để mở IconPickerModal
  const handleEmojiPick = (emoji) => {
    setNewMessage((prev) => prev + emoji);
  };
  const handleCloseEmojiBoard = () => {
    setEmojiVisible(false);
  };
  console.log("Check:", isEmojiVisible);
  const handleOpenEmojiBoard = () => {
    if (selectedImage === null) {
      Keyboard.dismiss();
      setEmojiVisible(true);
    } else {
      Alert.alert(
        "Bạn chỉ có thể gửi ảnh hoặc xóa ảnh để gửi tin nhắn bình thường"
      );
    }
  };
  const handleGifPick = async (gif) => {
    try {
      setGifModalVisible(false);

      const data = {
        idMessenger: await generateUUID(),
        sender: userSender._id,
        isDeleted: false,
        groupId: groupData._id,
        text: `${gif}`,
        createdAt: Date.now(),
        receiver: memberFilter,
      };
      setMessages((prevState) => [
        ...prevState,
        {
          idMessenger: data.idMessenger,
          sender: userSender,
          isDeleted: data.isDeleted,
          groupId: data.groupId,
          text: data.text,
          createdAt: data.createdAt,
        },
      ]);
      sendMessInGroup({
        ...data,
        sender: userSender,
        isDeleted: false,
      });

      const res = await groupApi.sendMessGroup(data);
      setSelectedGif(null);
    } catch (error) {
      console.error("Lỗi khi gửi gif:", error);
    }
  };
  const renderItem = ({ item }) => (
    <Pressable onPress={() => handleSelectMessage(item.idMessenger)}>
      {item.sender._id !== userSender._id && (
        <View style={{ position: "absolute", top: 15 }}>
          <Avatar
            size={30}
            rounded
            title={extendFunctions.getAvatarName(item.sender.name)}
            containerStyle={{ backgroundColor: item.sender.avatar.color }}
          />
        </View>
      )}
      <View
        style={
          item.sender === userSender._id || item.sender._id === userSender._id
            ? styles.sentMessage
            : styles.receivedMessage
        }
      >
        {item.sender._id === userSender._id &&
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
              <TouchableOpacity onPress={handlerDeleteMessage}>
                <MaterialIcons name="delete" size={20} color="gray" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons
                  name="reload"
                  size={20}
                  color="gray"
                  onPress={() => handleRetrieveMessage(item.idMessenger)}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <AntDesign name="back" size={20} color="gray" />
              </TouchableOpacity>
            </View>
          )}

        {item.text.includes(
          "https://imagemessagehalo.s3.ap-southeast-1.amazonaws.com"
        ) ||
        item.text.includes(
          "https://gifchathalo.s3.ap-southeast-1.amazonaws.com"
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
          onPress={handleImagePick}
        >
          <Ionicons name="image" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconPickerButton}
          onPress={handleOpenEmojiBoard}
        >
          <Ionicons name="happy" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconPickerButton}
          onPress={handleOpenGifModal}
        >
          <MaterialIcons name="gif" size={24} color="white" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage + selectedIcon}
          onTouchStart={() => {
            if (isEmojiVisible === true) {
              handleCloseEmojiBoard();
            }
          }}
          onChangeText={(e) => {
            if (selectedImage === null) {
              setNewMessage(e);
            } else {
              Alert.alert(
                "Bạn chỉ có thể gửi ảnh hoặc xóa ảnh để gửi tin nhắn bình thường"
              );
            }
          }}
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          {/* <Text style={styles.sendButtonText}>Gửi</Text> */}
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
      {isEmojiVisible && (
        <View style={styles.emojiBoard}>
          <EmojiBoard
            isVisible={isEmojiVisible}
            onEmojiPick={handleEmojiPick}
            onClose={handleCloseEmojiBoard}
          />
        </View>
      )}
      {isGifModalVisible && (
        <View style={styles.gifBoard}>
          <GifBoard
            isVisible={isGifModalVisible}
            onGifPick={handleGifPick}
            onClose={handleCloseGifModal}
            allGif={allGif}
          />
        </View>
      )}
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
            <TouchableOpacity onPress={handleSend} style={styles.imageButton}>
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
    padding: 5,
    borderRadius: 8,
    backgroundColor: "#3498db",
  },
  iconPickerButton: {
    padding: 5,
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
    padding: 8,
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
  emojiBoard: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 10,
  },
  emojiContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  emojiButton: {
    margin: 5,
  },
  emojiText: {
    fontSize: 24,
  },
  gifBoard: {
    borderRadius: 5,
    marginTop: 8,
    backgroundColor: "white",
    padding: 10,
  },
  gifButton: {
    margin: 5,
  },
  gifImage: {
    width: 50,
    height: 50,
  },

  closeButton: {
    alignItems: "center",
    padding: 10,
  },
});

export default ChatGroup;
