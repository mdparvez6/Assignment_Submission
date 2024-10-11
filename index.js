import express from "express";
import { connectDB } from "./db/index.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000);
    console.log(`server is running at port: ${process.env.PORT}`);
  })
  .catch((error) => {
    console.log("Mongo Database connection failed", error);
  });

import adminrouter from "./Routes/admin.routes.js";
import userrouter from "./Routes/user.routes.js";
app.use("/user", userrouter);
app.use("/admin", adminrouter);
