import mockData from "../../../../mock.json";
import { NextResponse } from "next/server";
import { Product } from "@/types/Product";

export async function GET(
  request: Request,
  { params }: { params: { productId: string } } //los parámetros de la URL siempre se representan como strings por defecto.
) {
  try {
    // Validamos que sea un número
    if (isNaN(parseInt(params.productId))) {
      return NextResponse.json(
        { message: "Id de producto no valida" },
        { status: 400 }
      );
    }

    const product = mockData.products.find(
      (product: Product) => product.id === parseInt(params.productId)
    );
    if (!product) {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    // Si ocurre un error (por ejemplo, los datos no están disponibles o la API no responde)
    return NextResponse.json(
      { message: "Error al obtener la información de los productos." },
      { status: 500 }
    );
  }
}
