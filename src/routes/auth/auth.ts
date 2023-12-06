import { Router, Request, Response } from "express";
import User, { UserDocument } from "../../models/User";
import { validationResult } from "express-validator";
import CryptoJS from "crypto-js";

const route: Router = Router();

// ============================
// Register
// ============================
route.post("/register", async (req: Request, res: Response) => {
  try {
    // Validate data
    const errors = validationResult(req);

    // If errors are not empty, return 400
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    const newUser: UserDocument = new User({
      username,
      email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC!
      ).toString(),
    });

    // Save user and return response
    const savedUser: UserDocument = await newUser.save();

    // Send response to the client
    return res.status(201).json(savedUser);
  } catch (err) {
    console.error("Error during user register", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ============================
// Login
// ============================

route.post("/login", async (req: Request, res: Response) => {
  try {
    // Finding the user in the database
    const user = await User.findOne({
      username: req.body.username,
    });

    // If user doesn't exist, return 401
    if (!user) {
      return res.status(401).json({ error: "Wrong credentials" });
    }

    // Decrypting the password
    const hashedPassword = CryptoJS.AES.decrypt(
      user!.password,
      process.env.PASS_SEC!
    );

    // Converting the password to string
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    // If password doesn't match, return 400
    if (originalPassword !== req.body.password) {
      return res.status(400).json({ error: "Wrong credentials" });
    }
    const { password, ...others } = (user as UserDocument)._doc;

    // If everything is fine, return user
    return res.status(200).json(others);
  } catch (err) {
    console.error("Error during login", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default route;
