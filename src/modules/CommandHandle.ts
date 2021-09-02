import { Module } from '.';
import minimist from 'minimist';
import config from '../utils/Configuration';

const CommandHandle: Module = (bot) => {
  // 导入对象
  const { client } = bot;
  const { logger } = client;

  // 收到消息时
  client.on('message', async data => {
    if (!data.raw_message.startsWith(config.prefix)) return; // 判断是否有命令前缀

    // 解析命令文本
    const str = data.raw_message.slice(config.prefix.length).trim();
    const args = str.match(/"(\\"|[^"])*"|(\\"|[^\s"])+/g)?.map(v => v
      .replace(/^"(.*)"$/s, '$1')
      .replace(/\\"/g, '"')
    );
    if (!args) return;
    const name = args.shift()!;

    // 查找命令
    const command = bot.findCommand(name);
    if (!command) return;

    // 执行命令
    try {
      await command.execute(bot, data, minimist(args, command.minimist_opts));
    } catch (error) {
      logger.error(error);
    }
  });
}

export default CommandHandle;
