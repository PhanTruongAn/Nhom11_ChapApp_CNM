import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@rneui/themed";
import extendFunctions from "../constants/extendFunctions";
import friendApi from "../api/friendApi";
import { updateUser } from "../redux/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handlerRefreshAccount } from "../config/configSocket";
import { handlerCancelSendFriend } from "../config/configSocket";
import { handlerCancelSend } from "../config/configSocket";
import { handlerCancelAddFriend } from "../config/configSocket";
import { handlerCancelAdd } from "../config/configSocket";
import { handlerConfirmFriend } from "../config/configSocket";
import { handlerConfirmAddFriend } from "../config/configSocket";
import { handlerDeleteFriend } from "../config/configSocket";
import { handlerDelete } from "../config/configSocket";
import { io } from "socket.io-client";
import socket from "../config/configSocket";
import groupApi from "../api/groupApi";
import { handlerJoinRoom } from "../config/configSocket";
const Tab = createMaterialTopTabNavigator();

const FriendListScreen = ({ navigation }) => {
  const user = useSelector((state) => state.userLogin.user);
  console.log("Redux:", user);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const friendsData = [
    { id: "1", name: "Friend 1" },
    { id: "2", name: "Friend 2" },
    // ... more friends
  ];

  const groupsData = [
    { id: "1", name: "Group 1" },
    { id: "2", name: "Group 2" },
    // ... more groups
  ];

  const filteredFriendsData = friendsData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroupsData = groupsData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => {
    setSearchQuery("");
  };

  const onFocusSearch = () => {
    navigation.navigate("SearchScreen");
  };

  useEffect(() => {
    // Gọi hàm handlerRefreshAccount khi component được render lần đầu tiên
    handlerRefreshAccount(dispatch);
  }, []);
  useEffect(() => {
    handlerCancelSend(dispatch);
  }, []);
  useEffect(() => {
    handlerCancelAdd(dispatch);
  }, []);
  useEffect(() => {
    handlerConfirmAddFriend(dispatch);
  }, []);
  useEffect(() => {
    handlerDelete(dispatch);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.searchContainer}
          onPress={onFocusSearch}
        >
          <Ionicons
            name="search"
            size={24}
            color="white"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons
                name="close-circle"
                size={24}
                color="black"
                style={styles.clearIcon}
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>

      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: "darkblue",
          inactiveTintColor: "#555",
          labelStyle: { fontWeight: "bold" },
          indicatorStyle: { backgroundColor: "lightblue" },
          style: { backgroundColor: "#eee", borderRadius: 5 },
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Bạn bè") {
              iconName = "people";
            } else if (route.name === "Nhóm") {
              iconName = "business";
            } else if (route.name === "Lời mời") {
              iconName = "people-circle";
            } else if (route.name === "Đã gửi") {
              iconName = "list";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={20} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Bạn bè" component={FriendListComponent} />
        <Tab.Screen name="Đã gửi" component={FriendRequestComponent} />
        <Tab.Screen name="Lời mời" component={AddFriendComponent} />
        <Tab.Screen name="Nhóm" component={GroupListComponent} />
      </Tab.Navigator>
    </View>
  );
};

