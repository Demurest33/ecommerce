"use client";
import { getUsers } from "@/app/services/usersSercice";
import { useEffect, useState } from "react";
import { User, Usersdata, Role } from "@/types/User";
import Table from "@/components/users/TableUsers";
import io, { Socket } from "socket.io-client";

export default function PageUsuarios() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [socket, setSocket] = useState<Socket>();
  let totalUsers = users?.length + admins?.length;

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersData = await getUsers({ roles: [Role.ADMIN, Role.USER] });
        const { admins, users } = usersData as Usersdata;
        setAdmins(admins);
        setUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:8080");
    setSocket(socket);

    socket.on("connect", () => {
      console.log("Conectado al servidor de WebSockets");
    });

    //cuando se conecta el cliente, se emite un evento para obtener los usuarios
    socket.on("users", (users: User[]) => {
      const admins = users.filter((user) => user.role === Role.ADMIN);
      const clients = users.filter((user) => user.role === Role.USER);

      setAdmins(admins);
      setUsers(clients);
    });

    // Cleanup al desconectar
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <h1 className="text-5xl font-semibold font-[family-name:var(--font-geist-mono)]">
        Gestión de usuarios
      </h1>

      <div className="flex">
        <div className="stats stats-vertical lg:stats-horizontal shadow max-w-lg w-full my-6">
          <div className="stat">
            <div className="stat-title">Total</div>
            <div className="stat-value">{totalUsers}</div>
            <div className="stat-desc">Usuarios registrados</div>
          </div>

          <div className="stat">
            <div className="stat-title">Clientes</div>
            <div className="stat-value">{users?.length}</div>
            <div className="stat-desc">Clientes de la tienda</div>
          </div>

          <div className="stat">
            <div className="stat-title">Admin</div>
            <div className="stat-value">{admins?.length}</div>
            <div className="stat-desc">Administradores del sistema</div>
          </div>
        </div>
      </div>

      <Table admins={admins} users={users} />
    </>
  );
}
