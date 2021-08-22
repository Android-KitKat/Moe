import { Command } from '.';
import config from '../utils/Configuration';

const Help: Command = {
  name: '帮助',
  description: '获取命令帮助',
  usage: '[命令]',
  aliases: ['help', 'h', '?', 'bz'],
  manual: [
    ['命令', '要获取帮助的命令名']
  ],

  execute(bot, data, args) {
    // 导入对象
    const { prefix } = config;

    // 未指定命令时，列出可用命令。
    if (!args._[0]) {
      const man = [
        `需要在命令前添加前缀"${prefix}"使用`,
        '可用命令:'
      ];
      for (const command of bot.commands.values()) {
        man.push(`${command.name} - ${command.description}`);
      }
      man.push(`\n使用"${prefix}${this.name} 命令"查看详细帮助`);
      return data.reply(man.join('\n'));
    }

    // 查找命令
    const command = bot.findCommand(args._[0]);
    if (!command) return data.reply('命令不存在！');

    // 生成命令手册
    const man = [
      `命令: ${command.name}`,
      `描述: ${command.description}`,
      `用法: ${prefix}${command.name}${command.usage ? ` ${command.usage}`: ''}`
    ];
    if (command.aliases) man.push(`别名: ${command.aliases.join(', ')}`);
    if (command.manual) {
      man.push('');
      for (const row of command.manual) {
        man.push(`${row[0]}${row[1] ? ` - ${row[1]}` : ''}`);
      }
    }
    data.reply(man.join('\n'));
  }
};

export default Help;
