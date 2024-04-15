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
import { handleCustomClient } from "../config/configSocket";
import chatApi from "../api/chatApi";
import userApi from "../api/userApi";
import { initUsers } from "../redux/conversationSlice";
import { Pressable } from "react-native";
const ChatListScreen = ({ navigation }) => {
  const conversation = useSelector((state) => state.usersInit.users);
  // console.log("Conversation:", conversation);
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false); // Flag to track if useEffect is done
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Flag to track if data is loaded from Redux
  const [chatList, setChatList] = useState([]);
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
      dispatch(initUsers(conversation.DT));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("login");
        const convert = JSON.parse(data);
        getData(convert);

        // if (data) {
        //   // dispatch(updateUser(JSON.parse(data)));
        //   // console.log("DataStorage:", JSON.parse(data));
        // }

        setIsDataLoaded(true); // Marking data as loaded from Redux
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  // Lấy dữ liệu user từ Redux store chỉ khi dữ liệu đã được cập nhật
  const userLogin = useSelector((state) => {
    if (isDataLoaded) {
      return state.userLogin.user;
    } else {
      return null;
    }
  });

  useEffect(() => {
    if (userLogin !== null) {
      setIsReady(true); // Marking useEffect as done when user data is available
      setChatList(userLogin.friends);
      handleCustomClient({ customId: userLogin.phone });
    }
  }, [userLogin]);

  const onFocusSearch = () => {
    navigation.navigate("SearchScreen");
  };
  const handlerTime = (timeString) => {
    const currentTime = Date.now();
    // Chuyển đổi chuỗi thời gian thành giá trị thời gian Unix
    const messageTime = new Date(timeString).getTime();
    // Tính chênh lệch thời gian
    const timeDiff = currentTime - messageTime;

    // Chuyển đổi chênh lệch thời gian sang giờ hoặc phút
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    if (minutesDiff > 60) {
      return hoursDiff;
    }
    return minutesDiff;
  };
  const isImageURL = (url) => {
    return url.toLowerCase().match(/\.(jpeg|jpg|gif|png)$/) != null;
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("ChatScreen", { user: item });
      }}
      style={styles.itemContainer}
    >
      <View style={{ padding: 8 }}>
        {item.avatar.uri ? ( // Nếu chưa chọn ảnh mới, nhưng người dùng đã có ảnh, hiển thị ảnh của người dùng
          <Avatar size={50} rounded source={{ uri: item.avatar.uri }} />
        ) : (
          // Nếu chưa chọn ảnh mới và người dùng cũng chưa có ảnh, hiển thị avatar mặc định
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
        <Text style={styles.message}>
          {isImageURL(item.lastMessage) ? "Đã gửi 1 ảnh" : item.lastMessage}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.time}>
          {handlerTime(item.lastMessageTime)} phút
        </Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text>{item.unreadCount}</Text>
          </View>
        )}
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