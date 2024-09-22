import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { User } from "@/types/User";

export async function GET() {
  const cookieStore = cookies();
  const userCookie = cookieStore.get("user");

  if (!userCookie) {
    return NextResponse.json(
      { message: "No hay usuario autenticado" },
      { status: 401 }
    );
  }

  const user: User = JSON.parse(userCookie.value);
  return NextResponse.json(user);
}
