import express from "express";
import mongoose from "mongoose";
import path from "path";
import userRoute from "./routes/user";
import authRoute from "./routes/auth/auth";
import productRoute from "./routes/product";
import orderRoute from "./routes/order";
import cartRoute from "./routes/cart";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Connect to MongoDB with Mongoose.
if (!process.env.MONGODB_URI) {
  throw new Error("MONGO_URI must be defined in the environment");
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.log(err);
  });

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/carts", cartRoute);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
