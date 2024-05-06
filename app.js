const express = require("express");
const helmet = require("helmet");
const morgan = require('morgan');
const cors = require("cors");
const cookieParser = require("cookie-parser")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const hpp = require("hpp")


const rateLimit = require("express-rate-limit")

const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const postRouter = require("./routes/postRoutes");



const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController")


const app = express();

const corsOptions = {
    origin: '*',//(https://your-client-app.com)
    methods: ['GET', 'PUT', 'POST', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    credentials: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': 'true'
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

// app.use(cors({ credentials: true, origin: true }));
app.use(cors({ credentials: true, origin: true }));



//middleware
app.use(express.json())
app.use(helmet());
// app.use(morgan("common"));
app.use(cookieParser())
app.use("/api", limiter)

app.use("/api/v2/users", userRouter);
app.use("/api/v2/auth", authRouter);
app.use("/api/v2/posts", postRouter);

//Redirect unknown Errors
app.all("*", (req, res, next) => {
    next(new AppError(`Can't Find ${req.originalUrl} on this server`, 404));
})

//Error MiddleWare
app.use(globalErrorHandler)

module.exports = app