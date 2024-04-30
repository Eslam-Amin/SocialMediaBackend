const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require('morgan');
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const postRouter = require("./routes/postRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController")


const app = express();

app.use(cors())


const PASSWORD = process.env.DATABASE_PASSWORD;
const DB = process.env.DATABASE_URL.replace("<PASSWORD>", PASSWORD);

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("connected to MongoDB"))




//middleware
app.use(express.json())
app.use(helmet());
app.use(morgan("common"));



app.use("/api/v2/users", userRouter);
app.use("/api/v2/auth", authRouter);
app.use("/api/v2/posts", postRouter);

//Redirect unknown Errors
app.all("*", (req, res, next) => {
    console.log("a7a")
    next(new AppError(`Can't Find ${req.originalUrl} on this server`, 404));
})

//Error MiddleWare
app.use(globalErrorHandler)

app.listen(3000, () => {
    console.log("backend server is running")
})

