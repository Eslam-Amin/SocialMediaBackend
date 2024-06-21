const path = require("path")
const express = require("express");
const helmet = require("helmet");
const morgan = require('morgan');
const cors = require("cors");
const cookieParser = require("cookie-parser")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const hpp = require("hpp")
const bodyParser = require('body-parser');


const rateLimit = require("express-rate-limit")

const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const postRouter = require("./routes/postRoutes");
const conversationRouter = require("./routes/conversation.routes");
const messageRouter = require("./routes/message.routes");



const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController")


const app = express();
app.use(express.urlencoded({ extended: true }))
//http://localhost:3000/images/folder1/image1.jpg
// app.use(express.static(path.join(__dirname, "public")))
// app.use(express.static(path.join(__dirname, "public/images")))
// app.use(express.static(path.join(__dirname, "public/images/posts")))
app.use('/public', express.static(path.join(__dirname, 'public')));

const corsOptions = {
    origin: true,//(https://your-client-app.com)
    credentials: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, PATCH, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, Origin, Authorization'
    }
};

//Data Sanitization against noSql Query injection
app.use(mongoSanitize());

//Data Sanitization against XSS
app.use(xss())

//Prevent parameter pollution
app.use(hpp())

const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests fromt this IP, please try again in an hour!"
})

// const origin = process.env.NODE_ENV === "production" ? "https://social-media-network.netlify.app/" : "http://localhost:3001/"
app.use(cors({ credentials: true,
 origin: true 
}));

//maxAge: 3600000 

//middleware
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet());
app.use(morgan("common"));
app.use(cookieParser())
//app.use("/api", limiter)

app.use("/api/v3/users", userRouter);
app.use("/api/v3/auth", authRouter);
app.use("/api/v3/posts", postRouter);
app.use("/api/v3/conversation", conversationRouter);
app.use("/api/v3/message", messageRouter);

//Redirect unknown Errors
app.all("*", (req, res, next) => {
    next(new AppError(`Can't Find ${req.originalUrl} on this server`, 404));
})

//Error MiddleWare
app.use(globalErrorHandler)

module.exports = app