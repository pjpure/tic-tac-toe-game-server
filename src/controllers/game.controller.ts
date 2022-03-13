import { Server, Socket } from "socket.io";

function GameController(io: Server, socket: Socket) {

    const gameUpdate = ({ roomId, data }: { roomId: string, data: any }) => {
        socket.to(roomId).emit("game:update", data);
    }



    socket.on("game:update", gameUpdate);
}

export default GameController