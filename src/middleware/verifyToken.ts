// import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// declare module "express-serve-static-core" {
//   interface Request {
//     user: any;
//   }
// }

function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers.token;

  if (!authHeader) {
    return res.status(403).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SEC!, (err: any, decoded: any) => {
    if (err) {
      return res.status(500).json({ error: "Failed to authenticate token" });
    }

    // Add user to request
    req.user = decoded;
    next();
  });
}

export default function verifyTokenAndAuthorization(
  req: any,
  res: any,
  next: any
) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ error: "You are not allowed to do that" });
    }
  });
}
