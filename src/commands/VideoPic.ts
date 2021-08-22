import { Command } from '.';
import { MessageElem, segment } from 'oicq';
import fetch from 'node-fetch';

const VideoPic: Command = {
  name: '封面',
  description: '获取视频封面',
  usage: '[-p|--picture] <地址>',
  aliases: ['picture', 'pic', 'fm'],
  manual: [
    ['地址', '视频的地址'],
    ['-p, --picture', '将封面作为图片添加到结果中'],
    ['\n感谢 bilibili-API-collect 项目']
  ],
  minimist_opts: {
    boolean: ['picture'],
    alias: {
      p: 'picture'
    }
  },

  async execute(bot, data, args) {
    if (args._[0]) { // 指定地址时
      for (const rule in rules) { // 遍历规则
        const key = rule as keyof typeof rules;
        if (!rules[key].test(args._[0])) continue; // 如果不匹配则跳出本次循环
        // 获取并生成视频信息
        try {
          const vdata = await getVideoData(args._[0], key);
          const message: MessageElem[] = [
            segment.text(`标题：${vdata.title}\n链接：${vdata.url}\n封面：${vdata.pic}`)
          ];
          if (args.picture) message.unshift(segment.image(vdata.pic), segment.text('\n'));
          return data.reply(message);
        } catch (error) {
          data.reply(error.message);
          throw error;
        }
      }
    }
    // 没有匹配的规则时
    data.reply('未发现视频地址');
  }
};

/** 定义地址规则 */
const rules = {
  bilibili_bv: /BV([A-Za-z0-9]+)/,
  bilibili_av: /av([0-9]+)/,
  bilibili_short: /https?:\/\/b23.tv\/[A-Za-z0-9]+/
};

/** 视频数据结构 */
interface VideoData {
  title: string,
  url: string,
  pic: string
}

/**
 * 获取视频数据
 * @param str 地址
 * @param rule 规则
 * @returns 视频数据
 */
function getVideoData(str: string, rule: keyof typeof rules): Promise<VideoData> {
  // 判断是否与规则匹配
  if (!rules[rule].test(str)) throw new TypeError(`无法解析为"${rule}"`);
  // 解析地址并调用对应方法
  const data = rules[rule].exec(str)!;
  switch (rule) {
    case 'bilibili_bv':
      return bilibili(data[1]);
    case 'bilibili_av':
      return bilibili(data[1], true);
    case 'bilibili_short':
      return bilibiliShort(data[0]);
  }
}

/**
 * 获取哔哩哔哩的视频数据
 * @param id 视频 ID
 * @param av 是否是 AV 类型的 ID
 * @returns 视频数据
 */
async function bilibili(id: string, av?: boolean) {
  // 调用 API
  const res = await fetch(`https://api.bilibili.com/x/web-interface/view?${av ? 'aid' : 'bvid'}=${id}`);
  const json = await res.json();
  if (json.code !== 0) throw new Error(`${json.code} ${json.message}`); // 如果是错误则抛出异常
  // 生成视频数据
  const base_url = 'https://www.bilibili.com/video/';
  return <VideoData>{
    title: json.data.title,
    url: `\n${base_url}${json.data.bvid}\n${base_url}av${json.data.aid}`,
    pic: json.data.pic
  };
}

/**
 * 获取哔哩哔哩短链的视频数据
 * @param url 短链
 * @returns 视频数据
 */
async function bilibiliShort(url: string) {
  // 请求短链
  const res = await fetch(url, {
    redirect: 'manual'
  });
  // 未重定向则抛出异常
  if (!res.headers.has('location')) {
    const json = await res.json();
    throw new Error(`${json.code} ${json.message}`);
  }
  // 用重定向的地址获取视频数据
  return getVideoData(res.headers.get('location')!, 'bilibili_bv');
}

export default VideoPic;
