import { Router } from "express";
import Stripe from "stripe";

const route: Router = Router();

route.post("/payment", async (req, res) => {
  const stripe = process.env.STRIPE_SEC!
    ? new Stripe(process.env.STRIPE_SEC!)
    : null;
  if (!stripe) {
    // handle the case where `process.env.STRIPE_SEC` is undefined
    // e.g. throw an error, log a message, or take any other appropriate action
    throw new Error("Stripe secret key is undefined");
  }

  const tokenId = req.body.tokenId;
  const amount = req.body.amount;

  if (!tokenId || !amount) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  try {
    const stripeRes = await stripe.charges.create({
      source: tokenId,
      amount: amount,
      currency: "npr",
    });
    res.status(200).json(stripeRes);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default route;
