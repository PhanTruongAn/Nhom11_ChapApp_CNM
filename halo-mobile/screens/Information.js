import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import React from "react";
import { Avatar } from "@rneui/themed";
import { useRoute } from "@react-navigation/core";
import { useSelector } from "react-redux";
import extendFunctions from "../constants/extendFunctions";
import Icon from "react-native-vector-icons/AntDesign";
const Information = ({ navigation }) => {
  const user = useSelector((state) => state.userLogin.user);
  const route = useRoute();
  const handleBack = () => {
    navigation.goBack();
  };
  const image = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.headerTop}>
        <Image
          source={{
            uri: image,
          }}
          style={{
            flex: 1,
            width: null,
            height: null,
            resizeMode: "cover",
          }}
        />
      </View>

      <TouchableOpacity onPress={handleBack}>
        <Icon
          name="arrowleft"
          size={25}
          style={{ paddingLeft: 20, marginTop: -170, color: "white" }}
        />
      </TouchableOpacity>
      <View style={styles.header}>
        {user.avatar.uri ? ( // Nếu chưa chọn ảnh mới, nhưng người dùng đã có ảnh, hiển thị ảnh của người dùng
          <Avatar size={50} rounded source={{ uri: user.avatar.uri }} />
        ) : (
          // Nếu chưa chọn ảnh mới và người dùng cũng chưa có ảnh, hiển thị avatar mặc định
          <Avatar
            size={50}
            rounded
            title={extendFunctions.getAvatarName(user.name)}
            containerStyle={{ backgroundColor: user.avatar.color }}
          />
        )}
        <Text style={styles.headerName}>{user.name}</Text>
      </View>
      <View style={styles.information}>
        <Text style={styles.information_title}>Thông tin cá nhân</Text>
        <View style={styles.index_container}>
          <View style={styles.custom}>
            <Text style={styles.index}>Giới tính</Text>
            <Text style={{ marginLeft: "19%", padding: 7 }}>{user.sex}</Text>
          </View>
          <View style={styles.custom}>
            <Text style={styles.index}>Ngày sinh </Text>
            <Text style={{ marginLeft: "16%", padding: 7 }}>
              {user.dateOfBirth}
            </Text>
          </View>
          <View style={styles.custom}>
            <Text style={styles.index}>Điện thoại </Text>
            <Text style={{ marginLeft: "15%", padding: 7 }}>{user.phone}</Text>
          </View>
          <View style={styles.custom}>
            <Text style={styles.index}>Email</Text>
            <Text style={{ marginLeft: "25%", padding: 7 }}>{user.email}</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("EditInformation");
            }}
          >
            <Icon name="edit" size={20} style={styles.icon} />
            <Text
              style={{ alignSelf: "center", marginLeft: 5, fontWeight: 600 }}
            >
              Chỉnh sửa
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Information;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  headerTop: {
    width: "100%",
    height: 190,

    overflow: "hidden",
  },
  header: {
    width: "80%",
    height: 50,
    marginTop: -80,
    flexDirection: "row",
    marginLeft: 20,
    marginBottom: 10,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 600,
    alignSelf: "center",
    marginLeft: 20,
    color: "white",
  },
  information: {
    backgroundColor: "white",
    width: "100%",
    height: 280,
  },
  information_title: {
    fontSize: 16,
    fontWeight: 500,
    padding: 17,
  },
  index_container: {
    width: "95%",
    height: "55%",
    marginLeft: 17,
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  custom: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#dadada",
  },
  index: {
    padding: 7,
  },
  button: {
    backgroundColor: "#dadada",
    width: "80%",
    height: 35,
    alignSelf: "center",
    borderRadius: 20,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
  },
  icon: {
    alignSelf: "center",
  },
});
