import { rooms, players } from "../db";
import { Player, Room } from "../models/game.model";

const createBoard = (size: number) => {
    let board = [];
    for (let i = 0; i < size * size; i++) {
        board.push("");
    }
    return board;
}

const gameStart = (roomId: string) => {
    try {
        let room: Room = rooms[roomId];
        room.board = createBoard(room.boardSize);
        room.status = "playing";
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
    } catch (e) {
        console.log('gameStart', e);
    }
}

const queueUpdate = (room: Room) => {
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
    try {
        let room: Room = rooms[roomId];
        if (playerId !== room.players[0].id) {
            return -1;
        }
        room.board[idx] = room.players[0].symbol;
        room = queueUpdate(room);

        rooms[roomId] = room;
        return room;
    } catch (e) {
        console.log('gameUpdate', e);
        return -1;
    }

}

const gameWait = (roomId: string) => {
    try {
        let room: Room = rooms[roomId];
        room.status = "waiting";
        rooms[roomId] = room;
    } catch (e) {
        console.log('gameWait', e);
    }

}

const gameGiveUp = (roomId: string, playerId: string) => {
    try {
        let room: Room = rooms[roomId];
        room.players.forEach((player: Player) => {
            if (player.id !== playerId) {
                player.isWinner = true;
            }
        })
        room.status = "ended";
        rooms[roomId] = room;
        return room;
    } catch (e) {
        console.log('gameGiveUp', e);
        return -1;
    }

}

const gamePlayAgain = (roomId: string, playerId: string) => {
    try {
        let room: Room = rooms[roomId];
        room.board = createBoard(room.boardSize);
        if (room.status === "ended") {
            room.status = "waiting";
            room.players.forEach((player: Player) => {
                if (player.id === playerId) {
                    player.isTurn = false;
                    player.isWinner = false;
                }
            });

        } else {
            room.status = "playing";
            room.players.forEach((player: Player, index: number) => {
                if (index == 0) {
                    player.symbol = "X";
                    player.isTurn = true;
                    player.isWinner = false;
                } else {
                    player.symbol = "O";
                    player.isTurn = false;
                    player.isWinner = false;
                }
            });
        }

        rooms[roomId] = room;
        return room;

    } catch (e) {
        console.log('gamePlayAgain', e);
        return -1;
    }

}


export default {
    gameStart,
    gameUpdate,
    gameWait,
    gameGiveUp,
    gamePlayAgain
}