import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email, password, name, confirmPassword } = await request.json();

  if (!email || !password || !name || !confirmPassword) {
    return NextResponse.json({ error: "Todos los campos son requeridos" });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Las contraseñas no coinciden" });
  }

  //verificar si el usuario ya existe
  const userExists = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (userExists) {
    return redirect("/register?error=userexists");
  }

  // Crear un nuevo usuario
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password,
      role: "USER",
    },
  });

  if (user) {
    return NextResponse.json(user);
  } else {
    return NextResponse.json({ error: "Error al registrar el usuario" });
  }
}
