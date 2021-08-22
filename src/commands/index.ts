import { MoeBot } from '../MoeBot';
import { MessageEventData } from 'oicq';
import { Opts, ParsedArgs } from 'minimist';
import Help from './Help';
import About from './About';
import VideoPic from './VideoPic';
import YuanShen from './YuanShen';

/** 机器人命令 */
export interface Command {
  /** 名称 */
  readonly name: string;
  /** 描述 */
  readonly description: string;
  /** 用法 */
  readonly usage?: string;
  /** 别名 */
  readonly aliases?: string[];
  /** 手册 */
  readonly manual?: [string, string?][];
  /** 参数解析选项 */
  readonly minimist_opts?: Opts;

  /**
   * 执行命令
   * @param bot 机器人实例
   * @param data 消息数据
   * @param args 命令参数
   */
  execute(bot: MoeBot, data: MessageEventData, args: ParsedArgs): unknown;
}

export default [
  Help,
  About,
  VideoPic,
  YuanShen
];
