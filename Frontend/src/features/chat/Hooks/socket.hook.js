import { initialSocketConnection } from "../services/chat.socket";
import { useEffect, useState } from "react";

export const useSocket = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketInstance = initialSocketConnection();
        setSocket(socketInstance);

        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
            }
        };
    }, []);

    return socket;
}
