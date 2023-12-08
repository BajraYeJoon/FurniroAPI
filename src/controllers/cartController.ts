import Cart from "../models/Cart";
import { Response, Request } from "express";

export const GetAllCartsController = async (req: Request, res: Response) => {
  try {
    const carts = await Cart.find();
    return res.status(200).json(carts);
  } catch (err) {
    console.error("Error during cart find", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const GetCartController = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    return res.status(200).json(cart);
  } catch (err) {
    console.error("Error during cart find", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const CreateCartController = async (req: Request, res: Response) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    return res.status(200).json(savedCart);
  } catch (err) {
    console.error("Error during cart creation", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const UpdateCartController = async (req: Request, res: Response) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    console.error("Error during cart update", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const DeleteCartController = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Cart has been deleted" });
  } catch (err) {
    console.error("Error during cart delete", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
