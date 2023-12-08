import { Router } from "express";
import verifyTokenAndAdmin, {
  verifyTokenAndAuthorization,
} from "../middleware/verifyToken";
import {
  CreateOrderController,
  DeleteOrderController,
  UpdateOrderController,
  GetOrderController,
  GetAllOrdersController,
  GetIncomeController,
} from "../controllers/orderController";
import verifyToken from "../middleware/verifyToken";

const route: Router = Router();

// Retrieve all orders
route.get("/", verifyTokenAndAdmin, GetAllOrdersController);

// Find an order by ID
route.get("/find/:userId", verifyTokenAndAuthorization, GetOrderController);

// Create a new order
route.post("/", verifyToken, CreateOrderController);

// Update an order
route.put("/:id", verifyTokenAndAdmin, UpdateOrderController);

// Delete an order
route.delete("/:id", verifyTokenAndAdmin, DeleteOrderController);

route.get("/income", verifyTokenAndAdmin, GetIncomeController);

export default route;
