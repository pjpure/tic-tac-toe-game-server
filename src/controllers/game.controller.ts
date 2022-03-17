import { Server, Socket } from "socket.io";
import gameService from "../services/game.service";

function GameController(io: Server, socket: Socket) {

    const gameUpdate = ({ roomId, idx }: { roomId: string, idx: number }) => {
        const room = gameService.gameUpdate(roomId, socket.id, idx);
        if (room == -1) {
            return;
        }
        io.in(roomId).emit("game:updated", roomId, room);
    }
    socket.on("game:update", gameUpdate);
}

export default GameController