"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const puppeteer = require("puppeteer");
const fs = require("fs");
const schedule = require("node-schedule");
let AppService = class AppService {
    constructor() {
        this.headless = false;
        this.url = 'https://juejin.cn/user/center/signin';
        this.cookieData = {};
        this.job();
    }
    getHello() {
        return { data: '6666666' };
    }
    getCookieData() {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await fs.readFileSync('src/data.json').toString();
                this.cookieData = JSON.parse(data) || {};
            }
            catch (error) {
                reject(error);
            }
            resolve(true);
        });
    }
    async signin(cookieList) {
        return new Promise(async (resolve, reject) => {
            const url = this.url;
            const browser = await puppeteer.launch({
                headless: this.headless,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const page = await browser.newPage();
            await this.setCookie(cookieList, page);
            await page.goto(url);
            await page.waitForTimeout(3000);
            page.on('console', (msg) => {
                for (let i = 0; i < msg.args().length; ++i)
                    console.log(`page: ${msg.args()[i]}`);
            });
            const bodyHandle = await page.$('body');
            const dataMsg = await page.evaluate(async (body) => {
                let msg = '';
                let btn = body.querySelector('.signin.btn');
                if (btn) {
                    btn.click();
                    msg = '????????????';
                }
                else {
                    btn = body.querySelector('.signedin.btn');
                    const n = document.querySelector('.figure-card.large-card span').textContent;
                    if (btn) {
                        btn.click();
                        msg = '????????????,??????????????????' + n;
                    }
                    else {
                        msg = '????????????';
                    }
                }
                console.log(msg);
                return Promise.resolve(msg);
            }, bodyHandle);
            await page.waitForTimeout(5000);
            await page.close();
            await browser.close();
            resolve({ success: true, data: dataMsg });
        });
    }
    async init() {
        await this.getCookieData();
        const arr = Object.keys(this.cookieData);
        for (let i = 0; i < arr.length; i++) {
            const cookieList = this.cookieData[arr[i]];
            console.log('i=' + i);
            await this.signin(cookieList);
        }
    }
    async setCookie(cookieList, page) {
        return new Promise(async (resolve, reject) => {
            if (!Array.isArray(cookieList)) {
                reject('set cookie err,cookieList must be array');
            }
            const list = [];
            cookieList.forEach(async (el) => {
                const item = {
                    name: el.name,
                    value: el.value,
                    domain: el.domain,
                    path: el.path,
                    expires: el.expirationDate,
                    httpOnly: el.httpOnly,
                    secure: el.secure,
                    sameSite: el.sameSite,
                };
                list.push(item);
            });
            await page.setCookie(...list);
            resolve(true);
        });
    }
    job() {
        schedule.scheduleJob('0 30 8 * * *', async () => {
            console.log('scheduleCronstyle:' + new Date());
            this.init();
        });
    }
    async addCookie(name, cookie) {
        const data = await fs.readFileSync('src/data.json').toString();
        this.cookieData = JSON.parse(data) || {};
        this.cookieData[name] = cookie;
        let msg;
        try {
            msg = await this.signin(cookie);
        }
        catch (error) {
            return {
                success: false,
                data: `??????${name}???cookie??????,${error}`
            };
        }
        console.log(msg);
        if (msg.success) {
            this.cookieData[name] = cookie;
            await fs.writeFileSync('src/data.json', JSON.stringify(this.cookieData));
            return {
                success: true,
                data: `??????${name}???cookie??????`
            };
        }
        else {
            return {
                success: false,
                data: `??????${name}???cookie??????`
            };
        }
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map