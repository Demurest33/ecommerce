import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email, password, name, confirmPassword } = await request.json();

  if (!email || !password || !name || !confirmPassword) {
    return NextResponse.redirect(new URL("/register", request.url));
  }

  if (password !== confirmPassword) {
    return NextResponse.redirect(new URL("/register", request.url));
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

  return NextResponse.redirect(new URL("/login", request.url));
}
