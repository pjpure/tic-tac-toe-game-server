import { rooms, players } from "../db";
import { Player } from "../models/game.model";

const createBoard = (size: number) => {
    let board = [];
    for (let i = 0; i < size * size; i++) {
        board.push("");
    }
    return board;
}

const gameStart = (roomId: string) => {
    let room = rooms[roomId];
    room.board = createBoard(room.boardSize);
    room.status = "playing";
    room.isPlay = true;
    room.players.forEach((player: Player, index: number) => {
        if (index == 0) {
            player.symbol = "X";
            player.isTurn = true;
        } else {
            player.symbol = "O";
            player.isTurn = false;
        }
    });
    rooms[roomId] = room;
    return room;
}

const queueUpdate = (room: any) => {
    const firstPlayer = room.players[0];
    let newPlayers = room.players.slice(1);
    newPlayers.push(firstPlayer);
    room.players = newPlayers;
    room.players.forEach((player: Player, index: number) => {
        if (index == 0) {
            player.isTurn = true;
        } else {
            player.isTurn = false;
        }
    });
    return room;
}

const gameUpdate = (roomId: string, playerId: string, idx: number) => {
    let room = rooms[roomId];
    if (playerId !== room.players[0].id) {
        return -1;
    }
    room.board[idx] = room.players[0].symbol;
    room = queueUpdate(room);

    rooms[roomId] = room;
    return room;
}

const gameEnd = (roomId: string) => {
    let room = rooms[roomId];
    room.status = "ended";
    room.isPlay = false;
}


export default {
    gameStart,
    gameUpdate,
    gameEnd
}