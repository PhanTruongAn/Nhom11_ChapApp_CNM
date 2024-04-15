import styled from "styled-components/native";
import { View, Image } from "react-native";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const ViewAnhBia = styled.View`
  width: 100%;
  height: 180px;
  background-color: #e5e5e5;
  overflow: hidden;
`;

export const ViewAnhBiaImage = styled.Image`
  flex: 1;
  width: null;
  height: null;
  resize-mode: cover;
`;

export const ViewAvatar = styled.View`
  width: 140px;
  height: 140px;
  border-width: 2px;
  border-color: black;
  border-radius: 100px;
  overflow: hidden;
  margin-top: -50px;
  position: absolute;
  top: 150px;
  left: ${screenWidth / 2 - 70}px; /* Căn giữa theo chiều rộng của màn hình */
`;

export const ViewAvatarImage = styled.Image`
  width: 100px;
  height: 100px;
`;

export const BtnNhanTin = styled.TouchableOpacity`
  padding: 15px;
  background-color: #a6b4de;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  margin-top: 5px;
  height: 50px;
  width: 70%;
  flex-direction: row;
`;

export const BtnKetBan = styled.TouchableOpacity`
  padding: 15px;
  background-color: lightgray;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  margin-top: 5px;
  height: 50px;
  width: 25%;
`;
