import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const isAuth: RequestHandler<{}, any, any, {}> = (req, _, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error("not authenticated 1");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("not authenticated 2");
  }

  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = payload.userId;
    next();
    return;
  } catch {}

  throw new Error("not authenticated 3");
};