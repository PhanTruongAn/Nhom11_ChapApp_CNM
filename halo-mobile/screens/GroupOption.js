import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { Avatar } from "@rneui/themed";
import { useRoute } from "@react-navigation/core";
import { useState } from "react";
import socket from "../config/configSocket";
import { useDispatch, useSelector } from "react-redux";
import groupApi from "../api/groupApi";
import { deleteGroupSocket } from "../config/configSocket";
import { useEffect } from "react";
import extendFunctions from "../constants/extendFunctions";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base-64";
import { initGroup } from "../redux/groupSlice";
const GroupOption = ({ navigation }) => {
  const dispatch = useDispatch();
  const route = useRoute();
  const user = useSelector((state) => state.userLogin.user);
  const groupOption = useSelector((state) => state.groupsInit.group);
  const [image, setImage] = useState(null);
  useEffect(() => {
    socket.on("deleteGroup", (call) => {
      alert("Nhóm đã bị xóa");
      navigation.navigate("ChatList");
    });
  }, [socket]);
  // useEffect(() => {}, [selected]);
  const handlerDeleteGroup = async () => {
    const data = {
      _id: groupOption._id,
      groupId: groupOption._id,
    };
    const res = await groupApi.deleteGroup(data);
    if (res) {
      deleteGroupSocket(data);
    }
  };
  // Thực hiện cấu hình AWS SDK với thông tin xác thực của bạn
  const { ACCESS_KEY, SECRET_KEY, REGION } = Constants.manifest.extra;
  AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION,
  });

  const s3 = new AWS.S3();

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
  const handleImagePicker = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Xin lỗi, chúng tôi cần quyền truy cập vào thư viện ảnh của bạn."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        const imageUri = result.uri;
        const imageInfo = await ImagePicker.getMediaLibraryPermissionsAsync();
        const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Chuyển dữ liệu base64 thành ArrayBuffer
        const arrayBuffer = base64ToArrayBuffer(imageBase64);

        const fileName = `${user._id}-${Date.now()}.jpg`;

        const params = {
          Bucket: "avatarhalo",
          Key: fileName,
          Body: arrayBuffer,
          ContentType: imageInfo.mimeType,
        };

        const data = await s3.upload(params).promise();
        console.log("Upload successful:", data.Location);

        const newData = {
          _id: groupOption._id,
          avatar: { uri: data.Location },
        };

        await groupApi.updateAvatarGroup(newData);
        setImage(data.Location); // Cập nhật trạng thái ảnh mới
        Alert.alert("Cập nhật thành công!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Có lỗi xảy ra khi tải ảnh lên");
    }
  };

  const pickImage = async () => {
    await handleImagePicker();
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
        {image ? ( // Nếu đã chọn ảnh mới, hiển thị ảnh mới
          <Avatar size={90} rounded source={{ uri: image }} />
        ) : groupOption.avatar.uri ? ( // Nếu chưa chọn ảnh mới, nhưng người dùng đã có ảnh, hiển thị ảnh của người dùng
          <Avatar size={90} rounded source={{ uri: groupOption.avatar.uri }} />
        ) : (
          // Nếu chưa chọn ảnh mới và người dùng cũng chưa có ảnh, hiển thị avatar mặc định
          <Avatar
            size={90}
            rounded
            source={require("../assets/avatar-default.jpeg")}
          />
        )}
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
          <Pressable onPress={pickImage}>
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
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "red",
            }}
          >
            Rời nhóm
          </Text>
          <Ionicons name="exit-outline" size={24} color="gray" />
        </Pressable>

        <TouchableOpacity style={styles.pressable} onPress={handlerDeleteGroup}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "red",
            }}
          >
            Giải tán nhóm
          </Text>
          <AntDesign name="deleteusergroup" size={23} color="gray" />
        </TouchableOpacity>
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
