import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import extendFunctions from "../constants/extendFunctions";
import { Avatar } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userLogin.user);
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const logOut = async () => {
    setModalVisible(false);
    await AsyncStorage.removeItem("login");
    await AsyncStorage.removeItem("isLoggedIn");
    navigation.navigate("Home");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}

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
        <Text style={styles.userName}>{user.name}</Text>
      </View>

      {/* Settings Sections */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            const image = extendFunctions.randomImage();
            navigation.navigate("Information", image);
          }}
        >
          <View style={styles.itemContainer}>
            <Ionicons
              name="person"
              size={24}
              color="#2B4F6D"
              style={styles.icon}
            />
            <Text style={styles.itemText}>Edit Profile</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color="#2B4F6D"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ChangePassScreen");
          }}
          style={styles.item}
        >
          <View style={styles.itemContainer}>
            <Ionicons
              name="key"
              size={24}
              color="#2B4F6D"
              style={styles.icon}
            />
            <Text style={styles.itemText}>Change Password</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color="#2B4F6D"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity onPress={toggleModal} style={styles.item}>
          <View style={styles.itemContainer}>
            <Ionicons
              name="log-out"
              size={24}
              color="#2B4F6D"
              style={styles.icon}
            />
            <Text style={styles.itemText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            borderRadius: 10,
            width: 350,
            height: 120,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <Text
            style={{
              marginTop: 40,
              fontSize: 18,
              fontWeight: 600,
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            Bạn có muốn thoát tài khoản này không?
          </Text>
          <View
            style={{
              width: 250,
              height: 70,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              onPress={logOut}
              style={{
                width: 100,
                height: 30,
                backgroundColor: "#1faeeb",
                borderRadius: 7,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "white",
                  alignSelf: "center",
                }}
              >
                Đồng ý
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleModal}
              style={{
                width: 100,
                height: 30,
                backgroundColor: "#1faeeb",
                borderRadius: 7,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "white",
                  alignSelf: "center",
                }}
              >
                Hủy bỏ
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2B4F6D",
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between", // Đảm bảo biểu tượng ">" nằm ở phía bên phải
    alignItems: "center",
    marginBottom: 10,
    padding: 15,
    borderRadius: 8,
    borderBottomColor: "red",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
    alignSelf: "center",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default SettingsScreen;
