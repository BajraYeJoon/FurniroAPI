import { Router, Response, Request } from "express";
import verifyTokenAndAuthorization from "../middleware/verifyToken";
import User from "../models/User";
import CryptoJS from "crypto-js";
import verifyTokenAndAdmin from "../middleware/verifyToken";

const route: Router = Router();

/**
 * Route handler for the HTTP GET method that retrieves all users from the database.

 */
route.get("/", verifyTokenAndAdmin, async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    console.error("Error during user find", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Route handler for the HTTP GET method that retrieves user from the database.

 */
route.get(
  "/find/:id",
  verifyTokenAndAdmin,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req?.params?.id);
      const { password, ...others } = user?._doc;
      return res.status(200).json(others);
    } catch (err) {
      console.error("Error during user find", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * Route handler for the HTTP DELETE method that deletes a user from the database.

 */

route.delete(
  "/:id",
  verifyTokenAndAdmin,
  async (req: Request, res: Response) => {
    try {
      await User.findByIdAndDelete(req?.params?.id);
      return res.status(200).json({ message: "User has been deleted" });
    } catch (err) {
      console.error("Error during user delete", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * Route handler for the HTTP PUT method that updates a user in the database.
 */
route.put(
  "/:id",
  verifyTokenAndAuthorization,
  async (req: Request, res: Response) => {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC!
      ).toString();
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req?.params?.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json(updatedUser);
    } catch (err) {
      console.error("Error during user update", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default route;
