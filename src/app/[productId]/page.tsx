"use client";
import { notFound } from "next/navigation";
import { getProductById } from "../services/productsService";
import { useEffect, useState } from "react";
import { Product } from "../../types/Product";
import DetailProduct from "@/components/DetailProduct";

interface Params {
  productId: string;
}

export default function Page({ params }: { params: Params }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  if (error) {
    return notFound();
  }

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  return <DetailProduct product={product!} />;
}
