/// <reference types="node" />
import { WsResponse } from "@nestjs/websockets";
import { Socket } from "dgram";
import { GameService } from "./game/game.service";
export declare class WsStartGateway {
    private gameService;
    private list;
    constructor(gameService: GameService);
    handleEvent(data: any, client: Socket): WsResponse<unknown>;
}
