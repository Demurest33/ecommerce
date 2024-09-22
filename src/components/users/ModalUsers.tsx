"use client";
import { User, Role } from "@/types/User";
import { useEffect, useState } from "react";

export default function ModalUsers({ user }: { user: User }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
  }, [user]);

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

          <form action="http://localhost:3000/api/users" method="POST">
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
                name="username"
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
                name="email"
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
                name="role"
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
