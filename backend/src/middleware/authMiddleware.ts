import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()

interface DecodedToken {
  userId: number;
  iat: number;
  exp: number;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {

  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  const token = authHeader.split(" ")[1];
 
  try {
const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    
    (req as any).user = { id: decoded.userId };
    next();
  } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
  }
};