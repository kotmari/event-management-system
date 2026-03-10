import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/prisma";

export const getUserEvents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authorized" });
    }
    const myEvents = await prisma.event.findMany({
      where: {
        OR: [
          {
            participants: {
              some: { id: userId },
            },
          },
          { organizerId: userId },
        ],
      },
      orderBy: {
        date: 'asc'
      }
    });

    res.status(200).json(myEvents);
  } catch (error) {
    next(error);
  }
};
