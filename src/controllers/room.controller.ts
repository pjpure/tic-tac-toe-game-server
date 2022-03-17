import { Server, Socket } from "socket.io";
import roomService from "../services/room.service";
import gameService from "../services/game.service";
import { rooms } from "../db";

function RoomController(io: Server, socket: Socket) {
    const createRoomId = () => {
        return new Date().getTime().toString(36).slice(5, 8) + Math.random().toString(36).slice(2, 5);
    }

    const createRoom = (playerName: string, boardSize: number) => {
        const roomId = createRoomId();
        const player = roomService.createPlayer(socket.id, playerName, roomId);
        const room = roomService.createRoom(player, boardSize, roomId);
        socket.join(roomId);
        socket.emit("room:created", roomId, room);
    }

    const joinRoom = async ({ playerName, roomId }: { playerName: string, roomId: string }) => {
        const clients = io.sockets.adapter.rooms.get(roomId);
        const numClients = clients ? clients.size : 0;

        if (numClients <= 0) {
            socket.emit("room:notFound");
        } else if (numClients == 1) {
            const player = roomService.createPlayer(socket.id, playerName, roomId);
            roomService.joinRoom(roomId, player);
            socket.join(roomId);
            const room = gameService.gameStart(roomId);
            socket.emit("room:joined", roomId, room);
            io.in(roomId).emit("game:start", roomId, room);
        } else {
            socket.emit("room:full");
        }
    }

    const leaveRoom = ({ playerName, roomId }: { playerName: string, roomId: string }) => {
        const clients = io.sockets.adapter.rooms.get(roomId);
        const numClients = clients ? clients.size : 0;
        if (numClients <= 1) {
            delete rooms[roomId];
        } else {
            roomService.leaveRoom(roomId, socket.id);
            socket.leave(roomId);
            io.to(roomId).emit("game:wait");
        }

    }

    socket.on("room:create", createRoom);
    socket.on("room:join", joinRoom);
    socket.on("room:leave", leaveRoom);
}

export default RoomController