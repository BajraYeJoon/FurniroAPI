// import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// declare module "express-serve-static-core" {
//   interface Request {
//     user: any;
//   }
// }
/* The `verifyToken` function is a middleware function that is used to verify the authenticity of a
JSON Web Token (JWT) provided in the request headers. */
function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers.token;

  /* This code block is responsible for verifying the authenticity of a JSON Web Token (JWT) provided
  in the request headers. */
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

/* The `export default` statement is used to export the `verifyTokenAndAuthorization` function as the
default export of the module. This means that when this module is imported into another module, the
`verifyTokenAndAuthorization` function can be accessed using any name of the developer's choice. */
export default function verifyTokenAndAuthorization(
  req: any,
  res: any,
  next: any
) {
  /* The `verifyTokenAndAuthorization` function is a middleware function that is used to verify the
  authenticity of a JSON Web Token (JWT) provided in the request headers and also checks if the user
  making the request is authorized to perform the requested action. */
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ error: "You are not allowed to do that" });
    }
  });
}
