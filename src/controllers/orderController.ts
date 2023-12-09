import Order from "../models/Order";
import { Request, Response } from "express";

export const GetAllOrdersController = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (err) {
    console.error("Error during order find", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const GetOrderController = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const CreateOrderController = async (req: Request, res: Response) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    console.error("Error during order creation", err);
    res.status(500).json(err);
  }
};

export const UpdateOrderController = async (req: Request, res: Response) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const DeleteOrderController = async (req: Request, res: Response) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order has been deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const GetIncomeController = async (req: Request, res: Response) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
};
