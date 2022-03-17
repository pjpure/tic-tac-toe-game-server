
export interface Room {
    board: string[];
    players: Player[];
    isPlay: boolean;
}


export interface Player {
    id: string;
    roomId: string;
    name: string;
    symbol: string;
    isTurn: boolean;
}

