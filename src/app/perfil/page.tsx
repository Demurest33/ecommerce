"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { User } from "@/types/User";
import { useUserStore } from "../services/store/userStore";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { headers } from "next/headers";

export default function Perfil() {
  const [socket, setSocket] = useState<Socket>();
  const setUser = useUserStore((state) => state.setUser);

  const [user, setLoggedUser] = useState<User | null>(null);

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();
  useEffect(() => {
    async function getUserFromCookie() {
      const res = await fetch("/api/auth/me"); // Endpoint para obtener el usuario desde la cookie
      if (res.ok) {
        const user: User = await res.json();
        setUser(user); // Guardamos el usuario en el estado global
        setLoggedUser(user);

        setName(user.name);
        setEmail(user.email);
      } else {
        router.push("/login");
      }
    }

    getUserFromCookie();
  }, [setUser]);

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

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const res = await fetch("/api/users", {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resJson = await res.json();

    if (resJson.error) {
      alert(resJson.error);
    } else {
      if (socket) {
        socket.emit("user-updated", resJson);
      }

      alert("Perfil actualizado correctamente");
    }
  };

  return (
    <>
      <Navbar />
      <main className="h-screen flex justify-center items-center flex-col ">
        <h1 className="mb-6 font-bold text-6xl">Editar perfil</h1>

        <div className="modal-box">
          <h3 className="text-2xl font-bold text-center mb-2">{user?.name}</h3>
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="id" value={user?.id} />
            <div className="form-control">
              <label className="label" htmlFor="name">
                Nombre
              </label>
              <input
                required
                type="text"
                id="name"
                name="name"
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
                name="email"
                className="input input-bordered"
                placeholder="Correo del usuario"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="currentPassword">
                Contraseña actual
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                className="input input-bordered"
                placeholder="Contraseña actual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="newPassword">
                Nueva contraseña
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="input input-bordered"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="confirmPassword">
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="input input-bordered"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="form-control mt-6">
              <button className="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
