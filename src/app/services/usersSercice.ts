import { User, Usersdata, Role } from "@/types/User";

interface UserServiceOptions {
  roles?: Role[];
}

export async function getUsers(
  options?: UserServiceOptions
): Promise<User[] | Usersdata> {
  const { roles } = options || {};
  let url = `http://localhost:3000/api/users`;

  // Si se pasan roles, añadimos los parámetros de consulta a la URL
  if (roles && roles.length > 0) {
    const queryParams = roles.map((role) => `role=${role}`).join("&");
    url = `${url}?${queryParams}`;
  }

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error al obtener los usuarios");
  }

  if (roles && roles.length > 0) {
    const users: Usersdata = await res.json();
    return users;
  }

  const users: User[] = await res.json();
  return users;
}
