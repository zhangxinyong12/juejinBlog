"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsStartGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const dgram_1 = require("dgram");
const game_service_1 = require("./game/game.service");
let WsStartGateway = class WsStartGateway {
    constructor(gameService) {
        this.gameService = gameService;
        this.list = new Map();
    }
    handleEvent(data, client) {
        console.log('接收到的ws数据：', data);
        console.log(typeof data);
        return this.gameService.handleEvent(data);
    }
};
__decorate([
    (0, websockets_1.SubscribeMessage)('events'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dgram_1.Socket]),
    __metadata("design:returntype", Object)
], WsStartGateway.prototype, "handleEvent", null);
WsStartGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(3002),
    __metadata("design:paramtypes", [game_service_1.GameService])
], WsStartGateway);
exports.WsStartGateway = WsStartGateway;
//# sourceMappingURL=ws.gateway.js.map