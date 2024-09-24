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
  const { id, name, email, role } = await request.json();

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

      // const url = new URL("/dashboard/usuarios", request.url);

      // return NextResponse.redirect(url);

      return NextResponse.json(user, { status: 200 });
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

    return NextResponse.json(
      { message: "Usuario eliminado exitosamente." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error al eliminar el usuario." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  let { id, name, email, currentPassword, newPassword, confirmPassword } =
    await request.json();

  // validar que el id sea un numero

  id = parseInt(id);

  if (isNaN(id)) {
    return NextResponse.json(
      { error: "El ID debe ser un número." },
      { status: 400 }
    );
  }

  if (currentPassword && newPassword && confirmPassword) {
    // Comprobar que la contraseña actual es correcta
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (user?.password !== currentPassword) {
      return NextResponse.json(
        { error: "La contraseña actual no es correcta." },
        { status: 400 }
      );
    }

    // Comprobar que las contraseñas nuevas coinciden
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Las contraseñas no coinciden." },
        { status: 400 }
      );
    }

    // Actualizar todo el usuario junto con la contraseña

    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          name,
          email,
          password: newPassword,
        },
      });

      return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: "Error al actualizar el usuario1." },
        { status: 500 }
      );
    }
  } else {
    // Actualizar solo los datos del usuario
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          name,
          email,
        },
      });

      let response = NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: "Error al actualizar el usuario2." },
        { status: 500 }
      );
    }
  }
}
