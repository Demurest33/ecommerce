import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let io: Server;

export default function setupSocket(server: any) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*", // Define los orígenes permitidos según tus necesidades
      },
    });

    io.on("connection", (socket) => {
      console.log("Usuario conectado: ", socket.id);

      socket.on("disconnect", () => {
        console.log("Usuario desconectado: ", socket.id);
      });
    });
  }
  return io;
}

// Llama esta función cuando los usuarios cambian
export async function notifyUsersChange() {
  const users = await prisma.user.findMany();
  io.emit("usersUpdated", users); // Emite el evento a todos los administradores conectados
}

console.log("Socket inicializado en el servidor");
