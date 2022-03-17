
import * as http from "http";
import { Server, Socket } from "socket.io";
import RoomController from "./controllers/room.controller";
import GameController from "./controllers/game.controller";
import roomService from "./services/room.service";

export default (httpServer: http.Server) => {

    const io = new Server(httpServer, {
        cors: {
            origin: "*",
        },
    });

    const onConnection = (socket: Socket) => {
        RoomController(io, socket);
        GameController(io, socket);

        socket.on('disconnect', function () {
            roomService.disconnectRoom(socket.id);
        });
    }

    io.on("connection", onConnection);

    return io;
};
