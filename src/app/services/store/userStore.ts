import { create } from "zustand";
import { User } from "../../../types/User";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserStore {
  user: User | null;
  getUser: () => User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      getUser: () => get().user,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
