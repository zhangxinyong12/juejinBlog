import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): {
        data: string;
    };
    add(body: any): Promise<{
        success: boolean;
        data: string;
    }>;
}
