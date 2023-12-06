import { Router, Response, Request } from "express";
import verifyTokenAndAuthorization from "../middleware/verifyToken";
import User from "../models/User";
import CryptoJS from "crypto-js";

const route: Router = Router();

// ============================
// Update
// ============================

/* The code `route.put()` is defining a route handler for the HTTP PUT method. It specifies the route
path as `"/:id"`, which means that it expects an `id` parameter in the URL. */
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
      // Update user
      /* The code `const updatedUser = await User.findByIdAndUpdate(req.params.id, { : req.body }, {
     new: true });` is updating a user in the database. */
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      // Send the updated user in the response
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error("Error during user update", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default route;
