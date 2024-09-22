import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { serialize } from "cookie"; // Para crear cookies

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  if (!email || !password) {
    return redirect("/login?error=fieldsrequired");
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
      password,
    },
  });

  if (!user) {
    return redirect("/login?error=invalidcredentials");
  }

  // funiona bien la respuesta
  // {
  //   "id": 1,
  //   "email": "202160023@ucc.mx",
  //   "password": "123",
  //   "name": "Javier Jara Renteria",
  //   "role": "USER",
  //   "createdAt": "2024-09-22T03:26:29.476Z",
  //   "updatedAt": "2024-09-22T03:26:29.476Z"
  // }
  // return NextResponse.json(user);

  const url =
    user.role === "ADMIN"
      ? new URL("/dashboard", request.url)
      : new URL("/", request.url);

  const response = NextResponse.redirect(url);

  // Crear cookie con la información del usuario

  response.headers.set(
    "Set-Cookie",
    serialize(
      "user",
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }),
      {
        httpOnly: true, // Solo accesible por el servidor
        maxAge: 60 * 60 * 24 * 7, // 1 semana
        path: "/",
      }
    )
  );

  return response;
}
