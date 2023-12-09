import { Router } from "express";
import verifyTokenAndAdmin from "../middleware/verifyToken";
import {
  CreateProductController,
  DeleteProductController,
  UpdateProductController,
  GetProductController,
  GetAllProductsController,
} from "../controllers/productController";

const route: Router = Router();

// Retrieve all products
route.get("/", GetAllProductsController);

// Find a product by ID
route.get("/find/:id", GetProductController);

// Create a new product
route.post("/", verifyTokenAndAdmin, CreateProductController);

// Update a product
route.put("/:id", verifyTokenAndAdmin, UpdateProductController);

// Delete a product
route.delete("/:id", verifyTokenAndAdmin, DeleteProductController);

export default route;
