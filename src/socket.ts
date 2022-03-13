
import * as http from "http";
import { Server, Socket } from "socket.io";
import RoomController from "./controllers/room.controller";

export default (httpServer: http.Server) => {

    const io = new Server(httpServer, {
        cors: {
            origin: "*",
        },
    });

    const onConnection = (socket: Socket) => {
        RoomController(io, socket);
    }

    io.on("connection", onConnection);

    return io;
};
