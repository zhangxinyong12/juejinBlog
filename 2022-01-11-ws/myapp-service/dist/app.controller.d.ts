import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(ip: any, session: any, req: any): {
        success: boolean;
        data: string;
    };
}
