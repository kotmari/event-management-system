import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {prisma} from "../db/prisma";
import { loginSchema} from "../dto/auth.dto";

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
      
    const validatedData = await loginSchema.validate(req.body);

    const { email, password } = validatedData;

    const user = await prisma.user.findUnique({where: {email}})

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }


    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({ token, user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
};

