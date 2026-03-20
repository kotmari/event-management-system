import { create } from "zustand";

import { api } from "../api/api";
import type { AIState, IMessage } from "../types";

export const useIAStore = create<AIState>((set) => ({
  messages: [],
  isLoading: false,
  error: null,

  askAssistant: async (question: string) => {
    set({ isLoading: true, error: null });

    const userMessage: IMessage = { role: "user", content: question };
    set((state) => ({ messages: [...state.messages, userMessage] }));

    try {
      const response = await api.post("/ai/chat", { question });

      const aiText = response.data.answer || "Sorry, I couldn't process that.";
      const assistantMessage: IMessage = {
        role: "assistant",
        content: aiText,
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to get AI response",
        isLoading: false,
      });
    }
  },

  clearChat: () => set({ messages: [], error: null }),
}));
