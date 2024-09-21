import mockData from "../../../mock.json";
import { NextResponse } from "next/server";
import { Product } from "../../../types/Product";

export async function GET() {
  try {
    const products: Product[] = mockData.products;
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener la información de los productos." },
      { status: 500 }
    );
  }
}
