import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import cors from "cors";
import connectDB from "./src/configs/connectDB";
import initAppRoutes from "./routes/api";
import cookieParser from "cookie-parser";
import configCors from "./src/configs/corsConfig";
import configSocket from "./src/configs/configSocket";
const LocalStrategy = require("passport-local").Strategy;
const app = express();
const PORT = process.env.PORT;
const PORT_SOCKET = 8081;
const HOST = process.env.HOST_NAME;
// configCors(app);
app.use(
  cors({
    allowedHeaders: ["authorization", "Content-Type"], // you can change the headers
    exposedHeaders: ["authorization"], // you can change the headers
    origin: [process.env.URL_CLIENT, "http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
app.listen(PORT, () => {
  console.log(">>>>Server running on port: " + PORT);
});

connectDB();
initAppRoutes(app);
const ip = "172.16.34.202";

// Config SocketIO
const server = require("http").Server(app);
configSocket(server);
server.listen(PORT_SOCKET, () => {
  console.log(">>>>Socket running on port: " + PORT_SOCKET);
});
