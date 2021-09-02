import { Command } from '.';
import { segment } from 'oicq';
import fetch, { Headers } from 'node-fetch';
import config from '../utils/Configuration';

const Cat: Command = {
  name: '猫猫',
  description: '来张猫猫图',
  aliases: ['猫', '喵喵', '喵', 'cat'],
  manual: [
    ['感谢 The Cat API 项目']
  ],

  async execute(bot, data, args) {
    // 导入对象
    const { thecatapi_key } = config;

    // 设置请求头
    const headers = new Headers();
    if (thecatapi_key) headers.set('x-api-key', thecatapi_key);

    // 获取图片
    const res = await fetch('https://api.thecatapi.com/v1/images/search', { headers });
    const json = await res.json();
    data.reply(res.ok ? segment.image(json[0].url) : json.message);
  }
}

export default Cat;
