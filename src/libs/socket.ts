import { Server } from "socket.io";

let io: Server | null = null;

export const initializeWebSocket = (server: any) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*", // Cambia esto si necesitas restricciones de CORS
      },
    });

    io.on("connection", (socket) => {
      console.log("Usuario conectado", socket.id);

      socket.on("disconnect", () => {
        console.log("Usuario desconectado", socket.id);
      });

      // Aquí puedes agregar eventos personalizados, por ejemplo:
      socket.on("mensaje", (msg) => {
        console.log("Mensaje recibido:", msg);
        // Puedes emitir el mensaje a otros clientes conectados
        io?.emit("mensaje", msg);
      });
    });
  }

  return io;
};
