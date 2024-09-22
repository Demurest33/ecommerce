import { NextResponse } from "next/server";

export async function POST() {
  // Borra la cookie del usuario
  const response = NextResponse.redirect(
    new URL("/login", "http://localhost:3000")
  ); // Redirige al login
  response.cookies.set("user", "", { maxAge: 0 }); // Elimina la cookie de sesión

  return response;
}
