import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Post('add')
  add(@Body() body) {
    console.log(body);
    const { name } = body;
    const cookie = body.cookie;
    return this.appService.addCookie(name, cookie);
  }
}
