import { rooms, players } from "../db";
import { Player } from "../models/game.model";

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

const createBoard = (size: number) => {
    let board = [];
    for (let i = 0; i < size * size; i++) {
        board.push("");
    }
    return board;
}

const createRoom = (player: Player, boardSize: number, roomId: string) => {
    const board = createBoard(boardSize);
    rooms[roomId] = {
        players: [player],
        boardSize: boardSize,
        board: board,
        isPlay: false
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
    } catch (e) {
        console.log(e);
    }

}

const disconnectRoom = (playerId: string) => {
    try {
        const roomId = players[playerId].roomId;
        leaveRoom(roomId, playerId);
        delete players[playerId];
    } catch (e) {
        console.log(e);
    }

}

export default {
    createPlayer,
    createRoom,
    createBoard,
    joinRoom,
    leaveRoom,
    disconnectRoom
}
