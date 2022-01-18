import { Controller, Get, Ip, Req, Session } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()

export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(@Ip() ip, @Session() session, @Req() req) {
    // console.log('ip', ip);
    // console.log('session', session);
    // console.log('req', req);

    return this.appService.getHello();
  }
}
