import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from "@nestjs/websockets";
import { Socket } from "dgram";
import { GameService } from "./game/game.service";
type ListItem = {
  number: Number,
  data: Number
}
type List = {
  number: Number,
  list: ListItem[]
}
// 注意ws端口号不能和http端口号一样，否则会冲突
@WebSocketGateway(3002)
export class WsStartGateway {
  private list: List | unknown = new Map(); //当前参与的

  constructor(
    private gameService: GameService
  ) { }

  // SubscribeMessage里面的字符串代表类型，就是send event的值
  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    console.log('接收到的ws数据：', data);
    console.log(typeof data);

    return this.gameService.handleEvent(data);
  }


}
