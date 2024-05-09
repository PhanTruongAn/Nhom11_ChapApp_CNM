import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { Avatar } from "@rneui/themed";
import { useRoute } from "@react-navigation/core";
import extendFunctions from "../constants/extendFunctions";
import { useSelector, useDispatch } from "react-redux";
import groupApi from "../api/groupApi";
import { initGroup } from "../redux/groupSlice";
import { deleteMember } from "../redux/groupSlice";
import { deleteMemberSocket } from "../config/configSocket";

const MemberGroup = ({ navigation }) => {
  const dispatch = useDispatch();
  const route = useRoute();
  const user = useSelector((state) => state.userLogin.user);
  const groupOption = useSelector((state) => state.groupsInit.group);
  console.log("GroupRedux:", groupOption);
  const [tab, setTab] = useState("members");
  const [originalMembers, setOriginalMembers] = useState([
    ...groupOption.members,
    groupOption.author,
  ]);
  const [members, setMembers] = useState(originalMembers);
  const author = [groupOption.author];

  const handleSearch = (input) => {
    if (input === "") {
      setMembers(originalMembers);
    } else {
      const filteredData = originalMembers.filter((item) =>
        item.name.toLowerCase().includes(input.toLowerCase())
      );
      setMembers(filteredData);
    }
  };
  const handleTabChange = (tab) => {
    setTab(tab);
  };
  const renderUserItem = ({ item }) => {
    const isAuthor = user._id === groupOption.author._id;
    const isCurrentUser = user._id === item._id;

    const handleDelete = async () => {
      const data = {
        _id: groupOption._id,
        member: item,
      };
      const res = await groupApi.deleteMembers(data);
      if (res) {
        dispatch(initGroup(res.DT));
        deleteMemberSocket(item.phone);
        const updatedMembers = originalMembers.filter(
          (member) => member._id !== item._id
        );
        setOriginalMembers(updatedMembers);
        setMembers(updatedMembers);
      }
    };

    return (
      <TouchableOpacity style={styles.userItem}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            size={50}
            rounded
            title={extendFunctions.getAvatarName(item.name)}
            containerStyle={{ backgroundColor: item.avatar.color }}
          />
          <Text style={{ fontSize: 16, fontWeight: "500", marginLeft: 20 }}>
            {item.name}
          </Text>
        </View>
        {!isCurrentUser &&
          isAuthor && ( // Chỉ hiển thị nút Xóa nếu không phải là người dùng hiện tại và là tác giả
            <TouchableOpacity
              style={{
                width: 50,
                height: 40,
                backgroundColor: "red",
                borderRadius: 10,
                justifyContent: "center",
                position: "absolute",
                right: 10,
              }}
              onPress={handleDelete}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  alignSelf: "center",
                  color: "white",
                }}
              >
                Xóa
              </Text>
            </TouchableOpacity>
          )}
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={25} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý thành viên</Text>

        <TouchableOpacity
          style={{ position: "absolute", right: 10 }}
          onPress={() => {
            navigation.navigate("AddMember", { groupData: groupOption });
          }}
        >
          <AntDesign name="addusergroup" size={24} color="white" />
        </TouchableOpacity>
      </View>
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
          onChangeText={(e) => handleSearch(e)}
        />
      </View>
      {/* Tab Buttons */}

      <View style={styles.tabButtons}>
        <TouchableOpacity onPress={() => handleTabChange("members")}>
          <Text style={tab === "members" ? styles.activeTab : styles.tab}>
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange("author")}>
          <Text style={tab === "author" ? styles.activeTab : styles.tab}>
            Trưởng nhóm
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: "white",
          padding: 10,
          flex: 1,
          borderRadius: 5,
        }}
      >
        <Text
          style={{ fontWeight: "500", paddingBottom: 10, color: "#1faeeb" }}
        >
          Thành viên ({members.length})
        </Text>
        <FlatList
          data={tab === "members" ? members : author}
          renderItem={renderUserItem}
        />
      </View>
    </View>
  );
};

export default MemberGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#eaedf0",
  },
  searchBar: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "white",
    paddingVertical: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "gray",
    paddingLeft: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
    width: "100%",
    backgroundColor: "#1faeeb",
    borderRadius: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    position: "absolute",
    left: 50,
    top: 6,
    color: "white",
  },

  tabButtons: {
    marginTop: 20,
    width: "100%",
    height: 40,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  tab: {
    fontSize: 16,
    color: "gray",
  },
  activeTab: {
    fontSize: 16,
    fontWeight: "500",
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

  avatarList: {
    marginRight: 10,
    // Khoảng cách giữa avatar và nút ấn
  },
});
