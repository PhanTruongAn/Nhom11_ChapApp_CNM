require("dotenv").config();

const configSocket = (server) => {
  var clients = [];
  const URL = process.env.URL_CLIENT;
  const io = require("socket.io")(server, {
    cors: {
      origin: URL,
      credentials: true,
    },
  });
  const formatTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  };
  io.on("connection", (socket) => {
    socket.on("storeClientInfo", (data) => {
      if (data && data.customId) {
        const existingClientIndex = clients.findIndex(
          (client) => client.customId === data.customId
        );

        if (existingClientIndex !== -1) {
          clients[existingClientIndex] = {
            customId: data.customId,
            clientId: socket.id,
          };
        } else {
          var clientInfo = {
            customId: data.customId,
            clientId: socket.id,
          };
          clients.push(clientInfo);
        }

        console.log(clients);
      }
    });
    socket.on("sendtest", (data) => {
      let sender = data.sender;
      let receiver = data.receiver;
      let resendData = data.user;
      if (clients && clients.length > 0) {
        let index = clients.findIndex(
          (item) => item.customId.localeCompare(receiver) === 0
        );
        if (index !== -1) {
          socket.to(clients[index].clientId).emit("refresh", resendData, () => {
            // console.log("Sender:", sender);
            // console.log("Receiver:", receiver);
            // console.log("ResendData:", resendData);
            // console.log("test success");
          });
        } else {
          console.log("test error");
        }
      }
    });
    socket.on("cancelSendFriend", (data) => {
      let sender = data.sender;
      let receiver = data.receiver;
      let resendData = data.user;
      if (clients && clients.length > 0) {
        let index = clients.findIndex(
          (item) => item.customId.localeCompare(receiver) === 0
        );
        if (index !== -1) {
          socket
            .to(clients[index].clientId)
            .emit("cancelSend", resendData, () => {
              // console.log("Sender:", sender);
              // console.log("Receiver:", receiver);
              // console.log("ResendData:", resendData);
            });
        } else {
          console.log("test error");
        }
      }
    });
    socket.on("cancelAddFriend", (data) => {
      let sender = data.sender;
      let receiver = data.receiver;
      let resendData = data.user;
      if (clients && clients.length > 0) {
        let index = clients.findIndex(
          (item) => item.customId.localeCompare(receiver) === 0
        );
        if (index !== -1) {
          socket
            .to(clients[index].clientId)
            .emit("cancelAdd", resendData, () => {
              // console.log("Sender:", sender);
              // console.log("Receiver:", receiver);
              // console.log("ResendData:", resendData);
            });
        } else {
          console.log("test error");
        }
      }
    });
    socket.on("confirmFriend", (data) => {
      let sender = data.sender;
      let receiver = data.receiver;
      let resendData = data.user;
      if (clients && clients.length > 0) {
        let index = clients.findIndex(
          (item) => item.customId.localeCompare(receiver) === 0
        );
        if (index !== -1) {
          socket
            .to(clients[index].clientId)
            .emit("confirmAdd", resendData, () => {
              // console.log("Sender:", sender);
              // console.log("Receiver:", receiver);
              // console.log("ResendData:", resendData);
            });
        } else {
          // console.log("test error");
        }
      }
    });
    socket.on("deleteFriend", (data) => {
      let sender = data.sender;
      let receiver = data.receiver;
      let resendData = data.user;
      if (clients && clients.length > 0) {
        let index = clients.findIndex(
          (item) => item.customId.localeCompare(receiver) === 0
        );
        if (index !== -1) {
          socket.to(clients[index].clientId).emit("delete", resendData, () => {
            // console.log("Sender:", sender);
            // console.log("Receiver:", receiver);
            // console.log("ResendData:", resendData);
          });
        } else {
          console.log("test error");
        }
      }
    });

    //Chat Socket
    socket.on("sendMessenger", (data) => {
      let sender = data.sender;
      let receiver = data.receiver;
      let textReceive = data.text;
      let createdAtReceive = data.createdAt;
      const dataResend = {
        idMessenger: data.idMessenger,
        text: textReceive,
        isDeleted: data.isDeleted,
        createdAt: createdAtReceive,
      };
      if (clients && clients.length > 0) {
        let index = clients.findIndex(
          (item) => item.customId.localeCompare(receiver) === 0
        );
        if (index !== -1) {
          socket
            .to(clients[index].clientId)
            .emit("receiveMessenger", dataResend, () => {
              // console.log("Sender:", sender);
              // console.log("Receiver:", receiver);
              // console.log("Text:", text);
            });
          // console.log("Data resend:", dataResend);
        } else {
          console.log("test error");
        }
      }
    });

    //Retrieve Messenger Socket
    socket.on("retrieveMessenger", (data) => {
      let sender = data.sender;
      let receiver = data.receiver;
      let textReceive = data.text;
      let createdAtReceive = data.createdAt;
      const dataResend = {
        idMessenger: data.idMessenger,
        text: textReceive,
        isDeleted: data.isDeleted,
        createdAt: createdAtReceive,
      };
      if (clients && clients.length > 0) {
        let index = clients.findIndex(
          (item) => item.customId.localeCompare(receiver) === 0
        );
        if (index !== -1) {
          socket
            .to(clients[index].clientId)
            .emit("retrieveMes", dataResend, () => {});
          // console.log("Data retrieve:", dataResend);
        } else {
          console.log("test error");
        }
      }
    });

    socket.on("createGroup", (call) => {
      console.log("Callback: ", call);
      io.emit("retrieve");
    });

    socket.on("joinRoom", (data) => {
      socket.join(data.groupId);
      console.log(`User:${data.user} joined room: ${data.groupName}`);
    });

    socket.on("disconnect", () => {
      socket.disconnect();
      console.log(`${socket.id}  user disconnected`);
    });

    socket.on("sendMessengerInGroup", (data) => {
      socket.to(data.groupId).emit("test", data);
    });

    socket.on("retrieveMessGroup", (data) => {
      // console.log("CallbackRetrieve: ", data);
      socket.to(data.group).emit("RetrieveMessGroup", data);
    });
    socket.on("deleteMember", (data) => {
      console.log("Callback: ", data);
      if (clients && clients.length > 0) {
        let index = clients.findIndex(
          (item) => item.customId.localeCompare(data) === 0
        );
        if (index !== -1) {
          socket.to(clients[index].clientId).emit("retrieveDelete");
          // console.log("Data retrieve:", dataResend);
        } else {
          console.log("test error");
        }
      }
    });

    socket.on("deleteGroup", () => {
      io.emit("deleteGroup");
    });
  });
};
export default configSocket;
