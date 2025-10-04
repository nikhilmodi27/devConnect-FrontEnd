import { io } from "socket.io-client";
import { API_URL } from "./constants";

export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    return io(API_URL);
  } else {
    return io("/", { path: "/api/socket.io" });
  }
};
