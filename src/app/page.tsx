"use client";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import { getProducts } from "./services/productsService";
import { Product } from "../types/Product";
import { useState, useEffect } from "react";
import ProductComponent from "@/components/Product";
import useSocket from "@/app/services/useSocket";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  // WebSocket
  const socket = useSocket();
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    if (socket) {
      socket.on("mensaje", (msg) => {
        console.log("Mensaje recibido del servidor:" + msg);
      });
    }

    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />

      <SearchBar />

      <main className="p-8">
        <h1 className="text-3xl mb-10 ml-4">Productos</h1>
        <ul className="flex gap-4 flex-wrap justify-center">
          {products.map((product) => (
            <li key={product.id}>
              <ProductComponent product={product} />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
