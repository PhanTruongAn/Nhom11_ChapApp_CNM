import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import userApi from "../api/userApi";
const Registration = ({ navigation }) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setConfirmShowPass] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const getRandomColor = () => {
    // Tạo một màu ngẫu nhiên bằng cách sử dụng Math.random()
    const colors = [
      "#a650e8",
      "#0ecff9",
      "#1877f2",
      "#fb02c7",
      "#f96502",
      "#f9f102",
      "#2bf902",
      "#f902a3",
      "#9f02f9",
      "#02f9e9",
      "#f1f902",
      "#FF6347",
      "#FF8C00",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    const randomColor = colors[randomIndex];
    return randomColor;
  };
  const handleRegister = async () => {
    const user = {
      name: name,
      phone: phone,
      email: email,
      password: password,
      avatar: {
        uri: "",
        color: getRandomColor(),
      },
    };
    if (password === confirmPass) {
      let req = await userApi.checkValidate(user);
      if (req.EM) {
        alert(req.EM);
        Alert.alert(req.EM);
      } else {
        const userRegis = await userApi.register(user);
        navigation.navigate("OtpScreen", { user: userRegis.DT });
      }
    } else {
      alert("Mật khẩu xác nhận không đúng!");
      Alert.alert("Mật khẩu xác nhận không đúng!");
    }
  };
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Đăng ký</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#ABABAB" style={styles.icon} />
          <TextInput
            value={name}
            onChangeText={(e) => setName(e)}
            style={styles.input}
            placeholder="Họ và tên"
            placeholderTextColor="#ABABAB"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="phone" size={20} color="#ABABAB" style={styles.icon} />
          <TextInput
            value={phone}
            onChangeText={(e) => setPhone(e)}
            style={styles.input}
            placeholder="Số điện thoại"
            placeholderTextColor="#ABABAB"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="email" size={20} color="#ABABAB" style={styles.icon} />
          <TextInput
            value={email}
            onChangeText={(e) => setEmail(e)}
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ABABAB"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#ABABAB" style={styles.icon} />
          <TextInput
            value={password}
            onChangeText={(e) => setPassword(e)}
            style={styles.input}
            secureTextEntry={!showPass}
            placeholder="Mật khẩu"
            placeholderTextColor="#ABABAB"
          />
          <Icon
            onPress={() => setShowPass(!showPass)}
            name={showPass ? "eye" : "eye-with-line"}
            size={22}
            color={showPass ? "black" : "#ABABAB"}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#ABABAB" style={styles.icon} />
          <TextInput
            value={confirmPass}
            onChangeText={(e) => setConfirmPass(e)}
            style={styles.input}
            secureTextEntry={!showConfirmPass}
            placeholder="Xác nhận mật khẩu"
            placeholderTextColor="#ABABAB"
          />
          <Icon
            onPress={() => setConfirmShowPass(!showConfirmPass)}
            name={showConfirmPass ? "eye" : "eye-with-line"}
            size={22}
            color={showConfirmPass ? "black" : "#ABABAB"}
          />
        </View>
      </View>
      <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
        <Text style={styles.registerButtonText}>Đăng ký</Text>
      </TouchableOpacity>
      <View style={styles.loginContainer}>
        <Text>Bạn đã có tài khoản ?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    marginTop: 50,
  },
  title: {
    color: "#1faeeb",
    fontSize: 35,
    fontWeight: "500",
  },
  formContainer: {
    width: "100%",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignSelf: "center",
    width: "70%",
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ABABAB",
    marginBottom: 20,
    alignItems: "center",
  },
  input: {
    width: "100%",
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#ABABAB",
    marginLeft: 10,
  },
  icon: {
    marginLeft: 10,
  },

  registerButton: {
    width: "60%",
    height: 40,
    backgroundColor: "#1faeeb",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 10,
  },
  registerButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  loginContainer: {
    marginTop: 20,
    flexDirection: "row",
  },
  loginText: {
    marginLeft: 5,
    color: "#1faeeb",
  },
});

export default Registration;
