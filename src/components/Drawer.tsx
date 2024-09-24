"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/services/store/userStore";

export default function Drawer() {
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });
    if (res.ok) {
      clearUser();

      router.push("/login");
    }
  };

  return (
    <div className="drawer lg:drawer-open lg:flex lg:flex-1 z-50">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <div className="drawer lg:hidden">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col">
            {/* Navbar */}
            <div className="navbar bg-base-300 w-full">
              <div className="flex-none lg:hidden">
                <label
                  htmlFor="my-drawer-3"
                  aria-label="open sidebar"
                  className="btn btn-square btn-ghost"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block h-6 w-6 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </label>
              </div>
              <div className="mx-2 flex-1 px-2">TiendaCalazans</div>
              <div className="hidden flex-none lg:block">
                <ul className="menu menu-horizontal">
                  {/* Navbar menu content here */}
                  <li>
                    <button onClick={() => handleLogout()}>
                      Cerrar sesión
                    </button>
                  </li>
                  <li>
                    <a>Navbar Item 2</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-3"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu bg-base-200 min-h-full w-80 p-4 gap-2">
              <li className="border-2 rounded-md bg-slate-700 text-white">
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li className="border-2 rounded-md bg-base-300">
                <Link href="/dashboard/usuarios">Usuarios</Link>
              </li>

              <li className="border-2 rounded-md bg-base-300">
                <Link href="/dashboard/productos">Productos</Link>
              </li>

              <li className="border-2 rounded-md bg-base-300">
            <Link href="/dashboard/pedidos">Pedidos</Link>
          </li>

          <li className="border-2 rounded-md bg-base-300">
            <Link href="/">Página principal</Link>
          </li>

              <li className="bg-red-100 hover:bg-red-200 rounded-md">
                <button onClick={() => handleLogout()}>Cerrar sesión</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 gap-2">
          <li className="border-2 rounded-md bg-slate-700 text-white">
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li className="border-2 rounded-md bg-base-300">
            <Link href="/dashboard/usuarios">Usuarios</Link>
          </li>

          <li className="border-2 rounded-md bg-base-300">
            <Link href="/dashboard/productos">Productos</Link>
          </li>

          <li className="border-2 rounded-md bg-base-300">
            <Link href="/dashboard/pedidos">Pedidos</Link>
          </li>

          <li className="border-2 rounded-md bg-base-300">
            <Link href="/">Página principal</Link>
          </li>

          <li className="bg-red-100 hover:bg-red-200 rounded-md">
            <button onClick={() => handleLogout()}>Cerrar sesión</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
