const path = require("path");
const os = require("os");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const bodyParser = require("body-parser");
const session = require("express-session");
const cron = require("node-cron");
const axios = require("axios");
// const dns = require("dns")

const rateLimit = require("express-rate-limit");

const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const postRouter = require("./routes/postRoutes");
const conversationRouter = require("./routes/conversation.routes");
const messageRouter = require("./routes/message.routes");

const ApiError = require("./utils/ApiError");
const globalErrorHandler = require("./controllers/errorController");
let HOSTED_URL = "https://socialmediabackend-7o1t.onrender.com/";
cron.schedule("*/11 * * * *", async () => {
  console.log("Restarting Server");
  try {
    const response = await axios.get(HOSTED_URL);
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error calling the route:", error);
  }
});
const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
    }
  })
);
app.set("trust proxy", true);
app.set("trust proxy", "loopback, linklocal, uniquelocal");

app.use(express.urlencoded({ extended: true }));
//http://localhost:3000/images/folder1/image1.jpg
// app.use(express.static(path.join(__dirname, "public")))
// app.use(express.static(path.join(__dirname, "public/images")))
// app.use(express.static(path.join(__dirname, "public/images/posts")))
app.use("/public", express.static(path.join(__dirname, "public")));

const corsOptions = {
  origin: true, //(https://your-client-app.com)
  credentials: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, PATCH, PUT, DELETE",
    "Access-Control-Allow-Headers":
      "Content-Type, X-Auth-Token, Origin, Authorization"
  }
};

//Data Sanitization against noSql Query injection
app.use(mongoSanitize());

//Data Sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(hpp());

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!"
});

app.use(cors({ credentials: true, origin: true }));

//middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("common"));
app.use(cookieParser());
//app.use("/api", limiter)

app.get("/", (req, res) => {
  const forwarded = req.headers["x-forwarded-for"];
  let clientIp = forwarded ? forwarded.split(",").shift() : req.ip;
  if (clientIp === "::1") {
    clientIp = "127.0.0.1";
  }

  res.send(
    `Your IP address is ${clientIp}, 🚀 ~ app.get ~ remoteAddress: ${req.socket.remoteAddress}`
  );
});

app.get(`/mac-address`, (req, res) => {
  // console.log("🚀 ~ app.get ~ os:", os);
  // console.log("🚀 ~ app.get ~ userInfo:", os.userInfo());
  // console.log("🚀 ~ app.get ~ version:", os.version());
  // console.log("🚀 ~ app.get ~ machine:", os.machine());
  // console.log("🚀 ~ app.get ~ networkInterfaces:", os.networkInterfaces());
  // console.log("🚀 ~ app.get ~ cpus:", os.cpus());
  // const networkInterfaces = os.networkInterfaces();
  // const macAddresses = [];

  // for (const interfaceName in networkInterfaces) {
  //   const interfaces = networkInterfaces[interfaceName];
  //   for (const iface of interfaces) {
  //     if (iface.mac && iface.mac !== "00:00:00:00:00:00") {
  //       macAddresses.push({ interfaceName, mac: iface.mac });
  //     }
  //   }
  // }

  let ip = {
    "cf-connecting-ip": req.headers["cf-connecting-ip"],
    "x-forwarded-for": req.headers["x-forwarded-for"],
    "x-real-ip": req.headers["x-real-ip"],
    "req.connection.remoteAddress": req.connection.remoteAddress,
    "req.socket.remoteAddress": req.socket.remoteAddress,
    "req.ip": req.ip,
    "req.ips": req.ips,
    "req.connection.localAddress": req.connection.localAddress,
    "req.connection.localPort": req.connection.localPort,
    "req.connection.remotePort": req.connection.remotePort,
    "req.connection.address": req.connection.address
  };

  res.json(ip);
});
app.use("/api/v3/users", userRouter);
app.use("/api/v3/auth", authRouter);
app.use("/api/v3/posts", postRouter);
app.use("/api/v3/conversation", conversationRouter);
app.use("/api/v3/message", messageRouter);

app.get("/", (req, res, next) => {
  res.status(200).json({
    status: true,
    data: "The Server is up and RUNNING!"
  });
});

//Redirect unknown Errors
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't Find ${req.originalUrl} on this server`, 404));
});

//Error MiddleWare
app.use(globalErrorHandler);

module.exports = app;
