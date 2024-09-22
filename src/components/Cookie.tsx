import { useEffect } from "react";
import { useUserStore } from "@/app/services/store/userStore";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const fetchUserFromCookie = async () => {
      const res = await fetch("/api/auth/user");
      if (res.ok) {
        const user = await res.json();
        setUser(user); // Guardar el usuario en Zustand
      }
    };

    fetchUserFromCookie();
  }, [setUser]);

  return <>{children}</>;
}
