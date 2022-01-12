import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';

const port = '3000';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //  全局配置跨域
  app.enableCors({
    // 允许的请求源
    origin: '*'
  });
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
