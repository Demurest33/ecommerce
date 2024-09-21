import { Product } from "../../types/Product";

export async function getProducts(): Promise<Product[]> {
  //Se deberia usar un .env para la url de la api y no tenerla hardcodeada por seguridad
  const res = await fetch(`http://localhost:3000/api/products`, {
    cache: "no-store", // Deshabilita el cache para obtener siempre la info más reciente
  });

  if (!res.ok) {
    throw new Error("Error al obtener los productos");
  }

  const products: Product[] = await res.json();
  return products;
}

export async function getProductById(id: string): Promise<Product> {
  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const product: Product = await res.json();
  return product;
}
