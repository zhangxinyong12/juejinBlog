import { Injectable } from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets';

type ListItem = {
  number: Number,
  data: Number,
  name: string
}
type List = {
  number: Number,
  list: ListItem[]
}
type wsData = {
  type: string,
  data: {
    room: Number,
    name: string,
    number?: number
  }
}
@Injectable()
export class GameService {
  private list = new Map(); //当前参与的

  handleEvent(wsData: wsData): WsResponse<unknown> {
    console.log('wsData', wsData);
    let data;
    if (wsData.type === 'match') {

      data = this.match(wsData.data)
    } else if (wsData.type === 'set') {

      data = this.setRoom(wsData.data)
    } else if (wsData.type === 'start') {
      this.startGame(wsData.data)
      data = {
        type: 'start',
        success: true,
        data: `游戏已开始`
      }
      // 30s后结束游戏
      setTimeout(() => {
        return this.endGame(wsData.data);
      }, 1000 * 30)
    } else if (wsData.type === 'add') {
      data = this.addGme(wsData.data);
    } else if (wsData.type === 'sort') {
      data = this.sortGame(wsData.data);
    } else if (wsData.type === 'end') {
      data = this.endGame(wsData.data);
    }
    setInterval(() => {
      return {
        event: 'events',
        data: 66666666666666666,
      }
    }, 1000 * 3)
    return {
      event: 'events',
      data,
    }
  }

  // 群主设置房间号
  setRoom(data) {
    console.log('set', data);

    const { room } = data
    if (this.list.has(room)) {
      return {
        type: 'set',
        success: false,
        data: `房间号：${room}已存在，请换个`
      };
    } else {
      this.list.set(room, {});
      return {
        type: 'set',
        success: true,
        data: `房间号：${room}已创建完毕`
      };
    }
  }
  // 选手进入匹配房间号和检验信息
  match(data) {
    const { room, name } = data;
    if (!this.list.has(room)) {
      return {
        type: 'match',
        success: false,
        data: `房间号：${room}不存在，请先创建`
      };
    } else {
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
  // 游戏开始叠加
  startGame(data) {
    const { room, } = data;
    const roomData = this.list.get(room);
    roomData.status = 'start';
    this.list.set(room, roomData);
  }
  // 游戏结束
  endGame(data) {
    const { room, } = data;
    const roomData = this.list.get(room);
    roomData.status = 'end';
    this.list.set(room, roomData);
    setTimeout(() => {
      return this.sortGame(data);
    }, 1000 * 3)
    return {
      event: 'events',
      data: {
        type: 'end',
        data: '游戏已经结束'
      }
    }
  }
  // 用户点击增加数据
  addGme(data) {
    const { room, name, number } = data;
    const roomData = this.list.get(room);
    roomData[name] = number;
    this.list.set(room, roomData);
    return this.sortGame(data);
  }

  // 游戏排行
  sortGame(data) {
    console.log('游戏排行');

    const { room, } = data;
    const roomData = this.list.get(room);
    const list = [];
    Object.keys(roomData).forEach(el => {
      list.push({
        name: el,
        number: roomData[el]
      })
    })
    list.sort((a: any, b: any) => {
      return a.number - b.number;
    })
    console.log('排行数据', list);

    return {
      event: 'events',
      data: {
        type: 'list',
        data: list
      }
    };
  }
}
