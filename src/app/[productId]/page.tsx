"use client";
import { notFound } from "next/navigation";
import { getProductById } from "../services/productsService";
import { useEffect, useState } from "react";
import { Product } from "../../types/Product";
import DetailProduct from "@/components/DetailProduct";
import { io, Socket } from "socket.io-client";

interface Params {
  productId: string;
}

export default function Page({ params }: { params: Params }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const productData = await getProductById(params.productId);
        setProduct(productData);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params.productId]);

  useEffect(() => {
    const socket = io("http://localhost:8080");
    setSocket(socket);

    socket.on("connect", () => {
      console.log("Conectado al servidor de WebSockets");
    });

    socket.on("products", (products: Product[]) => {
      const product = products.find(
        (product) => product.id === Number(params.productId)
      );
      if (product) {
        setProduct(product);
      } else {
        alert("Producto no encontrado");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [params.productId]);

  if (error) {
    return notFound();
  }

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  return <DetailProduct product={product!} />;
}
