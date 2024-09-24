"use client";
import { useEffect, useState } from "react";
import { Order } from "@/types/Order";
import { useRouter } from "next/navigation";
import { User } from "@/types/User";
import { useUserStore } from "@/app/services/store/userStore";
import OrderComponent from "@/components/Order";

export default function MisPedidos() {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const setUser = useUserStore((state) => state.setUser);
  const [misPedidos, setMisPedidos] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const res = await fetch("/api/auth/me"); // Endpoint para obtener el usuario desde la cookie
      if (res.ok) {
        const user: User = await res.json();
        setUser(user); // Guardamos el usuario en el estado global
        setLoggedUser(user);

        try {
          // Obtener solo los pedidos de este usuario
          const response = await fetch(`/api/orders?userId=${user?.id}`);
          const data = await response.json();
          setMisPedidos(data.orders);
          console.log("Mis pedidos", data.orders);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
        alert("Debes iniciar sesión para comprar");
      }
    }

    getUser();
  }, []);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <ul className="flex flex-wrap justify-center gap-14">
            {misPedidos.map((pedido: Order) => (
              <OrderComponent key={pedido.id} order={pedido} />
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
