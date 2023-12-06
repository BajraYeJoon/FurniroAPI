import express, { Request, Response, Router } from "express";

const route: Router = express.Router();

route.get("/usertest", (req: Request, res: Response) => {
  // Your code here
  res.send("Hello from user route");
});

route.post("/userpost", (req: Request, res: Response) => {
  const username = req.body.username;
  res.send(`Hello ${username}`);
});

export default route;
