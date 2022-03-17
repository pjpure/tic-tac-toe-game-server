import { Server, Socket } from "socket.io";
import gameService from "../services/game.service";

function GameController(io: Server, socket: Socket) {

    const gameStart = (roomId: string) => {
        const room = gameService.gameStart(roomId);
        const player1 = room.players[0];
        const player2 = room.players[1];
        io.to(player1.id).emit("game:start", { player: player1, board: room.board });
        io.to(player2.id).emit("game:start", { player: player2, board: room.board });
    }

    const gameUpdate = ({ roomId, data }: { roomId: string, data: any }) => {
        socket.to(roomId).emit("game:update", data);
    }

    socket.on("game:update", gameUpdate);
}

export default GameController