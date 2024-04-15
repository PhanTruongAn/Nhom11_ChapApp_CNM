import * as React from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";

const Home = ({ navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#9cebfd",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={{ marginTop: 50 }}>
        <Text
          style={{
            color: "#1faeeb",
            fontSize: 60,
            fontWeight: "bold",
            marginBottom: 30,
            textShadowColor: "rgba(0, 0, 0, 0.75)",
            textShadowOffset: { width: -1, height: 1 },
            textShadowRadius: 10,
          }}
        >
          HALO
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          height: 200,
          marginTop: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "contain",
          }}
          source={require("../assets/bannerchatapp.jpg")}
        />
      </View>
      <TouchableOpacity
        style={{
          width: "60%",
          height: 50,
          backgroundColor: "#1faeeb",
          marginTop: 50,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 25,
        }}
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        <Text style={styles.text}>Đăng nhập</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: "60%",
          height: 50,
          backgroundColor: "#c4c4c4",
          marginTop: 20,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 25,
        }}
        onPress={() => {
          navigation.navigate("Registration");
        }}
      >
        <Text style={styles.text}>Đăng ký</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", marginTop: 70 }}>
        <TouchableOpacity>
          <Text style={{ fontSize: 20, marginRight: 20, color: "#1faeeb" }}>
            Tiếng việt
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={{ fontSize: 20, color: "#1faeeb" }}>English</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

export default Home;
