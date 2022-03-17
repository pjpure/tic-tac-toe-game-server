import { Server, Socket } from "socket.io";
import gameService from "../services/game.service";

function GameController(io: Server, socket: Socket) {

    const gameUpdate = ({ roomId, idx }: { roomId: string, idx: number }) => {
        console.log(`gameUpdate: ${roomId} ${idx}`);
        const room = gameService.gameUpdate(roomId, socket.id, idx);
        if (room == -1) {
            return;
        }
        const player1 = room.players[0];
        const player2 = room.players[1];
        io.to(player1.id).emit("game:updated", { player: player1, board: room.board });
        io.to(player2.id).emit("game:updated", { player: player2, board: room.board });
    }
    socket.on("game:update", gameUpdate);
}

export default GameController