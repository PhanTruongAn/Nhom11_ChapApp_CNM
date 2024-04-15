import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import userApi from "../api/userApi";
import userValidate from "../validates/userValidate";
const OTPOption = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [inputType, setInputType] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [resetOtp, setResetOtp] = useState(false);
  const [data, setData] = useState();
  const user = {
    email: email,
  };

  const handleEmailSubmit = async () => {
    const req = await userApi.forgotPassword(user);
    const convert = req.DT;
    setData(req.DT);
  };
  console.log("Data", data);
  const handleSubmit = () => {
    let isValid = true;
    const validate = userValidate.validateOTP(otp);
    if (validate.EC !== 0) {
      isValid = false;
      alert("Mã OTP không hợp lệ");
      Alert.alert("Mã OTP không hợp lệ");
    }
    if (isValid && data.otp !== otp) {
      isValid = false;
      console.log("otp nhap", otp);
      console.log("otp db:", data.otp);
      alert("Mã OTP xác thực không đúng");
      Alert.alert("Mã OTP xác thực không đúng");
    }
    if (data.otpTime < new Date()) {
      isValid = false;
      setResetOtp(true);
      alert("OTP quá hạn, vui lòng gửi lại OTP khác");
      Alert.alert("OTP quá hạn,vui lòng gửi lại OTP khác");
    }
    if (isValid) {
      alert("Xác thực thành công!");
      Alert.alert("Xác thực thành công!");
      navigation.navigate("NewPassword", { user: data });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập Email để lấy lại mật khẩu</Text>
      <TouchableOpacity
        style={inputType === "email" ? styles.optionSelected : styles.option}
        onPress={() => setInputType("email")}
      >
        <Icon
          name="mail"
          size={24}
          color={inputType === "email" ? "white" : "#007bff"}
        />
        <Text
          style={
            inputType === "email"
              ? styles.optionTextSelected
              : styles.optionText
          }
        >
          Email
        </Text>
      </TouchableOpacity>

      {inputType === "email" && (
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          onChangeText={(e) => setEmail(e)}
          value={email}
        />
      )}
      <TouchableOpacity
        style={inputType === "otp" ? styles.optionSelected : styles.option}
        onPress={() => {
          setInputType("otp");
          handleEmailSubmit();
          alert("Mã OTP đã được gửi về email");
          Alert.alert("Mã OTP đã được gửi về email");
        }}
      >
        <Text
          style={
            inputType === "otp" ? styles.optionTextSelected : styles.optionText
          }
        >
          Xác nhận
        </Text>
      </TouchableOpacity>
      {resetOtp && (
        <TouchableOpacity>
          <Icon size={20} name="cw" color={black} />
        </TouchableOpacity>
      )}

      {inputType === "otp" && (
        <TextInput
          onFocus={() => {
            setConfirmVisible(true);
          }}
          style={styles.input}
          placeholder="Enter OTP "
          onChangeText={(e) => setOtp(e)}
          keyboardType="phone-pad"
        />
      )}
      {confirmVisible && (
        <TouchableOpacity onPress={handleSubmit} style={styles.confirm}>
          <Text style={styles.confirmText}>Xác nhận</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  option: {
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  confirm: {
    width: "80%",
    height: 40,
    backgroundColor: "#1faeeb",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 30,
  },
  confirmText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  optionSelected: {
    backgroundColor: "#007bff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
    marginLeft: 10,
  },
  optionTextSelected: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    marginBottom: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    fontWeight: "500",
  },
  confirmButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OTPOption;
