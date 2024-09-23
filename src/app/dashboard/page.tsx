"use client";
import { useUserStore } from "../services/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Role } from "@/types/User";
import { Product } from "@/types/Product";
import { io, Socket } from "socket.io-client";

import { getUsers } from "../services/usersSercice";
import { getProducts } from "../services/productsService";

export default function Dashboard() {
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const [user, setLoggedUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function getUserFromCookie() {
      const res = await fetch("/api/auth/me"); // Endpoint para obtener el usuario desde la cookie
      if (res.ok) {
        const user: User = await res.json();
        setUser(user); // Guardamos el usuario en el estado global
        setLoggedUser(user);

        if (user.role == "USER") {
          router.push("/");
        }
      } else {
        router.push("/login");
      }
    }

    getUserFromCookie();
  }, [setUser]);

  useEffect(() => {
    // get users only clients
    getUsers({ roles: [Role.USER] }).then((users) => {
      setUsers(users as User[]);
    });

    getProducts().then((products) => {
      setProducts(products);
    });
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:8080");

    socket.on("connect", () => {
      console.log("Conectado al servidor de WebSockets");
    });

    socket.on("users", (users: User[]) => {
      const clients = users.filter((user) => user.role === Role.USER);
      setUsers(clients);
    });

    socket.on("products", (products: Product[]) => {
      setProducts(products);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <p className="mb-6 text-5xl font-semibold font-[family-name:var(--font-geist-mono)]">
        {user?.name} /{user?.role}
      </p>

      <p>
        Bienvenido a la página de administración. Aquí podrás gestionar los
        usuarios, productos y pedidos de la tienda.
      </p>

      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Usuarios</div>
          <div className="stat-value">{users.length}</div>
          <div className="stat-desc">Total de clientes</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Inventario</div>
          <div className="stat-value">{products.length}</div>
          <div className="stat-desc">Total de productos</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Pedidos</div>
          <div className="stat-value">1,200</div>
          <div className="stat-desc">Total de pedidos</div>
        </div>
      </div>
    </>
  );
}
