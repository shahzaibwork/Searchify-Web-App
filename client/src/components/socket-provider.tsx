import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import io, { Socket } from "socket.io-client";

// Create the socket instance
export const socket = io("http://localhost:3000");

// Define the socket context type
interface SocketContextType {
  socket: Socket;
  isConnected: boolean;
}

// Create context with default values
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Provider component
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Handle connection event
    socket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the Socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
