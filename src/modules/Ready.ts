import { Module } from '.';

const Ready: Module = (bot) => {
  // 导入对象
  const { client } = bot;
  const { logger } = client;

  // 在线时
  client.on('system.online', () => {
    logger.info(`${client.nickname} 已在线`);
  });
  // 扫码登陆时
  client.on('system.login.qrcode', () => {
    process.stdin.once('data', () => {
      client.login();
    });
  });
  // 触发滑动验证码时
  client.on('system.login.slider', () => {
    process.stdin.once('data', input => {
      client.sliderLogin(input.toString());
    });
  });
  // 触发登陆保护验证时
  client.on('system.login.device', () => {
    process.stdin.once('data', () => {
      client.login();
    });
  });
}

export default Ready;
