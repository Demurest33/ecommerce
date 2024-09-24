import { NextResponse } from "next/server";
import { OrderStatus } from "@/types/Order";
import { PrismaClient } from "@prisma/client";
import { io, Socket } from "socket.io-client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      // Devuelve todos los pedidos si no hay un userId
      const orders = await prisma.order.findMany();
      return NextResponse.json({ orders });
    }

    // Si hay un userId, devuelve solo los pedidos de ese usuario
    const userOrders = await prisma.order.findMany({
      where: {
        userId: parseInt(userId),
      },
    });

    return NextResponse.json({ orders: userOrders });
  } catch (error) {
    return NextResponse.json(
      { error: "Error getting orders" },
      { status: 500 }
    );
  }
}

//create a new order
export async function POST(request: Request) {
  // ws
  const socket = io("http://localhost:8080");

  if (!socket) {
    return NextResponse.json(
      {
        error: "Error connecting to server",
      },
      { status: 500 }
    );
  }

  let { itemId, total, userId } = await request.json();

  try {
    userId = parseInt(userId);
    total = parseFloat(total);
    itemId = parseInt(itemId);

    if (isNaN(userId) || isNaN(total) || isNaN(itemId)) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }

    if (!itemId || !total || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const orderObj = await prisma.order.create({
      data: {
        userId,
        total,
        status: OrderStatus.PENDING,
        itemId,
      },
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    //quitar 1 del stock del producto
    const product = await prisma.product.findUnique({ where: { id: itemId } });

    if (product && product.stock === 0) {
      return NextResponse.json(
        { error: "Product out of stock" },
        { status: 400 }
      );
    }

    if (product) {
      const updatedProduct = await prisma.product.update({
        where: { id: itemId },
        data: {
          stock: product.stock - 1,
        },
      });

      if (!updatedProduct) {
        return NextResponse.json(
          { error: "Error updating product" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ message: "Order created", order: orderObj });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error creating order",
      },
      { status: 500 }
    );
  } finally {
    socket.emit("product-updated");
    socket.disconnect();
  }
}
