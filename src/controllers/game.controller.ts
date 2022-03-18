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

    const gameGiveUp = ({ roomId }: { roomId: string }) => {
        const room = gameService.gameGiveUp(roomId, socket.id);
        if (room == -1) {
            return;
        }
        io.in(roomId).emit("game:updated", roomId, room);
    }

    const gamePlayAgain = ({ roomId }: { roomId: string }) => {
        const room = gameService.gamePlayAgain(roomId, socket.id);
        if (room == -1) {
            return;
        }
        if (room.status === "waiting") {
            io.to(socket.id).emit("game:updated", roomId, room);
        } else {
            io.in(roomId).emit("game:updated", roomId, room);
        }
    }
    socket.on("game:update", gameUpdate);
    socket.on("game:giveUp", gameGiveUp);
    socket.on("game:playAgain", gamePlayAgain);
}

export default GameController