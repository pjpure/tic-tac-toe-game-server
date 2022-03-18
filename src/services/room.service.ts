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
        const index = rooms[roomId].players.findIndex((p: Player) => p.id === playerId);
        rooms[roomId].players.splice(index, 1);
        gameService.gameWait(roomId);
    } catch (e) {
        console.log('leaveRoom', e);
    }

}

const disconnectRoom = (playerId: string) => {
    try {
        const roomId = players[playerId].roomId;
        leaveRoom(roomId, playerId);
        delete players[playerId];
        return roomId;

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
