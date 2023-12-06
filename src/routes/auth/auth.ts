import { Router, Request, Response } from "express";
import User, { UserDocument } from "../../models/User";
import { validationResult } from "express-validator";

const route: Router = Router();

// ============================
// Register
// ============================
route.post("/register", async (req: Request, res: Response) => {
  try {
    // Validate data
    const error = validationResult(req);

    // If error is empty, return 400
    if (!error.isEmpty()) {
      return res.sendStatus(400).json({ error: error.array() });
    }

    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .sendStatus(400)
        .json({ error: "User already exists with this email" });
    }

    const newUser: UserDocument = new User({
      username,
      email,
      password,
    });

    // Save user and return response
    const saveUser: UserDocument = await newUser.save();
    // Send to client
    return res.sendStatus(201).json(saveUser);
  } catch (err) {
    console.log("Error during user register", err);
    return res.sendStatus(500).json({ err: "Internal server error" });
  }
});

export default route;
