const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require('morgan');


const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");

const PORT = process.env.PORT || 3000;

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("connected to MongoDB"))




//middleware
app.use(express.json())
app.use(helmet());
app.use(morgan("common"));



app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);


app.listen(PORT, () => {
    console.log("backend server is running")
})

