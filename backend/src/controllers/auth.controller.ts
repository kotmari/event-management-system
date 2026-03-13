import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {prisma} from "../db/prisma";
import { loginSchema, registerSchema } from "../dto/auth.dto";
import { generateTokens } from "../utils/generateTokens";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
      
    const { email, password } = await registerSchema.validate(req.body, { 
      abortEarly: false 
    });

    const existingUser = await prisma.user.findUnique({ where: { email } });


    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
         email,
        password: hashedPassword,
      },
    });

     const { accessToken, refreshToken } = generateTokens(user.id);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await prisma.refreshToken.create({
      data: {
        token: hashedRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const { password: _, ...userWithoutPassword } = user;


    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ accessToken, user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = await loginSchema.validate(req.body, { abortEarly: false });

    const { email, password } = validatedData;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);
    const hashedToken = await bcrypt.hash(refreshToken, 10)


    await prisma.refreshToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ accessToken, user: userWithoutPassword });

    
  } catch (err) {
    next(err);
  }
};

export const refreshTokens = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

  
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { id: number };


    const storedTokens = await prisma.refreshToken.findMany({
      where: { userId: payload.id, revoked: false }
    });

     const tokenRecord = storedTokens.find(t => bcrypt.compare(refreshToken, t.token));

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }


    const { accessToken, refreshToken: newRefreshToken } = generateTokens(payload.id);
    const hashedNewToken = await bcrypt.hash(newRefreshToken, 10);


    await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
    await prisma.refreshToken.create({
      data: {
        token: hashedNewToken,
        userId: payload.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });


    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as { id: number };

      await prisma.refreshToken.deleteMany({
        where: { userId: payload.id }
      });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });

  } catch (err) {
    next(err);
  }
};