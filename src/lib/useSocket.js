import { useEffect, useRef } from "react";
import { io as socketIOClient } from "socket.io-client";

export function useSocket(restaurantId, onOrderChange) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Connect to Socket.IO server running on current domain/port
    const socket = socketIOClient(window.location.origin, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      if (restaurantId) {
        socket.emit("join-restaurant", restaurantId);
      }
    });

    socket.on("order-changed", (data) => {
      if (onOrderChange) {
        onOrderChange(data);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [restaurantId]);

  const emitOrderEvent = (data) => {
    if (socketRef.current) {
      socketRef.current.emit("order-event", { ...data, restaurantId });
    }
  };

  return { socket: socketRef.current, emitOrderEvent };
}
