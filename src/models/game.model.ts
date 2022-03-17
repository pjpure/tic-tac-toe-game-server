
export interface Room {
    boardSize: number;
    board: string[];
    players: Player[];
    isPlay: boolean;
    status: "waiting" | "playing" | "ended";
}


export interface Player {
    id: string;
    roomId: string;
    name: string;
    symbol: string;
    isTurn: boolean;
}

