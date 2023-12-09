import { Router } from "express";
import verifyTokenAndAdmin from "../middleware/verifyToken";
import {
  CreateCartController,
  DeleteCartController,
  UpdateCartController,
  GetCartController,
  GetAllCartsController,
} from "../controllers/cartController";
import { verifyTokenAndAuthorization } from "../middleware/verifyToken";
import verifyToken from "../middleware/verifyToken";

const route: Router = Router();

// Retrieve all carts
route.get("/", verifyTokenAndAdmin, GetAllCartsController);

// Find a cart by ID but takes user id as user id is the cart id
route.get("/find/:userId", verifyTokenAndAuthorization, GetCartController);

// Create a new cart
route.post("/", verifyToken, CreateCartController);

// Update a cart
route.put("/:id", verifyTokenAndAuthorization, UpdateCartController);

// Delete a cart
route.delete("/:id", verifyTokenAndAuthorization, DeleteCartController);

export default route;
