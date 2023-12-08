import { Router } from "express";
import verifyTokenAndAuthorization from "../middleware/verifyToken";
import User from "../models/User";
import verifyTokenAndAdmin from "../middleware/verifyToken";
import encryptPassword from "../lib/encryptPassword";
import {
  GetSingleUserController,
  GetUserController,
  DeleteUserController,
  updateUserController,
  GetStatsController,
} from "../controllers/usersController";

const route: Router = Router();

/**
 * Route handler for retrieving all users from the database
 */
route.get("/", verifyTokenAndAdmin, GetUserController);

/**
 * Route handler for retrieving a specific user from the database.
 */
route.get("/find/:id", verifyTokenAndAdmin, GetSingleUserController);

/**
 * Route handler for deleting a user from the database.
 */
route.delete("/:id", verifyTokenAndAdmin, DeleteUserController);

/**
 * Route handler for updating a user in the database.
 */
route.put("/:id", verifyTokenAndAuthorization, updateUserController);

/**
 * Route handler for retrieving user stats from the database.
 */
route.get("/stats", verifyTokenAndAdmin, GetStatsController);

export default route;
