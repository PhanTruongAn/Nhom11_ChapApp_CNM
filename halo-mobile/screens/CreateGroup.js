import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";
import { Avatar } from "@rneui/themed";
import extendFunctions from "../constants/extendFunctions";
import { useDispatch, useSelector } from "react-redux";
import { useRoute } from "@react-navigation/core";

const CustomPopup = ({
  isVisible,
  avatars,
  onConfirm,
  selectedUsers,
  navigation,
}) => {
  if (!isVisible) return null;

  const renderAvatarItem = ({ item }) => (
    <Avatar
      size={50}
      rounded
      title={extendFunctions.getAvatarName(item.name)}
      containerStyle={{ backgroundColor: item.avatar.color }}
    />
  );

  return (
    <View style={styles.popupContainer}>
      <FlatList
        data={avatars}
        renderItem={renderAvatarItem}
        // keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        contentContainerStyle={styles.avatarList}
      />
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => {
          navigation.navigate("ChatGroup", { member: selectedUsers });
        }}
      >
        <View style={{ alignSelf: "center" }}>
          <AntDesign name="arrowright" size={30} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const CreateGroup = ({ navigation }) => {
  const route = useRoute();
  const user = useSelector((state) => state.userLogin.user);
  const conversation = useSelector((state) => state.usersInit.users);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [tab, setTab] = useState("friends");
  console.log(selectedUsers);
  const friends = user.friends;
  const recentUsers = conversation;
  console.log("friends:", user.friends);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCheck = () => {
    setIsInputVisible(!isInputVisible);
    // Handle group name confirmation
  };

  const handleSearch = (text) => {
    // Handle search functionality
  };

  const handleTabChange = (tab) => {
    setTab(tab);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const handleUserSelect = (user) => {
    setSelectedUsers((prev) =>
      prev.some((selectedUser) => selectedUser._id === user._id)
        ? prev.filter((selectedUser) => selectedUser._id !== user._id)
        : [...prev, user]
    );
  };
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleConfirm = () => {
    // Xử lý các hành động cần thiết khi người dùng xác nhận
    // Sau đó đóng Popup
    togglePopup();
  };
  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUserSelect(item)}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Avatar
          size={50}
          rounded
          title={extendFunctions.getAvatarName(item.name)}
          containerStyle={{ backgroundColor: item.avatar.color }}
        />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            marginLeft: 20,
          }}
        >
          {item.name}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleUserSelect(item)}>
        <FontAwesome
          name={
            selectedUsers.some((user) => user._id === item._id)
              ? "check-circle-o"
              : "circle-o"
          }
          size={28}
          color="#1faeeb"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // const renderAvatarItem = ({ item }) => (
  //   <Avatar
  //     size={50}
  //     rounded
  //     title={extendFunctions.getAvatarName(item.name)}
  //     containerStyle={{ backgroundColor: "red", marginRight: 10 }}
  //   />
  // );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nhóm mới</Text>
        <Text>Đã chọn: {selectedUsers.length}</Text>
      </View>

      {/* Group Name Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập tên nhóm"
          onChangeText={(e) => setGroupName(e)}
        />
        <TouchableOpacity onPress={handleCheck}>
          <Ionicons name="checkmark" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={24}
          color="gray"
          style={{ paddingLeft: 10 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm"
          onChangeText={handleSearch}
        />
      </View>

      {/* Tab Buttons */}
      <View style={styles.tabButtons}>
        <TouchableOpacity onPress={() => handleTabChange("friends")}>
          <Text style={tab === "friends" ? styles.activeTab : styles.tab}>
            Bạn bè
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange("recent")}>
          <Text style={tab === "recent" ? styles.activeTab : styles.tab}>
            Gần đây
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tab === "friends" ? friends : recentUsers}
        renderItem={renderUserItem}
        // keyExtractor={(item) => item.id.toString()}
      />
      <CustomPopup
        isVisible={selectedUsers.length > 0}
        avatars={selectedUsers.map((selectedUser) =>
          friends.find((friend) => friend._id === selectedUser._id)
        )}
        selectedUsers={selectedUsers} // Truyền biến selectedUsers vào CustomPopup
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  modalContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
    width: "100%",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    color: "gray",
    fontSize: 16,
    marginLeft: 50,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#eaedf0",
    paddingVertical: 5,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "gray",
    paddingLeft: 15,
  },
  tabButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  tab: {
    fontSize: 16,
    color: "gray",
  },
  activeTab: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  // avatarList: {
  //   alignItems: "center",
  //   paddingLeft: 10,
  //   paddingBottom: 20,
  // },
  popupContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    height: "10%",
    backgroundColor: "white",
    borderRadius: 3,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.5, // Điều chỉnh độ đậm của border nổi
    shadowRadius: 3.84,
    elevation: 10, // Điều chỉnh độ nổi của border
    borderColor: "black",
    alignItems: "center",
  },
  avatarList: {
    marginRight: 10,
    // Khoảng cách giữa avatar và nút ấn
  },
  confirmButton: {
    width: 50, // Kích thước nút ấn là vuông
    height: 50, // Kích thước nút ấn là vuông
    backgroundColor: "#1faeeb", // Màu nền của nút ấn
    borderRadius: 25, // Độ cong của góc nút ấn (nửa chiều cao)
    justifyContent: "center",
    // Căn giữa theo chiều dọc
  },
  confirmButtonText: {
    color: "white", // Màu chữ của nút ấn
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateGroup;
