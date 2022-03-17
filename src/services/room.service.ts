import { rooms, players } from "../db";
import { Player } from "../models/game.model";
import gameService from "./game.service";

const createPlayer = (id: string, name: string, roomId: string) => {
    const player = {
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
        isPlay: false,
        status: "waiting"
    };
    return rooms[roomId];
}

const joinRoom = (roomId: string, player: Player) => {
    rooms[roomId].players.push(player);
}

const leaveRoom = (roomId: string, playerId: string) => {
    try {
        const index = rooms[roomId].players.findIndex((p: Player) => p.id === playerId);
        rooms[roomId].players.splice(index, 1);
        gameService.gameEnd(roomId);
    } catch (e) {
        console.log(e);
    }

}

const disconnectRoom = (playerId: string) => {
    try {
        const roomId = players[playerId].roomId;
        leaveRoom(roomId, playerId);
        delete players[playerId];
        return roomId;

    } catch (e) {
        console.log(e);
    }

}

export default {
    createPlayer,
    createRoom,
    joinRoom,
    leaveRoom,
    disconnectRoom
}
