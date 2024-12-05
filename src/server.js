const io = require("socket.io")(8080, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

io.on("connection", async (socket) => {
  console.log("User connected");

  //cuando se actualiza un usuario se obtienen todos los usuarios y se emiten a todos los clientes
  socket.on("user-updated", async () => {
    //obtener todos los usuarios
    const users = await prisma.user.findMany();
    // Emitir la lista de usuarios a todos los clientes conectados
    io.emit("users", users);
  });

  socket.on("product-updated", async () => {
    //obtener todos los productos
    const products = await prisma.product.findMany();
    // Emitir la lista de productos a todos los clientes conectados
    io.emit("products", products);
  });

  socket.on("order-updated", async () => {
    console.log("order-updated");
    const orders = await prisma.order.findMany();
    io.emit("orders", orders);
  });

  socket.on("disconnect", (socket) => {
    console.log("User disconnected");
  });
});

console.log("Server started on http://localhost:8080");
