"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { User } from "@/types/User";
import { useUserStore } from "../services/store/userStore";
import { useRouter } from "next/navigation";

export default function Perfil() {
  const setUser = useUserStore((state) => state.setUser);

  const [user, setLoggedUser] = useState<User | null>(null);

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Formulario enviado");
  };

  return (
    <>
      <Navbar />
      <main className="h-screen flex justify-center items-center flex-col ">
        <h1 className="mb-6 font-bold text-6xl">Editar perfil</h1>

        <div className="modal-box">
          <h3 className="text-2xl font-bold">{user?.name}</h3>
          <p className="py-4"></p>

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

            <div className="form-control mt-6">
              <button className="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
