"use client";
import { useEffect, useState } from "react";
import { Order } from "@/types/Order";
import { useRouter } from "next/navigation";
import { User } from "@/types/User";
import { useUserStore } from "@/app/services/store/userStore";
import { io, Socket } from "socket.io-client";
import { Product } from "@/types/Product";
import { getProductById } from "@/app/services/productsService";
import notFound from "@/app/not-found";

interface Params {
  orderId: string;
}

export default function MisPedidos({ params }: { params: Params }) {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const res = await fetch("/api/auth/me"); // Endpoint para obtener el usuario desde la cookie
      if (res.ok) {
        const user: User = await res.json();
        setUser(user); // Guardamos el usuario en el estado global
        setLoggedUser(user);

        try {
          const response = await fetch(`/api/orders/${params.orderId}`);
          const data = await response.json();

          if (response.ok) {
            setOrder(data);

            const productData = await getProductById(data.itemId);
            setProduct(productData);
          } else {
            alert("No se pudo obtener el producto");
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
        alert("Debes iniciar sesión para comprar");
      }
    }

    getUser();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:8080");
    setSocket(socket);

    socket.on("orders", (orders: Order[]) => {

      console.log(orders, params.orderId);
      const thisOrder = orders.find((o) => o.id === parseInt(params.orderId));

      if (thisOrder) {
        setOrder(thisOrder);
      } else {
        return notFound();
      }
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="card lg:card-side bg-base-100 shadow-xl flex-1 max-h-[600px] m-6 border-t-2">
          <figure className="max-w-[600px]">
            <img src={product?.image} alt="Album" />
          </figure>
          <div className="card-body p-8 border-2">
            <div className="">
              <div className="flex ">
                <h1 className="card-title">
                  Monto:{" "}
                  <strong className="text-primary">${order?.total}</strong>
                </h1>
              </div>
              Estado:{" "}
              <span className="indicator-item badge badge-secondary">
                {" "}
                <p>
                  <strong>{order?.status}</strong>
                </p>
              </span>
              <div className="flex justify-between">
                <p>
                  Fecha:{" "}
                  <strong>{order?.createdAt.toString().split("T")[0]}</strong>
                </p>
              </div>
            </div>
            <h2 className="card-title">{product?.name}</h2>

            <p>{product?.description}</p>
          </div>
        </div>
      )}
    </>
  );
}
