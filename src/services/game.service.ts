import { rooms, players } from "../db";
import { Player } from "../models/game.model";

const gameStart = (roomId: string) => {
    rooms[roomId].isPlay = true;
    rooms[roomId].players.forEach((player: Player, index: number) => {
        if (index == 0) {
            player.symbol = "X";
            player.isTurn = true;
        } else {
            player.symbol = "O";
            player.isTurn = false;
        }
    });
    return rooms[roomId];
}


export default {
    gameStart
}