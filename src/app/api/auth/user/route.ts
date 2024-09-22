import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const userCookie = request.headers
    .get("cookie")
    ?.split("; ")
    .find((row) => row.startsWith("user="));

  if (!userCookie) {
    return NextResponse.json(null);
  }

  const user = JSON.parse(decodeURIComponent(userCookie.split("=")[1]));
  return NextResponse.json(user);
}
