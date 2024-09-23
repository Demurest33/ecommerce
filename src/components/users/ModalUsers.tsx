"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { User, Role } from "@/types/User";
import { Socket } from "socket.io-client";

interface ModalUsersProps {
  user: User;
}

export default function ModalUsers({ user }: ModalUsersProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedUser = {
      id: user.id,
      name,
      email,
      role,
    };

    // Hacer la solicitud HTTP para actualizar el usuario en el servidor
    const res = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });

    if (socket) {
      socket.emit("user-updated", updatedUser);
    }
  };

  return (
    <>
      <label htmlFor={"modal" + user.id} className="btn btn-sm btn-primary">
        Editar
      </label>

      <input type="checkbox" id={"modal" + user.id} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-2xl font-bold">{user.name}</h3>
          <p className="py-4">Edición de usuario</p>

          <form onSubmit={handleSubmit}>
            <input type="hidden" name="id" value={user.id} />
            <div className="form-control">
              <label className="label" htmlFor="name">
                Nombre
              </label>
              <input
                required
                type="text"
                id="name"
                className="input input-bordered"
                placeholder="Nombre del usuario"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="email">
                Correo
              </label>
              <input
                required
                type="email"
                id="email"
                className="input input-bordered"
                placeholder="Correo del usuario"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="role">
                Rol
              </label>
              <select
                required
                id="role"
                className="select select-bordered"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
              >
                <option value={Role.ADMIN}>Admin</option>
                <option value={Role.USER}>User</option>
              </select>
            </div>

            <div className="form-control mt-6">
              <button className="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
        <label className="modal-backdrop" htmlFor={"modal" + user.id}>
          Close
        </label>
      </div>
    </>
  );
}
