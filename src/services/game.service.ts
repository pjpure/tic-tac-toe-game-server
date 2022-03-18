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
        const { isWin, board } = gameCheckWinner(room.board, room.players[0].symbol, idx);
        if (isWin) {
            room.status = "ended";
            room.players.forEach((player: Player) => {
                if (player.id === playerId) {
                    player.isWinner = true;
                }
            })
            room.board = board;
        }
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

const gameCheckWinner = (board: string[], symbol: string, idx: number) => {
    const boardSize = Math.sqrt(board.length);
    const row = Math.floor(idx / boardSize);
    const col = idx % boardSize;

    let rowCount = 0;
    let colCount = 0;
    let diag1Count = 0;
    let diag2Count = 0;

    //row check
    for (let i = boardSize * row; i < boardSize * (row + 1); i++) {
        if (board[i] === symbol) {
            rowCount++;
        } else {
            break;
        }
    }
    if (rowCount === boardSize) {
        for (let i = boardSize * row; i < boardSize * (row + 1); i++) {
            board[i] = 'W' + symbol;
        }
        return { isWin: true, board: board };
    }

    //column check
    for (let i = col; i < board.length; i += boardSize) {
        if (board[i] === symbol) {
            colCount++;
        } else {
            break;
        }
    }
    if (colCount === boardSize) {
        for (let i = col; i < board.length; i += boardSize) {
            board[i] = 'W' + symbol;
        }
        return { isWin: true, board: board };
    }

    //diagonal1 check
    if (row === col) {
        for (let i = 0; i < board.length; i += boardSize + 1) {
            if (board[i] === symbol) {
                diag1Count++;
            } else {
                break;
            }
        }
        if (diag1Count === boardSize) {
            for (let i = 0; i < board.length; i += boardSize + 1) {
                board[i] = 'W' + symbol;
            }
            return { isWin: true, board: board };
        }
    }

    //diagonal2 check
    if (row + col === boardSize - 1) {
        for (let i = boardSize - 1; i < board.length - (boardSize - 1); i += boardSize - 1) {
            if (board[i] === symbol) {
                diag2Count++;
            } else {
                break;
            }
        }
        if (diag2Count === boardSize) {
            for (let i = boardSize - 1; i < board.length - (boardSize - 1); i += boardSize - 1) {
                board[i] = 'W' + symbol;
            }
            return { isWin: true, board: board };
        }

    }
    return { isWin: false, board: board };
}


export default {
    gameStart,
    gameUpdate,
    gameWait,
    gameGiveUp,
    gamePlayAgain,
    gameCheckWinner
}