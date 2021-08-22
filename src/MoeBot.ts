import { Client, createClient } from 'oicq';
import log4js from 'log4js';
import puppeteer from 'puppeteer-core';
import { GenshinKit } from 'genshin-kit';
import { Collection } from './utils/Collection';
import config from './utils/Configuration';
import modules from './modules';
import commands, { Command } from './commands';

/** Moe 机器人 */
export class MoeBot {
  /** 客户端 */
  public readonly client: Client;
  /** 命令集合 */
  public readonly commands: Collection<string, Command>;

  /** 当前浏览器实例 */
  private _browser?: puppeteer.Browser;

  /** 当前原神工具库实例 */
  private _genshin?: GenshinKit;

  /** 原神工具库实例 */
  public get genshin() {
    return this._genshin || (this._genshin = new GenshinKit().loginWithCookie(config.mihoyo.cookie_cn));
  }

  constructor() {
    // 配置日志
    log4js.configure({
      appenders: {
        out: { type: 'stdout' },
        file: { type: 'file', filename: `${config.log_dir || 'logs'}/moebot.log`, maxLogSize: 10485760, backups: 5, compress: true, keepFileExt: true }
      },
      categories: {
        default: { appenders: ['out', 'file'], level: 'trace' }
      }
    });
    // 创建客户端
    this.client = createClient(config.qq, {
      platform: config.platform || 5,
      data_dir: config.data_dir || 'data',
      log_level: config.log_level || 'info'
    });
    this.commands = new Collection<string, Command>(); // 初始化命令集合
    // 加载相关内容
    this.loadModules();
    this.loadCommands();
    // 收到关闭信号时，退出程序。
    process.on('SIGINT', () => { this.exit() });
    process.on('SIGTERM', () => { this.exit() });
  }

  /** 启动程序 */
  public start() {
    this.client.login(config.password);
  }

  /** 退出程序 */
  public async exit() {
    this.client.logger.info('拜拜!');
    await this._browser?.close();
    await this.client.logout();
    return process.exit();
  }

  /** 加载模块 */
  private loadModules() {
    for (const module of modules) {
      this.client.logger.info(`[模块] 加载 ${module.name}`);
      module(this);
    }
  }

  /** 加载命令 */
  private loadCommands() {
    for (const command of commands) {
      this.client.logger.info(`[命令] 加载 ${command.name}`);
      this.commands.set(command.name, command);
    }
  }

  /**
   * 查找命令
   * @param str 命令的名称或别名
   * @returns 对应的命令对象，未找到则返回 undefined。
   */
  public findCommand(str: string) {
    const name = str.toLowerCase();
    return this.commands.get(name) || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));
  }

  /** 获取浏览器实例 */
  public async getBrowser() {
    // 如果实例可用则直接返回实例
    if (this._browser && this._browser.isConnected()) return this._browser;
    // 尝试关闭已有实例
    await this._browser?.close();
    // 创建并返回新实例
    this.client.logger.debug('[浏览器] 创建实例');
    return this._browser = await puppeteer.launch({
      executablePath: config.browser.path,
      args: [
        '--lang=zh-CN',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process',
        '--disable-dev-shm-usage',
        '--disable-extensions'
      ],
      defaultViewport: { width: 800, height: 600 }
    });
  }

  /** 检查标签页是否到达上限 */
  public async isPagesLimit() {
    return this._browser && this._browser.isConnected() ? (await this._browser.pages()).length > config.browser.pages_limit : false;
  }
}

// 创建并启动机器人
const bot = new MoeBot();
bot.start();
