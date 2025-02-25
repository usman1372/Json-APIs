const express = require("express");
const userRouter = require("./Routes/user");
const { connectMongoDb } = require("./connection");
const { logReqRes } = require("./MiddleWares");

//Create instance of express
const app = express();
const Port = 8000;

//Conection to mongodb
connectMongoDb("mongodb://127.0.0.1:27017/youtube-app-1").then(() =>
  console.log("Mongodb connected!")
);

//Middle ware
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes("log.txt"));

//Routes
app.use("/api/users", userRouter);

//Create server
app.listen(Port, () => console.log(`Server started at Port: ${Port}`));
