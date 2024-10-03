const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const mongoose = require("mongoose");

const app = require("./app");

const PASSWORD = process.env.DATABASE_PASSWORD;
const DB = process.env.DATABASE_URL.replace("<PASSWORD>", PASSWORD);

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected to MongoDB"));

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception 💥 Shutting Down!!");
  server.close(() => {
    process.exit(1);
  });
});
