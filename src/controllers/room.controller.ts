import { Server, Socket } from "socket.io";
import roomService from "../services/room.service";
import gameService from "../services/game.service";
import { rooms } from "../db";

function RoomController(io: Server, socket: Socket) {

    const createRoomId = () => {
        let roomId = new Date().getTime().toString().slice(7, 10) + Math.random().toString().slice(2, 5);
        if (rooms[roomId]) {
            roomId = createRoomId();
        }
        return roomId;
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
            try {
                delete rooms[roomId];
            }
            catch (e) {
                console.log('delete room', e);
            }
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