// notificationStore.js
import { create } from "zustand";
import { fetchData } from "./utils";


export const useNotificationStore = create((set) => ({
  number: 0,
  fetch: async (token) => {
    try {
      const res = await fetchData("/api/user/notification", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',  // Ensure Content-Type is set
        },
      });
      set({ number: res.data });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  },
  decrease: () => {
    set((prev) => ({ number: prev.number - 1 }));
  },
  reset: () => {
    set({ number: 0 });
  },
}));
