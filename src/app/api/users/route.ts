import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roles = searchParams.getAll("role");

    let users;

    // Si se especifican roles en la query, filtramos por esos roles
    if (roles.length > 0) {
      if (roles.includes("ADMIN") && roles.includes("USER")) {
        // Si ambos roles están presentes, devolver 2 arreglos separados
        const admins = await prisma.user.findMany({
          where: { role: "ADMIN" },
        });

        const users = await prisma.user.findMany({
          where: { role: "USER" },
        });

        return NextResponse.json({ admins, users });
      } else {
        // Filtramos por un solo rol si solo uno está presente
        users = await prisma.user.findMany({
          where: {
            role: {
              in: roles,
            },
          },
        });
      }
    } else {
      // Si no hay roles especificados, devolver todos los usuarios
      users = await prisma.user.findMany();
    }

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener la información de los usuarios." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get("username")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const role = formData.get("role")?.toString() || "";
  const id = parseInt(formData.get("id")?.toString() || ""); //se nos podria rompert todo si nos pasan

  try {
    if (id) {
      const user = await prisma.user.update({
        where: { id },
        data: {
          name,
          email,
          role,
        },
      });

      const url = new URL("/dashboard/usuarios", request.url);

      return NextResponse.redirect(url);
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error al crear el usuario." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    await prisma.user.delete({
      where: { id },
    });

    const url = new URL("/dashboard/usuarios", request.url);

    return NextResponse.redirect(url);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al eliminar el usuario." },
      { status: 500 }
    );
  }
}
