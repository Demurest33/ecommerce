import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
const prisma = new PrismaClient();

export async function POST(request: Request) {
  // Leer el cuerpo de la solicitud como URL-encoded
  const formData = await request.formData();
  const name = formData.get("username")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const confirmPassword = formData.get("confirm-password")?.toString() || "";

  if (!email || !password || !name || !confirmPassword) {
    return redirect("/register?error=fieldsrequired");
  }

  if (password !== confirmPassword) {
    return redirect("/register?error=passwordmismatch");
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

  redirect("/login?success=registered");
}
