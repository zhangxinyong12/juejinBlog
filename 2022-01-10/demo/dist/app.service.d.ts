export declare class AppService {
    headless: boolean;
    url: string;
    cookieData: {};
    page: any;
    constructor();
    getHello(): {
        data: string;
    };
    getCookieData(): Promise<unknown>;
    signin(cookieList: any): Promise<{
        success: boolean;
        data: any;
    }>;
    init(): Promise<void>;
    setCookie(cookieList: any[]): Promise<unknown>;
    job(): void;
    addCookie(name: string, cookie: any[]): Promise<{
        success: boolean;
        data: string;
    }>;
}
