import { Server, Socket } from "socket.io";

function RoomController(io: Server, socket: Socket) {
    const createRoomId = () => {
        return new Date().getTime().toString(36).slice(5, 8) + Math.random().toString(36).slice(2, 5);
    }

    const createRoom = (playerName: string) => {
        const roomId = createRoomId();
        console.log(`${playerName} created room ${roomId}`);
        socket.join(roomId);
        socket.emit("room:created", roomId);
    }

    const joinRoom = async ({ playerName, roomId }: { playerName: string, roomId: string }) => {
        const clients = io.sockets.adapter.rooms.get(roomId);
        const numClients = clients ? clients.size : 0;

        if (numClients <= 0) {
            socket.emit("room:notFound");
            console.log(`${playerName} tried to join room ${roomId} but it doesn't exist`);
        } else if (numClients <= 1) {
            socket.join(roomId);
            socket.emit("room:joined", roomId)
            console.log(`${playerName} joined room ${roomId}`);
        } else {
            socket.emit("room:full");
            console.log(`${playerName} tried to join room ${roomId} but it was full`);
        }
    }

    const leaveRoom = ({ playerName, roomId }: { playerName: string, roomId: string }) => {
        console.log(`${playerName} left room ${roomId}`);
        socket.leave(roomId);
    }

    socket.on("room:create", createRoom);
    socket.on("room:join", joinRoom);
    socket.on("room:leave", leaveRoom);
}

export default RoomController