const FriendListComponent = () => {
  const user = useSelector((state) => state.userLogin.user);
  const dispatch = useDispatch();
  return (
    <FlatList
      data={user.friends}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <View>
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
          <Text style={styles.itemText}>{item.name}</Text>
          <TouchableOpacity
            style={{
              width: 70,
              height: 40,
              justifyContent: "center",
              backgroundColor: "red",
              borderRadius: 10,
              position: "absolute",
              right: 10,
            }}
            onPress={async () => {
              const data = {
                phoneSender: user.phone,
                phoneReceiver: item.phone,
              };
              const senderData = {
                _id: user._id,
                name: user.name,
                phone: user.phone,
                avatar: user.avatar,
              };
              handlerDeleteFriend({
                sender: user.phone,
                receiver: item.phone,
                user: senderData,
              });
              const req = await friendApi.deleteFriend(data);
              console.log("CheckReq:", req);
              dispatch(updateUser(req.DT));
              // await AsyncStorage.setItem("login", JSON.stringify(req.DT));
            }}
          >
            <Text style={{ fontSize: 16, alignSelf: "center", color: "white" }}>
              Xóa bạn
            </Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};
const AddFriendComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userLogin.user);

  return (
    <FlatList
      data={user.friendRequests}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <View>
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
          <Text style={styles.itemText}>{item.name}</Text>
          <TouchableOpacity
            style={{
              width: 80,
              height: 30,
              justifyContent: "center",
              backgroundColor: "green",
              borderRadius: 10,
              position: "absolute",
              right: 70,
            }}
            onPress={async () => {
              const data = {
                phoneSender: user.phone,
                phoneReceiver: item.phone,
              };
              handlerConfirmFriend({
                sender: user.phone,
                receiver: item.phone,
                user: user,
              });
              const req = await friendApi.confirmAddFriend(data);
              console.log("CheckReq:", req);
              dispatch(updateUser(req.DT));
              // await AsyncStorage.setItem("login", JSON.stringify(req.DT));
            }}
          >
            <Text style={{ fontSize: 15, alignSelf: "center", color: "white" }}>
              Chấp nhận
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 50,
              height: 30,
              justifyContent: "center",
              backgroundColor: "red",
              borderRadius: 10,
              position: "absolute",
              right: 10,
            }}
            onPress={async () => {
              const data = {
                phoneSender: user.phone,
                phoneReceiver: item.phone,
              };
              const senderData = {
                _id: user._id,
                name: user.name,
                phone: user.phone,
                avatar: user.avatar,
              };
              handlerCancelAddFriend({
                sender: user.phone,
                receiver: item.phone,
                user: senderData,
              });
              const req = await friendApi.cancelAddFriendByReceiver(data);
              dispatch(updateUser(req.DT));
              // await AsyncStorage.setItem("login", JSON.stringify(req.DT));
            }}
          >
            <Text style={{ fontSize: 15, alignSelf: "center", color: "white" }}>
              Hủy
            </Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};
const FriendRequestComponent = () => {
  const user = useSelector((state) => state.userLogin.user);
  const dispatch = useDispatch();

  return (
    <FlatList
      data={user.sendFriendRequests}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <View>
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
          <Text style={styles.itemText}>{item.name}</Text>
          <TouchableOpacity
            style={{
              width: 70,
              height: 40,
              justifyContent: "center",
              backgroundColor: "red",
              borderRadius: 10,
              position: "absolute",
              right: 10,
            }}
            onPress={async () => {
              const data = {
                phoneSender: user.phone,
                phoneReceiver: item.phone,
              };
              const senderData = {
                _id: user._id,
                name: user.name,
                phone: user.phone,
                avatar: user.avatar,
              };
              handlerCancelSendFriend({
                sender: user.phone,
                receiver: item.phone,
                user: senderData,
              });
              const req = await friendApi.cancelAddFriend(data);

              dispatch(updateUser(req.DT));
              // await AsyncStorage.setItem("login", JSON.stringify(req.DT));
            }}
          >
            <Text style={{ fontSize: 16, alignSelf: "center", color: "white" }}>
              Hủy bỏ
            </Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const GroupListComponent = ({ navigation }) => {
  const user = useSelector((state) => state.userLogin.user);
  const dispatch = useDispatch();
  const [group, setGroup] = useState([]);
  useEffect(() => {
    socket.on("retrieve", async (call) => {
      const memberId = {
        _id: call.member._id,
      };
      // getAllGroup(memberId);
      getAllGroup(user);
    });
  }, [socket]);
  useEffect(() => {
    getAllGroup(user);
  }, []);

  const groupsData = [
    { id: "1", name: "Group 1" },
    { id: "2", name: "Group 2" },
    // ... more groups
  ];
  const getAllGroup = async (data) => {
    const res = await groupApi.getAllGroup(data);
    if (res) {
      console.log("Groups: ", res.DT);
      setGroup(res.DT);
    } else {
      alert(res.EM);
    }
  };
  return (
    <FlatList
      data={group}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <Pressable
          style={styles.itemContainer}
          onPress={() => {
            handlerJoinRoom({
              groupId: item._id,
              user: user.phone,
              groupName: item.name,
            });
            navigation.navigate("ChatGroup", { groupData: item });
          }}
        >
          <Avatar
            size={50}
            rounded
            source={require("../assets/avatar-default.jpeg")}
          />
          <Text style={styles.itemText}>{item.name}</Text>
          <TouchableOpacity
            style={{
              width: 90,
              height: 40,
              justifyContent: "center",
              backgroundColor: "red",
              borderRadius: 10,
              position: "absolute",
              right: 10,
            }}
          >
            <Text style={{ fontSize: 16, alignSelf: "center", color: "white" }}>
              Xóa nhóm
            </Text>
          </TouchableOpacity>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498db",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  clearIcon: {
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: "white",
  },
  itemContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
  },
  icon: {
    marginRight: 10,
  },
});

export default FriendListScreen;
