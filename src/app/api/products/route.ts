import { NextResponse } from "next/server";
import { Product } from "../../../types/Product";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products: Product[] = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener la información de los productos." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { id, name, price, description, stock, image } = await request.json();

  try {
    if (id) {
      const product = await prisma.product.update({
        where: { id },
        data: {
          name,
          price,
          description,
          stock,
          image,
        },
      });

      return NextResponse.json(product, { status: 200 });
    } else {
      const product = await prisma.product.create({
        data: {
          name,
          price,
          description,
          stock,
          image,
        },
      });

      return NextResponse.json(product, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error al crear el producto." },
      { status: 500 }
    );
  }
}
