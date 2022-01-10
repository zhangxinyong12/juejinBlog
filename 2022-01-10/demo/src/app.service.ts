import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as schedule from 'node-schedule';

@Injectable()
export class AppService {
  headless = false; // 本地调试使用false 打开浏览器窗口方便调试
  url = 'https://juejin.cn/user/center/signin'; // 要访问的url
  cookieData = {};
  constructor() {
    this.job();
    // this.init();
  }

  getHello() {
    return { data: '6666666' };
    // return this.signin();
  }

  // 从本地文件获取cookie
  getCookieData() {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await fs.readFileSync('src/data.json').toString();
        this.cookieData = JSON.parse(data) || {};

      } catch (error) {
        reject(error);
      }
      resolve(true);
    });
  }

  // 爬虫
  async signin(cookieList) {
    return new Promise(async (resolve, reject) => {
      const url = this.url;
      const browser = await puppeteer.launch({
        headless: this.headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      // 跳转页面前设置cookie
      await this.setCookie(cookieList, page);

      await page.goto(url);
      // 等待时间
      await page.waitForTimeout(3000);
      // 监听console.log 否则page.evaluate里面的console看不到
      page.on('console', (msg) => {
        for (let i = 0; i < msg.args().length; ++i)
          console.log(`page: ${msg.args()[i]}`); // 这句话的效果是打印到你的代码的控制台
      });
      const bodyHandle = await page.$('body');
      // 代码运行到浏览器里面。不是后台服务里面
      const dataMsg = await page.evaluate(async (body) => {
        let msg = '';
        let btn: any = body.querySelector('.signin.btn');
        if (btn) {
          btn.click();
          msg = '签到成功';
        } else {
          btn = body.querySelector('.signedin.btn');
          const n = document.querySelector(
            '.figure-card.large-card span',
          ).textContent;
          if (btn) {
            btn.click();
            msg = '已经签到,当前钻石数：' + n;
          } else {
            msg = '签到失败';
          }
        }
        console.log(msg);

        return Promise.resolve(msg);
      }, bodyHandle);
      await page.waitForTimeout(5000);
      // 关闭页面
      await page.close();
      // 关闭浏览器
      await browser.close();
      resolve({ success: true, data: dataMsg });

    });

  }

  // 循环设置cookie，爬虫签到
  async init() {
    await this.getCookieData();
    const arr = Object.keys(this.cookieData);
    for (let i = 0; i < arr.length; i++) {
      const cookieList = this.cookieData[arr[i]];
      console.log('i=' + i);

      await this.signin(cookieList);
    }
  }

  async setCookie(cookieList: any[], page) {
    return new Promise(async (resolve, reject) => {
      // 处理脏数据
      if (!Array.isArray(cookieList)) {
        reject('set cookie err,cookieList must be array');
      }
      const list = [];
      cookieList.forEach(async (el) => {
        const item = {
          name: el.name,
          value: el.value,
          // url: 'juejin.cn',
          domain: el.domain,
          path: el.path,
          expires: el.expirationDate,
          httpOnly: el.httpOnly,
          secure: el.secure,
          sameSite: el.sameSite,
        };
        list.push(item);
      });
      await page.setCookie(...(list as any));
      resolve(true)
    });
  }

  // 定时任务
  job() {
    // 每天8点半执行签到任务
    schedule.scheduleJob('0 30 8 * * *', async () => {
      console.log('scheduleCronstyle:' + new Date());
      this.init();
    });
  }

  // 更新cookie
  async addCookie(name: string, cookie: any[]) {
    const data = await fs.readFileSync('src/data.json').toString();
    this.cookieData = JSON.parse(data) || {};
    this.cookieData[name] = cookie;

    let msg;
    try {
      msg = await this.signin(cookie);
    } catch (error) {
      return {
        success: false,
        data: `更新${name}的cookie失败,${error}`
      };
    }
    console.log(msg);

    if (msg.success) {
      this.cookieData[name] = cookie;
      await fs.writeFileSync('src/data.json', JSON.stringify(this.cookieData));
      return {
        success: true,
        data: `更新${name}的cookie成功`
      };
    } else {
      return {
        success: false,
        data: `更新${name}的cookie失败`
      };
    }
  }

}
