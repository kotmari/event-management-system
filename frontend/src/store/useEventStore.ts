import { create } from "zustand";
import type { IEvent, IEventState, ITag } from "../types";
import { api } from "../api/api";

export const useEventStore = create<IEventState>()((set, get) => ({
  events: [],
  tags: [],
  myEvents: [],
  currentEvent: null,
  isLoading: false,
  error: null,

  fetchEvents: async (tagId?: number | null) => {
    set({ isLoading: true, error: null });
    try {
      const url = tagId ? `/events?tagId=${tagId}` : "/events";
      const { data } = await api.get<IEvent[]>(url);
      set({ events: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchTags: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<ITag[]>("/tags")
      set({tags: data, isLoading: false})
      
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchMyEvents: async () => {
    try {
      const { data } = await api.get<IEvent[]>("/user/me/events");
      set({ myEvents: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchEventById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/events/${id}`);
      set({ currentEvent: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createEvent: async (eventData) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/events", eventData);

      await get().fetchEvents();

      set({ isLoading: false });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateEvent: async (id, eventData) => {
    set({ isLoading: true, error: null });
    try {
      await api.patch(`/events/${id}`, eventData);
      await get().fetchEvents();
      set({ isLoading: false });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      set({ error: errorMessage, isLoading: false });
    }
  },

  deleteEvent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/events/${id}`);
      set((state) => ({
        events: state.events.filter((e) => e.id !== id),
        isLoading: false,
      }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      set({ error: errorMessage, isLoading: false });
    }
  },

  joinEvent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.post(`/events/${id}/join`);
      await get().fetchEventById(id);
      await get().fetchEvents();
      set({ isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  leaveEvent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Leaving event:", id);
      await api.post(`/events/${id}/leave`);

      await get().fetchEventById(id);
      await get().fetchEvents();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      set({ error: errorMessage, isLoading: false });
    }
  },
}));
