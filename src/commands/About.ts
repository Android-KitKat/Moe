import { Command } from '.';

const About: Command = {
  name: '关于',
  description: '机器人的相关信息',
  aliases: ['about', 'gy'],

  execute(bot, data, args) {
    // 导入对象
    const { version } = require('../../package.json');
    
    // 生成信息
    const message = [
      '关于 Moe 机器人',
      '开发者: Android',
      `版本: ${version}`,
      '源代码: https://github.com/Android-KitKat/Moe'
    ];
    data.reply(message.join('\n'));
  }
}

export default About;
