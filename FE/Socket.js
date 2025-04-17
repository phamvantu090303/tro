import { io } from "socket.io-client";

let socket;

export const connectSocket = (token) => {
  const socketOptions = {
    transports: ["websocket"],
  };

  if (typeof token === "string" && token.trim() !== "") {
    socketOptions.auth = {
      Authorization: token,
    };
  }

  socket = io("http://localhost:5000", socketOptions);

  return socket;
};

export const getSocket = () => socket;
