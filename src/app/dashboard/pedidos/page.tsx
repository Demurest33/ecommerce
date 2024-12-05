"use client";
import { useEffect, useState } from "react";
import { Order } from "@/types/Order";
import { io, Socket } from "socket.io-client";
import ModalOrder from "@/components/ModalOrder";

export default function PedidosUsuarios() {
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    //otener los pedidos de todos los usuarios
    async function getPedidos() {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setPedidos(data.orders);
      } else {
        alert("No se pudieron obtener los pedidos");
      }

      setLoading(false);
    }

    getPedidos();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:8080");
    setSocket(socket);

    socket.on("orders", (data: Order[]) => {
      setPedidos(data);
    });
    

    return () => {
      socket?.disconnect();
    };


  }, []);

  return (
    <>
      <h1 className="text-5xl font-semibold font-[family-name:var(--font-geist-mono)]">
        Pedidos
      </h1>

      <div className="border-t-2 border-gray-200 my-6"></div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <ul className="flex flex-wrap justify-center gap-14">
            {pedidos.map((pedido: Order) => (
              <ModalOrder key={pedido.id} order={pedido} />
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
