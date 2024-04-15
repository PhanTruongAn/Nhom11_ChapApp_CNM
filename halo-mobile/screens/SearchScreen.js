import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "@rneui/themed";
import userApi from "../api/userApi";
import extendFunctions from "../constants/extendFunctions";
const ContactDetails = ({ user }) => {
  return (
    <View style={styles.contactDetailsContainer}>
      <View style={styles.avatarContainer}>
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
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{user.name}</Text>
        <Text style={styles.contactPhone}>{user.phone}</Text>
      </View>
    </View>
  );
};

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [showResults, setShowNoResults] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowNoResults(false);
  };

  const handleSubmit = () => {
    if (searchResults.length > 0) {
      console.log("Selected Contact:", searchResults[0]);
    } else {
      console.log("No result found.");
      setShowNoResults(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons
              name="arrow-back"
              size={24}
              color="#555"
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="search"
              size={24}
              color="#555"
              style={styles.searchIcon}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.searchInput}
            placeholder="Search by phone"
            value={searchQuery}
            onChangeText={async (e) => {
              const user = {
                phone: e,
              };
              setSearchQuery(e);
              const req = await userApi.searchByPhone(user);
              if (req.DT) {
                setSearchResults(req.DT);
                setShowNoResults(true);
              }
            }}
          />

          <TouchableOpacity onPress={clearSearch}>
            <Ionicons
              name="close-circle"
              size={24}
              color="black"
              style={styles.clearIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      {showResults ? (
        <TouchableOpacity
          onPress={() => {
            console.log(searchResults);
            navigation.navigate("TrangKetBan", { searchResults });
          }}
        >
          <ContactDetails user={searchResults} />
        </TouchableOpacity>
      ) : (
        <Text>No results found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backIcon: {
    marginRight: 10,
    color: "white",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498db",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
    color: "white",
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
  contactDetailsContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 10,
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ddd",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  contactPhone: {
    fontSize: 16,
    color: "#555",
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default SearchScreen;
