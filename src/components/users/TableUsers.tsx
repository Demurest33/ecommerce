"use client";

import { useEffect, useState } from "react";
import { User, Role } from "@/types/User";
import ModalUsers from "./ModalUsers";
import ModalDeleteUser from "./ModalDelete";
import { Socket } from "socket.io-client";

interface TableProps {
  admins: User[];
  users: User[];
}

export default function Table({ admins, users }: TableProps) {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<Role | undefined>(undefined);

  useEffect(() => {
    let tempFilteredUsers: User[] = [];

    if (filter === Role.ADMIN) {
      tempFilteredUsers = [
        ...tempFilteredUsers,
        ...admins.filter((user) => user.role === Role.ADMIN),
      ];
    }

    if (filter === Role.USER) {
      tempFilteredUsers = [
        ...tempFilteredUsers,
        ...users.filter((user) => user.role === Role.USER),
      ];
    }

    if (filter === undefined) {
      tempFilteredUsers = [...admins, ...users];
    }

    setFilteredUsers(tempFilteredUsers);
  }, [admins, users, filter]);

  return (
    <>
      <div className="dropdown dropdown-top dropdown-end">
        <div tabIndex={0} role="button" className="btn m-1">
          Filtrar usuarios por rol
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <li>
            <a onClick={() => setFilter(Role.ADMIN)}>Admin</a>
          </li>
          <li>
            <a onClick={() => setFilter(Role.USER)}>User</a>
          </li>
          <li>
            <a onClick={() => setFilter(undefined)}>Todos</a>
          </li>
        </ul>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Nombe</th>
              <th>Correo</th>
              <th>Fecha de Creación</th>
              <th>Fecha de Edición</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* START ROW */}
            {filteredUsers?.map((user) => (
              <tr key={user.id}>
                <td>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        {/* <img
                      src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                      alt="Avatar Tailwind CSS Component"
                    /> */}

                        <svg
                          className="w-full h-full text-base-content"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-sm opacity-50">{user.role}</div>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.createdAt.toLocaleString().split("T")[0]}</td>
                <td>{user.updatedAt.toLocaleString().split("T")[0]}</td>
                <td>
                  <div className="flex gap-2">
                    <ModalUsers user={user} />
                    <ModalDeleteUser user={user} />
                  </div>
                </td>
              </tr>
            ))}
            {/* END ROW */}
          </tbody>
          {/* foot */}
          <tfoot></tfoot>
        </table>
      </div>
    </>
  );
}
