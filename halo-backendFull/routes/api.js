import express from "express";
import userController from "../controllers/userController";
import userService from "../services/userServices";
import friendController from "../controllers/friendController";
import chatController from "../controllers/chatController";
import groupController from "../controllers/groupController";
import gifController from "../controllers/gifController";
// import { checkCookie } from "../middleware/jwtMiddleware";
const router = express.Router();
/**
 *
 * @param {*} app : express app
 */

const initAppRoutes = (app) => {
  //User Route
  router.post("/checkValidate", userController.handlerCheckValidate);
  router.post("/registry", userController.handlerRegistry);
  router.post("/login", userController.handleLogin);
  // router.get("/login-user", checkCookie, userController.handlerLoginUser);
  router.post("/searchByPhone", userController.handlerSearchByPhone);
  router.post("/update-user", userController.handlerUpdateUser);
  router.post("/change-password", userController.handlerChangePassword);
  router.post("/confirm-account", userController.handleConfirmAccount);
  router.post("/new-otp", userController.handlerNewOtp);
  router.post("/forgot-password", userController.handlerForgotPassword);
  router.post("/get-data", userController.handlerGetDataById);
  //Friend Route
  router.post("/friend-request", friendController.sendAddFriend);
  router.post("/cancel-add-friend", friendController.cancelSendAddFriend);
  router.post(
    "/cancel-add-friend-by-receiver",
    friendController.cancelFriendByReceiver
  );
  router.post("/confirm-friend-request", friendController.confirmAddFriend);
  router.post("/delete-friend", friendController.deleteFriend);
  // Chat Route
  router.post("/send-messenger", chatController.handlerSendMessenger);
  router.post("/get-all-chat", chatController.handlerGetAllChatPrivate);
  router.post("/get-conversation", chatController.handlerGetAllConversation);
  router.post("/retrieve-messenger", chatController.handlerRetrieveMessenger);
  router.post("/delete-messenger", chatController.handlerDeletedMessenger);
  // Group Route
  router.post("/create-group", groupController.handlerCreateNewGroup);
  router.post("/get-all-group", groupController.handlerGetAllGroup);
  router.post(
    "/get-all-group-latest-mes",
    groupController.handlerGetAllGroupsWithLatestMessage
  );
  router.post("/add-members", groupController.handlerAddMembers);
  router.post("/delete-members", groupController.handlerDeleteMembers);
  router.post("/delete-group", groupController.handlerDeleteMGroup);
  router.post("/send-mess-group", groupController.handlerSendMessGroup);
  router.post("/gel-all-chat-group", groupController.handlerGetAllChatGroup);
  router.post(
    "/retrieve-message-group",
    groupController.handlerRetrieveMessenger
  );
  router.post("/delete-message-group", groupController.handlerDeleteMessenger);
  router.post("/leader-leave-group", groupController.handlerLeaderLeaveGroup);
  // Gif Route
  router.post("/add-gif", gifController.handlerAddGif);
  router.post("/get-all-gif", gifController.handlerGetAllGif);
  return app.use("/", router);
};
export default initAppRoutes;
