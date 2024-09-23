"use client";

import { Product } from "@/types/Product";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getProductById } from "@/app/services/productsService";
import notFound from "@/app/not-found";

interface Params {
  productId: string;
}

export default function ComprarProducto({ params }: { params: Params }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

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
  }, [params.productId]);

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

          <p>
            {product.description} - {product.price}€
          </p>

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
            <button className="btn btn-primary">Comprar</button>
          </div>
        </div>
      </div>
    </main>
  );
}
