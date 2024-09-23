"use client";
import { Product } from "@/types/Product";
import { useEffect, useState } from "react";
import { getProducts } from "@/app/services/productsService";
import { io, Socket } from "socket.io-client";
import ModalAddProduct from "@/components/products/ModalAddProduct";
import ModalEditProduct from "@/components/products/ModalEditProduct";
import ModalDeleteProduct from "@/components/products/ModalDeleteProduct";

export default function PageProductos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const products = await getProducts();
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:8080");
    setSocket(socket);

    socket.on("products", (products: Product[]) => {
      setProducts(products);
    });

    socket.on("connect", () => {
      console.log("Conectado al servidor de WebSockets");
    });

    socket.on("products", (products: Product[]) => {
      setProducts(products);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1 className="text-5xl font-semibold font-[family-name:var(--font-geist-mono)]">
        Productos
      </h1>

      <div className="flex">
        <div className="stats stats-vertical lg:stats-horizontal shadow max-w-lg w-full my-6">
          <div className="stat">
            <div className="stat-title">Total</div>
            <div className="stat-value">{products?.length}</div>
            <div className="stat-desc">Productos registrados</div>
          </div>
        </div>
      </div>
      <ModalAddProduct />

      <div className="divider"></div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {products.map((product) => (
          <div
            className="card card-side bg-base-100 shadow-xl"
            key={product.id}
          >
            <figure className="max-w-[200px]">
              <img src={product.image} alt={product.name} />
            </figure>
            <div className="card-body">
              {product.stock === 0 ? (
                <h2 className="card-title text-error">
                  {product.name} - Agotado
                </h2>
              ) : (
                <h2 className="card-title">{product.name}</h2>
              )}
              <p>{product.description}</p>
              <div className="card-actions justify-end">
                <ModalEditProduct product={product} />
                <ModalDeleteProduct product={product} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
