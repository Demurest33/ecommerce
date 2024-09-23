"use client";
import { User } from "@/types/User";
import { redirect } from "next/navigation";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

export default function ModalDeleteUser({ user }: { user: User }) {
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

  const borarUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: user.id }),
    });

    if (socket) {
      socket.emit("user-updated", user);
    }
  };

  return (
    <>
      <label
        htmlFor={"deletemodal" + user.id}
        className="btn btn-sm btn-error text-white"
      >
        Eliminar
      </label>

      <input
        type="checkbox"
        id={"deletemodal" + user.id}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-2xl font-bold">Eliminar usuario {user.name}</h3>
          <p className="py-4">¿Estás seguro de eliminar este usuario?</p>

          <form onSubmit={borarUsuario}>
            <input type="hidden" name="id" value={user.id} />

            <div className="form-control mt-2 flex flex-row justify-evenly w-1/2">
              <label
                htmlFor={"deletemodal" + user.id}
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
        <label className="modal-backdrop" htmlFor={"deletemodal" + user.id}>
          Close
        </label>
      </div>
    </>
  );
}
