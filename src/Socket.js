import { io } from "socket.io-client"; // ✅ Import io

const SERVER_URL = "https://codenoteb.onrender.com";

export const initSocket = async () => {
    return io(SERVER_URL, {
        forceNew: true,
        reconnectionAttempts: "Infinity",
        timeout: 10000,
        transports: ["websocket"],
    });
};
