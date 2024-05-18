import React, { useState, useRef, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import { Avatar } from "@rneui/themed";
import SearchScreen from "./SearchScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import extendFunctions from "../constants/extendFunctions";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, updateUser } from "../redux/userSlice";
import { groupConversation, lastMessenger } from "../redux/conversationSlice";
import { handleCustomClient, reload } from "../config/configSocket";
import chatApi from "../api/chatApi";
import userApi from "../api/userApi";
import groupApi from "../api/groupApi";
import { initGroup } from "../redux/groupSlice";
import { initUsers } from "../redux/conversationSlice";
import { Pressable } from "react-native";
import { handlerJoinRoom } from "../config/configSocket";
import socket from "../config/configSocket";

const ChatListScreen = ({ navigation }) => {
  const conversation = useSelector((state) => state.usersInit.users);
  // console.log("Conversation:", conversation);
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false); // Flag to track if useEffect is done
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Flag to track if data is loaded from Redux
  const [chatList, setChatList] = useState([]);
  const [newMess, setNewMess] = useState(false);
  ///////// Create Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const searchInputRef = useRef(null);
  const getData = async (data) => {
    const req = await userApi.getData(data);
    if (req) {
      dispatch(updateUser(req.DT));
      const conversation = await chatApi.getConversation(req.DT);
      const groups = await groupApi.getAllGroup(req.DT);
      const latestGroup = await groupApi.getLatestMesGroup(req.DT);
      const newArray = latestGroup.DT.map((item) => ({
        _id: item.group?._id,
        latestMessage: {
          createdAt: item.createdAt,
          text: item.text,
          isDeleted: item.isDeleted,
        },
      }));
      // Sử dụng reduce để kết hợp các thông tin
      const result = groups.DT.map((group) => {
        const latestMessage = newArray.find((item) => item._id === group._id)
          ?.latestMessage || {
          createdAt: "",
          text: "",
          // isDeleted: item.isDeleted,
        };
        return {
          ...group,
          latestMessage,
        };
      });
      dispatch(initUsers(conversation.DT));
      dispatch(groupConversation(result));
      // console.log("Conversation: ", conversation);
    }
  };
  const fetchData = async () => {
    try {
      // await AsyncStorage.removeItem("login");
      // await AsyncStorage.removeItem("isLoggedIn");
      const data = await AsyncStorage.getItem("login");
      const convert = JSON.parse(data);
      getData(convert);
      setIsDataLoaded(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [dispatch]);
  const userLogin = useSelector((state) => {
    if (isDataLoaded) {
      return state.userLogin.user;
    } else {
      return null;
    }
  });

  useEffect(() => {
    if (userLogin !== null) {
      setIsReady(true);
      setChatList(userLogin.friends);
      handleCustomClient({ customId: userLogin.phone });
    }
  }, [userLogin]);

  useEffect(() => {
    fetchData();
    socket.on("retrieve", (call) => {
      fetchData();
    });
    socket.on("retrieveDelete", (call) => {
      fetchData();
    });
    socket.on("deleteGroup", (call) => {
      fetchData();
    });
    socket.on("retrieveLeaveGroup", (call) => {
      fetchData();
    });
    socket.on("reload", (call) => {
      fetchData();
    });
    socket.on("deleteGroup", (call) => {
      fetchData();
    });
    socket.on("receiveMess", (call) => {
      // setNewMess(true);
      fetchData();
    });
    socket.on("receiveMessGroup", (call) => {
      fetchData();
    });
  }, [socket]);

  const onFocusSearch = () => {
    navigation.navigate("SearchScreen");
  };
  const handlerTime = (timeString) => {
    if (!timeString) {
      return "";
    }
    const currentTime = new Date().getTime(); // Lấy thời gian hiện tại
    const messageTime = new Date(timeString).getTime(); // Chuyển đổi chuỗi thời gian thành giá trị thời gian Unix
    const timeDiff = currentTime - messageTime; // Tính chênh lệch thời gian

    // Tính toán số ngày, giờ, phút, giây
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // Trả về kết quả
    if (days > 0) {
      return `${days} ngày`;
    } else if (hours > 0) {
      return `${hours} giờ`;
    } else if (minutes > 0) {
      return `${minutes} phút`;
    } else {
      return `${seconds} giây`;
    }
  };

  const isImageURL = (url) => {
    return url.toLowerCase().match(/\.(jpeg|jpg|png)$/) != null;
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (item.members) {
          dispatch(initGroup(item));
          handlerJoinRoom({
            groupId: item._id,
            user: userLogin.phone,
            groupName: item.name,
          });
          navigation.navigate("ChatGroup");
        } else {
          navigation.navigate("ChatScreen", { user: item });
        }
      }}
      style={styles.itemContainer}
    >
      <View style={{ padding: 8, alignSelf: "center" }}>
        {item.avatar.uri ? (
          <View style={{ marginTop: -15 }}>
            <Avatar size={50} rounded source={{ uri: item.avatar.uri }} />
          </View>
        ) : item.members ? (
          <View style={styles.container}>
            <View style={styles.row}>
              <Avatar
                size={30}
                rounded
                title={extendFunctions.getAvatarName(item.author.name)}
                containerStyle={{
                  backgroundColor: item.author.avatar.color,
                }}
              />
              <Avatar
                size={30}
                rounded
                title={
                  item.members && item.members.length > 0
                    ? extendFunctions.getAvatarName(item.members[0].name)
                    : ""
                }
                containerStyle={{
                  backgroundColor: item.members[0].avatar.color,
                }}
              />
            </View>
            <View style={styles.row}>
              {item.members && item.members[1] ? (
                <Avatar
                  size={30}
                  rounded
                  title={
                    item.members && item.members.length > 1
                      ? extendFunctions.getAvatarName(item.members[1].name)
                      : ""
                  }
                  containerStyle={{
                    backgroundColor: item.members[1].avatar.color,
                  }}
                />
              ) : null}
              {item.members && item.members[2] ? (
                <Avatar
                  size={30}
                  rounded
                  titleStyle={{ color: "#7589a3", fontWeight: "600" }}
                  title={
                    item.members && item.members.length > 2
                      ? `${item.members.length - 2}`
                      : ""
                  }
                  containerStyle={{ backgroundColor: "#e6e8ea" }}
                />
              ) : null}
            </View>
          </View>
        ) : (
          <Avatar
            size={50}
            rounded
            title={extendFunctions.getAvatarName(item.name)}
            containerStyle={{ backgroundColor: item.avatar.color }}
          />
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        {item.latestMessage && (
          <Text style={styles.message}>
            {item.latestMessage.isDeleted
              ? "Tin nhắn đã được thu hồi"
              : item.latestMessage.text.includes(
                  "https://gifchathalo.s3.ap-southeast-1.amazonaws.com"
                )
              ? "[GIF]"
              : item.latestMessage.text.includes(
                  "https://videochathalo.s3.ap-southeast-1.amazonaws.com"
                )
              ? "[Video]"
              : item.latestMessage.text}
          </Text>
        )}
        {item.lastMessage && (
          <Text style={styles.message}>
            {item.lastMessage.includes(
              "https://gifchathalo.s3.ap-southeast-1.amazonaws.com"
            )
              ? "[GIF]"
              : item.lastMessage.includes(
                  "https://videochathalo.s3.ap-southeast-1.amazonaws.com"
                )
              ? "[Video]"
              : isImageURL(item.lastMessage)
              ? "Đã gửi 1 ảnh"
              : item.lastMessage}
          </Text>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.time}>
          {item.latestMessage
            ? `${handlerTime(item.latestMessage.createdAt)}`
            : ""}
          {item.lastMessageTime ? `${handlerTime(item.lastMessageTime)}` : ""}
        </Text>
        {/* {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text>{item.unreadCount}</Text>
          </View>
        )} */}
      </View>
    </TouchableOpacity>
  );

  if (!isReady) {
    // Wait for useEffect to complete
    return null;
  }

  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.searchContainer} onPress={onFocusSearch}>
        <Ionicons
          name="search"
          size={24}
          color="#555"
          style={styles.searchIcon}
        />
        <Text ref={searchInputRef} style={styles.searchInput}>
          Search
        </Text>
        <TouchableOpacity onPress={toggleModal}>
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>

      <FlatList data={conversation} renderItem={renderItem} />

      <Modal
        animationType="none"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableOpacity onPress={toggleModal} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={toggleModal}>
              <Pressable
                style={styles.modalItem}
                onPress={() => {
                  toggleModal();
                  navigation.navigate("CreateGroup");
                }}
              >
                <AntDesign name="addusergroup" size={24} color="gray" />
                <Text style={styles.modalText}>Tạo nhóm</Text>
              </Pressable>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModal}>
              <Pressable style={styles.modalItem}>
                <AntDesign name="adduser" size={24} color="gray" />
                <Text style={styles.modalText}>Kết bạn</Text>
              </Pressable>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
    left: -7,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginRight: -10,
    alignSelf: "center",
  },
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  modalContainer: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    position: "absolute",
    top: 25,
    right: 25,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5, // Điều chỉnh độ đậm của border nổi
    shadowRadius: 3.84,
    elevation: 10, // Điều chỉnh độ nổi của border
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  modalText: {
    marginLeft: 10,
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#3498db", // Màu xanh dương
    borderRadius: 5,
    paddingHorizontal: 10,
    width: "100%",
  },
  searchIcon: {
    marginRight: 10,
    color: "white",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: "white",
  },
  clearIcon: {
    marginLeft: 10,
    color: "black",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    top: 10,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: "#ddd",
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 15,
    position: "absolute",
    top: -3,
    // marginTop: -15,
  },
  message: {
    fontSize: 16,
    fontWeight: "500",
    color: "#777",
    // color: "black",
    marginLeft: 15,
    marginTop: 18,
  },
  messageNew: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
    marginLeft: 15,
    marginTop: 18,
  },
  info: {
    alignItems: "flex-end",
  },
  time: {
    color: "#777",
  },
  unreadBadge: {
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
});

export default ChatListScreen;
