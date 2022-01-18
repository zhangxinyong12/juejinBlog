import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WsStartGateway } from './ws.gateway';
import { GameService } from './game/game.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, WsStartGateway, GameService],
})
export class AppModule { }
