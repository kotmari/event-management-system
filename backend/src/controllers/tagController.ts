import { Request as ExpressRequest, NextFunction, Response } from "express";
import { prisma } from "../db/prisma";

interface Request extends ExpressRequest {
  user?: { id: number };
}

export const getAllTags = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {

   const tags = await prisma.tag.findMany({
      orderBy: {
         name: "desc"
      }
   })

   res.status(200).json(tags)
  } catch (error) {
   next(error);
  }
};
