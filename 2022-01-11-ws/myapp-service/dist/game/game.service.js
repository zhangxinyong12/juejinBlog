"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
let GameService = class GameService {
    constructor() {
        this.list = new Map();
    }
    handleEvent(wsData) {
        console.log('wsData', wsData);
        let data;
        if (wsData.type === 'match') {
            data = this.match(wsData.data);
        }
        else if (wsData.type === 'set') {
            data = this.setRoom(wsData.data);
        }
        else if (wsData.type === 'start') {
            this.startGame(wsData.data);
            data = {
                type: 'start',
                success: true,
                data: `游戏已开始`
            };
            setTimeout(() => {
                return this.endGame(wsData.data);
            }, 1000 * 30);
        }
        else if (wsData.type === 'add') {
            data = this.addGme(wsData.data);
        }
        else if (wsData.type === 'sort') {
            data = this.sortGame(wsData.data);
        }
        else if (wsData.type === 'end') {
            data = this.endGame(wsData.data);
        }
        setInterval(() => {
            return {
                event: 'events',
                data: 66666666666666666,
            };
        }, 1000 * 3);
        return {
            event: 'events',
            data,
        };
    }
    setRoom(data) {
        console.log('set', data);
        const { room } = data;
        if (this.list.has(room)) {
            return {
                type: 'set',
                success: false,
                data: `房间号：${room}已存在，请换个`
            };
        }
        else {
            this.list.set(room, {});
            return {
                type: 'set',
                success: true,
                data: `房间号：${room}已创建完毕`
            };
        }
    }
    match(data) {
        const { room, name } = data;
        if (!this.list.has(room)) {
            return {
                type: 'match',
                success: false,
                data: `房间号：${room}不存在，请先创建`
            };
        }
        else {
            const roomData = this.list.get(room);
            if (roomData[name] !== undefined) {
                return {
                    type: 'match',
                    success: false,
                    data: `姓名：${name}已经存在`
                };
            }
            roomData[name] = 0;
            this.list.set(room, roomData);
            setTimeout(() => {
                this.sortGame(data);
            });
            return {
                type: 'match',
                success: true,
                data: `房间号：${data.room}匹配成功等待开始......`
            };
        }
    }
    startGame(data) {
        const { room, } = data;
        const roomData = this.list.get(room);
        roomData.status = 'start';
        this.list.set(room, roomData);
    }
    endGame(data) {
        const { room, } = data;
        const roomData = this.list.get(room);
        roomData.status = 'end';
        this.list.set(room, roomData);
        setTimeout(() => {
            return this.sortGame(data);
        }, 1000 * 3);
        return {
            event: 'events',
            data: {
                type: 'end',
                data: '游戏已经结束'
            }
        };
    }
    addGme(data) {
        const { room, name, number } = data;
        const roomData = this.list.get(room);
        roomData[name] = number;
        this.list.set(room, roomData);
        return this.sortGame(data);
    }
    sortGame(data) {
        console.log('游戏排行');
        const { room, } = data;
        const roomData = this.list.get(room);
        const list = [];
        Object.keys(roomData).forEach(el => {
            list.push({
                name: el,
                number: roomData[el]
            });
        });
        list.sort((a, b) => {
            return a.number - b.number;
        });
        console.log('排行数据', list);
        return {
            event: 'events',
            data: {
                type: 'list',
                data: list
            }
        };
    }
};
GameService = __decorate([
    (0, common_1.Injectable)()
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map