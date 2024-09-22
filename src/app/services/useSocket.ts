import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8080"); // URL de tu servidor WebSocket
    setSocket(newSocket);

    // Limpieza cuando el componente se desmonta
    return () => {
      newSocket.close();
    };
  }, []);

  return socket;
};

export default useSocket;
