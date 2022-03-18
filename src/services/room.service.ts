import { rooms, players } from "../db";
import { Player, Room } from "../models/game.model";
import gameService from "./game.service";

const createPlayer = (id: string, name: string, roomId: string) => {
    const player: Player = {
        id,
        roomId,
        name,
        symbol: "",
        isTurn: false,
        status: ""
    };
    players[id] = player;
    return player;
}



const createRoom = (player: Player, boardSize: number, roomId: string) => {
    rooms[roomId] = {
        players: [player],
        boardSize: boardSize,
        board: [],
        status: "waiting"
    };
    return rooms[roomId];
}

const joinRoom = (roomId: string, player: Player) => {
    try {
        rooms[roomId].players.push(player);
    } catch (e) {
        console.log('joinRoom', e);
    }

}

const leaveRoom = (roomId: string, playerId: string) => {
    try {
        const players = rooms[roomId].players
        if (players) {
            const index = players.findIndex((p: Player) => p.id === playerId);
            if (index !== -1) {
                rooms[roomId].players.splice(index, 1);
                gameService.gameWait(roomId);
            }
        }
    } catch (e) {
        console.log('leaveRoom', e);
    }

}

const disconnectRoom = (playerId: string) => {
    try {
        const roomId = players[playerId].roomId;
        if (roomId) {
            leaveRoom(roomId, playerId);
            delete players[playerId];
            return roomId;
        }
    } catch (e) {
        console.log('disconnectRoom', e);
    }

}

export default {
    createPlayer,
    createRoom,
    joinRoom,
    leaveRoom,
    disconnectRoom
}
