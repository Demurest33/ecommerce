"use client";
import { Product } from "@/types/Product";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getProductById } from "@/app/services/productsService";
import notFound from "@/app/not-found";
import { User } from "@/types/User";
import { useUserStore } from "@/app/services/store/userStore";
import { useRouter } from "next/navigation";

interface Params {
  productId: string;
}

export default function ComprarProducto({ params }: { params: Params }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const productData = await getProductById(params.productId);
        setProduct(productData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:8080");
    setSocket(socket);

    socket.on("products", (products: Product[]) => {
      const thisProduct = products.find(
        (p) => p.id === parseInt(params.productId)
      );

      if (thisProduct) {
        setProduct(thisProduct);
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

  const handleBuy = async () => {
    try {
      // Obtener usuario desde la cookie
      const res = await fetch("/api/auth/me"); // Endpoint para obtener el usuario desde la cookie
      if (res.ok) {
        const user: User = await res.json();
        setLoggedUser(user); // Actualiza loggedUser aquí
        setUser(user); // Guardamos el usuario en el estado global

        // Asegúrate de que loggedUser esté definido antes de enviar la solicitud
        // if (!loggedUser || !loggedUser.id) {
        //   console.error("Usuario no encontrado");
        //   alert("Error al realizar la compra, intente de nuevo");
        //   return;
        // }

        // Realizar la petición POST para crear la orden
        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemId: product?.id,
            total: product?.price,
            userId: user.id, // Asegúrate de que loggedUser esté disponible
          }),
        });

        const orderData = await orderRes.json();

        if (orderData.error) {
          console.error(orderData.error);
        } else {
          console.log("Orden creada:", orderData.order);
        }
      } else {
        router.push("/login");
        alert("Debes iniciar sesión para comprar");
        return; // Si no hay sesión, detenemos la ejecución
      }
    } catch (error) {
      console.error("Error creando la orden:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return notFound();
  }

  return (
    <main className="flex max-lg:flex-col gap-2 mt-6">
      <div className="card lg:card-side bg-base-100 shadow-xl flex-1">
        <figure className="max-w-[600px]">
          <img src={product.image} alt="Album" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{product.name}</h2>

          <p>{product.description}</p>

          {product.stock === 0 ? (
            <strong className="text-error">Sin stock</strong>
          ) : (
            <strong className="text-success">En stock</strong>
          )}
          {/* <div className="card-actions justify-end">
            <button className="btn btn-primary">Listen</button>
          </div> */}
        </div>
      </div>

      {/* Otro cuadro de resumen del pedido */}

      <div className="card lg:card-side bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">
            Subtotal <strong>${product.price}</strong>
          </h2>
          <p>Enviaremos tu pedido cuanto antes.</p>
          <div className="card-actions justify-end">
            {product.stock === 0 ? (
              <button className="btn btn-error" disabled>
                Sin stock
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => handleBuy()}>
                Comprar
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
