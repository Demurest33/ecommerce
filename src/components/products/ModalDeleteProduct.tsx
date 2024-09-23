"use client";
import { Product } from "@/types/Product";
import { redirect } from "next/navigation";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

export default function ModalDeleteProduct({ product }: { product: Product }) {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socket = io("http://localhost:8080");
    setSocket(socket);

    socket.on("connect", () => {
      console.log("Conectado al servidor de WebSockets");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:3000/api/products/${product.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: product.id }),
      }
    );

    if (socket) {
      socket.emit("product-updated", product);
    }
  };

  return (
    <>
      <label
        htmlFor={"deletemodal" + product.id}
        className="btn btn-sm btn-error text-white"
      >
        Eliminar
      </label>

      <input
        type="checkbox"
        id={"deletemodal" + product.id}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-2xl font-bold">
            Eliminar usuario {product.name}
          </h3>
          <p className="py-4">¿Estás seguro de eliminar este producto?</p>

          <form onSubmit={handle}>
            <input type="hidden" name="id" value={product.id} />

            <div className="form-control mt-2 flex flex-row justify-evenly w-1/2">
              <label
                htmlFor={"deletemodal" + product.id}
                className="btn btn-md btn-primary "
              >
                Cancelar
              </label>

              <button className="btn btn-md btn-error text-white">
                Eliminar
              </button>
            </div>
          </form>
        </div>
        <label className="modal-backdrop" htmlFor={"deletemodal" + product.id}>
          Close
        </label>
      </div>
    </>
  );
}
