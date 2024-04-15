import * as React from "react";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Registration from "./screens/Registration";
import BottomTabNavigator from "./screens/TabButton";
import ChatScreen from "./screens/Chat";
import Information from "./screens/Information";
import EditInformation from "./screens/EditInformation";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import SearchScreen from "./screens/SearchScreen";
import ChangePassScreen from "./screens/ChangePassScreen";
import OtpScreen from "./screens/OtpScreen";
import OTPOption from "./screens/OTPOption";
import TrangKetBan from "./screens/TrangKetBan";
import NewPassword from "./screens/NewPassword";
import SearchInfo from "./screens/SearchInfo";
import BaCham from "./screens/BaCham";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Test from "./screens/Test";
import CreateGroup from "./screens/CreateGroup";
import ChatGroup from "./screens/ChatGroup";
const Stack = createNativeStackNavigator();
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false); // Flag to track if useEffect is done

  const handlerLoggedIn = async () => {
    const data = await AsyncStorage.getItem("isLoggedIn");
    setIsLoggedIn(data === "true");
    setIsReady(true); // Marking useEffect as done
  };

  useEffect(() => {
    handlerLoggedIn();
  }, []);

  if (!isReady) {
    // Wait for useEffect to complete
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? "BottomTabNavigator" : "Home"}
        >
          <Stack.Screen
            options={{ headerShown: false }}
            name="Home"
            component={Home}
          ></Stack.Screen>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={Login}
          ></Stack.Screen>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Registration"
            component={Registration}
          ></Stack.Screen>
          <Stack.Screen
            options={{ headerShown: false }}
            name="BottomTabNavigator"
            component={BottomTabNavigator}
          ></Stack.Screen>
          <Stack.Screen
            options={{ headerShown: false }}
            name="ChatScreen"
            component={ChatScreen}
          ></Stack.Screen>
          <Stack.Screen
            options={{ headerShown: false }}
            name="SearchScreen"
            component={SearchScreen}
          ></Stack.Screen>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Information"
            component={Information}
          ></Stack.Screen>
          <Stack.Screen
            options={{ headerShown: false }}
            name="SearchInfo"
            component={SearchInfo}
          ></Stack.Screen>
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="EditInformation"
            component={EditInformation}
          ></Stack.Screen>
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="ChangePassScreen"
            component={ChangePassScreen}
          ></Stack.Screen>
          <Stack.Screen
            options={{
              title: "Nhập mã OTP",
              headerStyle: {
                backgroundColor: "#007bff",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
            name="OtpScreen"
            component={OtpScreen}
          ></Stack.Screen>
          <Stack.Screen
            options={{
              title: "Quên mật khẩu",
              headerStyle: {
                backgroundColor: "#007bff",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
            name="OTPOption"
            component={OTPOption}
          ></Stack.Screen>
          <Stack.Screen
            options={{
              title: "Mật khẩu mới",
              headerStyle: {
                backgroundColor: "#007bff",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
            name="NewPassword"
            component={NewPassword}
          ></Stack.Screen>
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="TrangKetBan"
            component={TrangKetBan}
          ></Stack.Screen>
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="BaCham"
            component={BaCham}
          ></Stack.Screen>
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="Test"
            component={Test}
          ></Stack.Screen>
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="CreateGroup"
            component={CreateGroup}
          ></Stack.Screen>
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="ChatGroup"
            component={ChatGroup}
          ></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      {/* <CreateGroup /> */}
    </Provider>
  );
};

export default App;
