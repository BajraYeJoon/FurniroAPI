import Product from "../models/Product";
import { Request, Response } from "express";

export const GetAllProductsController = async (req: Request, res: Response) => {
  const queryNew = req.query.new;
  const queryCategory = req.query.category;

  try {
    let allproducts;

    if (queryNew) {
      const allproducts = await Product.find()
        .sort({
          createdAt: -1,
        })
        .limit(5);
    } else if (queryCategory) {
      allproducts = await Product.find({
        categories: {
          $in: [queryCategory],
        },
      });
    } else {
      allproducts = await Product.find();
    }

    return res.status(200).json(allproducts);
  } catch (err) {
    console.error("Error during product find", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const GetProductController = async (req: Request, res: Response) => {
  try {
    const products = await Product.findById(req.params.id);

    return res.status(200).json(products);
  } catch (err) {
    console.error("Error during product find", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const CreateProductController = async (req: Request, res: Response) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    return res.status(200).json(savedProduct);
  } catch (err) {
    console.error("Error during product creation", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const UpdateProductController = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Error during product update", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const DeleteProductController = async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product has been deleted" });
  } catch (err) {
    console.error("Error during product delete", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
