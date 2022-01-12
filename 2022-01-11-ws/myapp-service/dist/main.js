"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const platform_ws_1 = require("@nestjs/platform-ws");
const app_module_1 = require("./app.module");
const port = '3000';
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*'
    });
    app.useWebSocketAdapter(new platform_ws_1.WsAdapter(app));
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map