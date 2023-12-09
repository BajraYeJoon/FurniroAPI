import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  user?: any;
}

/**
 * Verify token middleware
 *
 */
function verifyToken(req: CustomRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.token as string;

  if (!authHeader) {
    return res.status(403).json({ error: "No token provided" });
  }
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Invalid token format" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SEC!, (err: any, decoded: any) => {
    if (err) {
      return res.status(500).json({ error: "Failed to authenticate token" });
    }

    req.user = decoded;
    next();
  });
}

// ============================
// Verify token and authorization
// ============================
/**
 * The function verifies the token and authorization of a request, allowing access if the user ID
 * matches the requested ID or if the user is an admin.
 * @param {CustomRequest} req - The `req` parameter is the request object that contains information
 * about the incoming HTTP request, such as headers, query parameters, and request body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to manipulate the response,
 * such as setting headers, sending data, and handling errors.
 * @param {NextFunction} next - The `next` parameter is a function that is used to pass control to the
 * next middleware function in the request-response cycle. It is typically called as `next()` to invoke
 * the next middleware function.
 */
export function verifyTokenAndAuthorization(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      handleUnauthorizedRequest(res);
    }
  });
}

// ============================
// Verify token and admin

// ============================
/**
 * The function `verifyTokenAndAdmin` verifies the token in the request and checks if the user is an
 * admin, and if so, calls the next middleware function; otherwise, it handles an unauthorized request.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to manipulate the response,
 * such as setting the status code, sending JSON data, or redirecting the client to a different URL.
 */
export function verifyTokenAndAdmin(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      handleUnauthorizedRequest(res);
    }
  });
}

function handleUnauthorizedRequest(res: Response) {
  res.status(403).json({ error: "You are not allowed to do that" });
}

export default verifyTokenAndAdmin;
