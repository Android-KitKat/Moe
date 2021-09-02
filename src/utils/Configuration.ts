import { ConfBot } from 'oicq';
import fs from 'fs';
import yaml from 'js-yaml';

/** 机器人配置 */
export interface Configuration {
  qq: number;
  password: string;
  prefix: string;
  platform: ConfBot['platform'];
  data_dir: ConfBot['data_dir'];
  log_dir: string;
  log_level: ConfBot['log_level'];
  browser: ConfBrowser;
  mihoyo: ConfMihoyo;
  thecatapi_key?: string;
}

/** 浏览器相关配置 */
export interface ConfBrowser {
  path: string;
  pages_limit: number;
}

/** 米哈游相关配置 */
export interface ConfMihoyo {
  cookie_cn: string;
  assets_source: 'default' | 'cn' | 'os';
}

// 读取配置文件
export default yaml.load(fs.readFileSync('config.yml', 'utf8')) as Configuration;
