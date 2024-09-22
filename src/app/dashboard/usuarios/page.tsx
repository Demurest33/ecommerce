"use client";
import { getUsers } from "@/app/services/usersSercice";
import { useEffect, useState } from "react";
import { User, Usersdata, Role } from "@/types/User";
import Table from "@/components/users/TableUsers";

export default function PageUsuarios() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<Role>();

  let totalUsers = users?.length + admins?.length;

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersData = await getUsers({ roles: ["ADMIN", "USER"] });
        const { admins, users } = usersData as Usersdata;
        setAdmins(admins);
        setUsers(users);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <>
      <h1 className="text-5xl font-semibold font-[family-name:var(--font-geist-mono)] ">
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
