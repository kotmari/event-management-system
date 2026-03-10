import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/prisma";
import { eventSchema } from "../dto/event.dto";

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = await eventSchema.validate(req.body);

    const { title, description, date, location, capacity, isPublic } =
      validatedData;

    if (!title || !description || !date || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userId = (req as any).user.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        isPublic: isPublic ?? true,
        capacity: capacity ?? null,
        organizerId: userId,
      },
    });

    res.status(201).json(newEvent);
  } catch (err) {
    next(err);
  }
};

export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const eventDetails = await prisma.event.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        organizer: {
          select: {
            name: true,
          },
        },
        _count: {
          select: { participants: true },
        },
      },
    });

    res.status(200).json(eventDetails);
  } catch (err) {
    next(err);
  }
};

export const publicEvents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const publicListEvents = await prisma.event.findMany({
      where: {
        isPublic: true,
      },
      take: limit,
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
        organizer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    res.status(200).json(publicListEvents);
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const userId = (req as any).user.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const existingEvent = await prisma.event.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (existingEvent?.organizerId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not the organizer of this event" });
    }
    const updateEvent = await prisma.event.update({
      where: { id: Number(id) },
      data: req.body,
    });

    res.status(200).json(updateEvent);
  } catch (err) {
    next(err);
  }
};
export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const userId = (req as any).user.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const event = await prisma.event.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event?.organizerId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not the organizer of this event" });
    }
    const deleteEvent = await prisma.event.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const joinEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
  const { id } = req.params;

  const userId = (req as any).user.id;

  if (!userId) {
    return res.status(401).json({ message: "User not authorized" });
  }

  const event = await prisma.event.findUnique({
    where: { id: Number(id) },
    include: { _count: { select: { participants: true } } },
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const isAlreadyJoined = await prisma.event.findFirst({
    where: {
      id: Number(id),
      participants: { some: { id: userId } },
    },
  });

  if (!isAlreadyJoined) {
    return res
      .status(400)
      .json({ message: "You have already joined this event" });
  }

  if (event.capacity && event._count.participants >= event.capacity) {
    return res.status(400).json({ message: "Event is full" });
  }

  const updatedEvent = await prisma.event.update({
    where: { id: Number(id) },
    data: {
      participants: {
        connect: {
          id: userId,
        },
      },
    },
  });
  res.status(200).json({ message: "Successfully joined the event!", event: updatedEvent })
} catch (err) {
  next(err)
}
};
export const leaveEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
  const { id } = req.params;

  const userId = (req as any).user.id;

  if (!userId) {
    return res.status(401).json({ message: "User not authorized" });
  }

  const event = await prisma.event.findUnique({
    where: { id: Number(id) },
    include: { _count: { select: { participants: true } } },
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const isParticipant = await prisma.event.findFirst({
    where: {
      id: Number(id),
      participants: { some: { id: userId } },
    },
  });

  if (!isParticipant) {
    return res.status(400).json({ message: "You are not participating in this event" });
  }

  const updatedEvent = await prisma.event.update({
    where: { id: Number(id) },
    data: {
      participants: {
        disconnect: {
          id: userId,
        },
      },
    },
  });
  res.status(200).json({ message: "Successfully left the event!", event: updatedEvent })
} catch (err) {
  next(err)
}
};
