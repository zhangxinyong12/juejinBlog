export declare class AppService {
    headless: boolean;
    url: string;
    cookieData: {};
    constructor();
    getHello(): {
        data: string;
    };
    getCookieData(): Promise<unknown>;
    signin(cookieList: any): Promise<unknown>;
    init(): Promise<void>;
    setCookie(cookieList: any[], page: any): Promise<unknown>;
    job(): void;
    addCookie(name: string, cookie: any[]): Promise<{
        success: boolean;
        data: string;
    }>;
}
