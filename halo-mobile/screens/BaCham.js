import {
  StyleSheet,
  Text,
  Touchable,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/core";
//icons
import { Octicons, Fontisto, Ionicons } from "@expo/vector-icons";

const BaCham = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Octicons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ marginLeft: 20, fontSize: 18, fontWeight: "600" }}>
          {/* {name} */}
        </Text>
      </View>
      <TouchableOpacity style={styles.field}>
        <Text style={styles.textField}>Thông tin</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.field}>
        <Text style={styles.textField}>Thêm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BaCham;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: "#e5e5e5",
    flexDirection: "row",
    alignItems: "center",
    height: 68,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  field: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  textField: {
    fontSize: 16,
    fontWeight: "400",
  },
});
