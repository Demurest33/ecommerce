"use client";
import { useState, useEffect } from "react";
import { Order, OrderStatus } from "@/types/Order";
import { Socket, io } from "socket.io-client";

export default function ModalOrder({ order }: { order: Order }) {
  const [status, setStatus] = useState(order.status); // Estado local para el status
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socket = io("http://localhost:8080");

    setSocket(socket);
    socket.on("connect", () => {
      console.log("Conectado al servidor de WebSockets");
    });

    

    socket.on("orders", (orders: Order[]) => {
      const updatedOrder = orders.find((o) => o.id === order.id);
      if (updatedOrder) {
        order = updatedOrder;
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleStatusChange = async () => {
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        console.log("Order updated:", updatedOrder);
        socket?.emit("order-updated", updatedOrder);
      } else {
        console.error("Error updating order:", await response.json());
      }
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  return (
    <>
      {/* Hidden checkbox to control the modal */}
      <input
        type="checkbox"
        id={"orderModal" + order.id}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">
            Actualiza el estatus de este pedido
          </h3>
          <div className="py-4">
            <label htmlFor="status">Selecciona el nuevo estatus:</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="select select-bordered w-full max-w-xs"
            >
              <option value={OrderStatus.PENDING}>Pendiente</option>
              <option value={OrderStatus.ONGOING}>En progreso</option>
              <option value={OrderStatus.COMPLETED}>Completado</option>
            </select>
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={handleStatusChange}>
              Actualizar
            </button>
            <label className="btn" htmlFor={"orderModal" + order.id}>
              Cerrar
            </label>
          </div>
        </div>
      </div>

      <label
        htmlFor={"orderModal" + order.id}
        className="stats shadow-xl hover:cursor-pointer"
      >
        <div className="stat">
          <div className="stat-title">{order.status}</div>
          <div className="stat-value">${order.total}</div>
          <div className="stat-desc">
            Pedido realizado:{" "}
            <strong>{order.createdAt.toString().split("T")[0]}</strong>
          </div>
        </div>
      </label>
    </>
  );
}
