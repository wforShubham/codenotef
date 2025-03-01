import { io } from "socket.io-client"; // ✅ Import io

const SERVER_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export const initSocket = async () => {
    return io(SERVER_URL, {
        forceNew: true,
        reconnectionAttempts: "Infinity",
        timeout: 10000,
        transports: ["websocket"],
    });
};
