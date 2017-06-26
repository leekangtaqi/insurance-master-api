import config from '../config'
import redis from 'redis'
import { logger } from './logging'
import Promise from 'bluebird'

const settings = config.redis;
const DEFAULT_NAME = 'default'
const clients = {};
//const options = [
//    "host",
//    "port",
//    "path",
//    "url",
//    "parser",
//    "string_numbers",
//    "return_buffers",
//    "detect_buffers",
//    "socket_keepalive",
//    "no_ready_check",
//    "enable_offline_queue",
//    "retry_max_delay",
//    "connect_timeout",
//    "max_attempts",
//    "retry_unfulfilled_commands",
//    "password",
//    "db",
//    "family",
//    "disable_resubscribing",
//    "rename_commands",
//    "tls",
//    "prefix",
//    "retry_strategy"
//];

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

/*
 * logging methods
 */
const infolog = function (msg) {
  return function() {
    logger.info(msg, arguments);
  }
};
const warnlog = function (msg) {
  return function() {
    logger.warn(msg, arguments);
  }
};
const errorlog = function (msg) {
  return function() {
    logger.error(msg, arguments);
  }
};

const redisClient = function(name){
  name = name || DEFAULT_NAME;
  if(clients[name]) return clients[name];
  return clients[name] = createRedisClient(name);
};

const createRedisClient = function(name){
  let redisClient = {};
  if (settings.mode == 'single') {
    redisClient = redis.createClient(settings.port, settings.host, {} );
    //redisClient = redis.createClient(_.pick.apply(null, [settings].concat(options))); //TODO: need options
  } else {
    redisClient = null; //TODO: sentinel
  }

  if (settings.auth != '') {redisClient.auth(settings.auth);}

  const url = 'redis://' + redisClient.address;
  redisClient.on('connect'     , infolog('Redis client ' + name + ' is connecting to ' + url));
  redisClient.on('ready'       , infolog('Redis client ' + name + ' is ready'));
  redisClient.on('reconnecting', warnlog('Redis client ' + name + ' is reconnecting to ' + url));
  redisClient.on('error'       , errorlog('Redis client ' + name + ' error happens'));
  redisClient.on('end'         , infolog('Redis client ' + name + ' is ended'));
  return redisClient;
};

module.exports = redisClient;