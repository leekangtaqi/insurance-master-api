import log4js from 'log4js'
import util from 'util';

log4js.configure(__dirname + '/logging.json', { reloadSecs: 0 });

const logger = log4js.getLogger('app');
const middleware = async (ctx, next) => {
  logger.setLevel('DEBUG');
  const DEFAULT = "%s %s -- %s %s HTTP/%s, %s %s";
  const req = ctx.request, header = ctx.header, nodeReq = ctx.req;
  const str = util.format(DEFAULT, new Date().toLocaleString(), req.ip, req.method, req.url, nodeReq.httpVersion, req.length || null, header['user-agent']);

  logger.debug(str);

  await next()
}

export default {
  logger,
  middleware
}

export {
  logger,
  middleware
}