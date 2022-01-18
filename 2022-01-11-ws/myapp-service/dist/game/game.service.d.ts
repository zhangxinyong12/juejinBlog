import { WsResponse } from '@nestjs/websockets';
declare type wsData = {
    type: string;
    data: {
        room: Number;
        name: string;
        number?: number;
    };
};
export declare class GameService {
    private list;
    handleEvent(wsData: wsData): WsResponse<unknown>;
    setRoom(data: any): {
        type: string;
        success: boolean;
        data: string;
    };
    match(data: any): {
        type: string;
        success: boolean;
        data: string;
    };
    startGame(data: any): void;
    endGame(data: any): {
        event: string;
        data: {
            type: string;
            data: string;
        };
    };
    addGme(data: any): {
        event: string;
        data: {
            type: string;
            data: any[];
        };
    };
    sortGame(data: any): {
        event: string;
        data: {
            type: string;
            data: any[];
        };
    };
}
export {};
