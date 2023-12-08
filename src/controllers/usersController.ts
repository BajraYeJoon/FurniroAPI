import { Request, Response } from "express";
import User from "../models/User";
import encryptPassword from "../lib/encryptPassword";

async function GetUserController(req: Request, res: Response) {
  try {
    const getNewUsersQuery = req.query.new as string;

    const users = getNewUsersQuery
      ? await User.find().sort({ createdAt: -1 }).limit(1)
      : await User.find({});

    return res.status(200).json(users);
  } catch (err) {
    console.error("Error during user find", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function GetSingleUserController(req: Request, res: Response) {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user?._doc;
    return res.status(200).json(others);
  } catch (err) {
    console.error("Error during user find", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const DeleteUserController = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "User has been deleted" });
  } catch (err) {
    console.error("Error during user delete", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

async function updateUserController(req: Request, res: Response) {
  if (req.body.password) {
    const encryptedPassword = encryptPassword(req.body.password);
    req.body = { ...req.body, password: encryptedPassword };
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error during user update", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const GetStatsController = async (req: Request, res: Response) => {
  const today = new Date();
  const lastYear = new Date(today.setFullYear(today.getFullYear() - 1));

  try {
    const statsData = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      { $project: { month: { $month: "$createdAt" } } },
      { $group: { _id: "$month", total: { $sum: 1 } } },
    ]);

    return res.status(200).json(statsData);
  } catch (err) {
    console.error("Error during user stats", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { GetUserController, GetSingleUserController, updateUserController };
