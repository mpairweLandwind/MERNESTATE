
import { create } from "zustand";
import apiRequest from "./apiRequest";


export const useNotificationStore = create((set) => ({
  number: 0,
  fetch: async (token) => {
    try {
      const res = await apiRequest("/user/notification", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      set({ number: res.data });
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  },
  decrease: () => {
    set((prev) => ({ number: prev.number - 1 }));
  },
  reset: () => {
    set({ number: 0 });
  },
}));
