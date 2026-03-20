import Groq from "groq-sdk";
import { Request as ExpressRequest, NextFunction, Response } from "express";
import dotenv from "dotenv";
import { prisma } from "../db/prisma";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface Request extends ExpressRequest {
  user?: { id: number };
}

export const askAssistant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { question } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!question)
      return res.status(400).json({ message: "Question is required" });

    const listEvents = await prisma.event.findMany({
      where: {
        OR: [
          { organizerId: userId },
          { participants: { some: { userId: userId } } },
        ],
      },
      include: {
        _count: { select: { participants: true } },
        organizer: { select: { name: true } },
        tags: { select: { name: true } },
      },
      orderBy: { date: "asc" },
    });

    const eventsContext =
      listEvents.length > 0
        ? listEvents
            .map(
              (ev) =>
                `- Date: ${new Date(ev.date).toLocaleString()}, ` +
                `Title: ${ev.title}, ` +
                `Organizer: ${ev.organizer.name}, ` +
                `Tags: ${ev.tags.map((t) => t.name).join(", ")}, ` +
                `Participants: ${ev._count.participants}`,
            )
            .join("\n")
        : "User has no events.";

    const systemPrompt = `
      You are a helpful assistant for the "My Events" app. 
      Analyze the user's data and answer questions based ONLY on the provided context.
      If the user's question is unclear or not related to events, say: "Sorry, I didn't understand that. Please try rephrasing your question."
      
      User Events Context:
      ${eventsContext}
      
      Today's date is: ${new Date().toLocaleDateString()}.
    `;

    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      temperature: 0.5,
    });

    res.json({ answer: response.choices[0].message.content });
  } catch (error) {
    next(error);
  }
};
