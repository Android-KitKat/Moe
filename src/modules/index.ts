import { MoeBot } from '../MoeBot';
import Ready from './Ready';
import CommandHandle from './CommandHandle';

/** 机器人模块 */
export interface Module {
  (bot: MoeBot): void;
}

export default [
  Ready,
  CommandHandle
];
