import { Command } from '.';
import { cqcode, segment } from 'oicq';
import path from 'path';
import moment from 'moment';
import pug from 'pug';
import { isValidCnUid } from 'genshin-kit/lib/util';
import config from '../utils/Configuration';

const YuanShen: Command = {
  name: '原神',
  description: '查询原神的玩家信息',
  usage: '[-f|--force] <UID>',
  aliases: ['genshin', 'ys'],
  manual: [
    ['UID', '游戏中的 UID'],
    ['-f, --force', '强制使用最新数据'],
    ['\n感谢 Genshin-Kit 项目']
  ],
  minimist_opts: {
    boolean: ['force'],
    alias: {
      f: 'force'
    }
  },

  async execute(bot, data, args) {
    // 检查 UID
    if (!args._[0]) return data.reply('请指定玩家的 UID');
    if (!isValidCnUid(args._[0])) return data.reply(`"${cqcode.text(args._[0])}"不是一个有效的 UID`);

    // 导入对象
    const { genshin } = bot;
    const { logger } = bot.client;

    // 生成日志前缀
    const prefix = `[原神] [UID:${args._[0]}] `;

    // 检查标签页是否到达上限
    if (await bot.isPagesLimit()) {
      logger.warn(`${prefix}标签页到达上限`);
      return data.reply('qwq 忙不过来惹~');
    }

    // 获取玩家信息
    let info;
    try {
      logger.debug(`${prefix}获取玩家信息`);
      info = await genshin.getUserInfo(parseInt(args._[0]), args.force);
    } catch (error) {
      return data.reply(`${error.message} (${error.code})`);
    }

    // 生成页面
    const html = pug.renderFile('assets/YuanShen/UserInfo.pug', {
      cache: true,
      assets_source: config.mihoyo.assets_source,
      uid: args._[0],
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
      ...info
    });

    // 渲染页面
    logger.debug(`${prefix}新建页面`);
    const page = await (await bot.getBrowser()).newPage();
    try {
      logger.debug(`${prefix}打开目录`);
      await page.goto(`file:///${path.resolve('assets/YuanShen/')}`);
      logger.debug(`${prefix}加载内容`);
      await page.setContent(html);
      logger.debug(`${prefix}生成截图`);
      const card = await page.screenshot({ fullPage: true }) as Buffer;
      logger.debug(`${prefix}发送图片`);
      data.reply(segment.image(card));
    } finally {
      logger.debug(`${prefix}关闭页面`);
      page.close();
    }
  }
};

export default YuanShen;
