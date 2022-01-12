/// <reference types="node" />
import { WsResponse } from "@nestjs/websockets";
import { Socket } from "dgram";
export declare class WsStartGateway {
    handleEvent(data: string, client: Socket): WsResponse<unknown>;
}
