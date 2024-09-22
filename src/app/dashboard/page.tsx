"use client";
import { useUserStore } from "../services/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/types/User";

export default function Dashboard() {
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const [user, setLoggedUser] = useState<User | null>(null);

  useEffect(() => {
    async function getUserFromCookie() {
      const res = await fetch("/api/auth/me"); // Endpoint para obtener el usuario desde la cookie
      if (res.ok) {
        const user: User = await res.json();
        setUser(user); // Guardamos el usuario en el estado global
        setLoggedUser(user);
      } else {
        router.push("/login");
      }
    }

    getUserFromCookie();
  }, [setUser]);

  useEffect(() => {
    if (user?.role == "USER") {
      router.push("/");
    }
  }, [user?.role]);

  return (
    <main className="h-screen flex justify-center items-center flex-col text-6xl">
      <h1 className="mb-6">
        <strong>Dashboard</strong>
      </h1>
      <p>{user?.role}</p>
    </main>
  );
}
