import db from './db'
import redisMainCreator from './redis'
import Ar from '../framework/allready'
import errors from '../framework/errors'
import _ from './util'
import { logger } from './logging'

const context = {
  errors,
  redis: {
    main: null
  },
  db: {
    main: null
  },
  mongoose: {
    main: null
  },
  controllers: {},
  services: {},
  models: {},
  kvs: {}
}
const redisMain = redisMainCreator()

export function load(app, done) {
  !app && (app = {})
  const allready = new Ar()
  context.logger = logger;
  context.mongoose.main = db;
  context.db.main = db;
  context.redis.main = redisMain;

  allready.add('redis', allready.redis(redisMain));
  allready.add('mongoose', allready.mongoose(db));


  // wire modules
  const modules = require('../modules').default
  for (let { controllers, models, services, kvs } of _.values(modules)) {
    // register models
    if (models && Object.keys(models).length) {
      for (let [key, Inst] of _.pairs(models)) {
        if (context.models[key]) {
          throw new Error(`Failed to register the model,
          [key]=${key}, [reason]=duplicated models`)
        }
        context.models[key] = Inst; 
      }
    }
    // register services
    if (services && Object.keys(services).length) {
      for (let [key, Contrs] of _.pairs(services)) {
        if (context.services[key]) {
          throw new Error(`Failed to register the service,
          [key]=${key}, [reason]=duplicated service`)
        }
        context.services[key] = (...args) => {
          return new Contrs(context, ...args.slice(1))
        }
      }
    }
    // register kvs
    if (kvs && Object.keys(kvs).length) {
      for (let [key, Contrs] of _.pairs(kvs)) {
        if (context.kvs[key]) {
          throw new Error(`Failed to register the kv,
          [key]=${key}, [reason]=duplicated kvs`)
        }
        context.kvs[key] = (...args) => {
          return new Contrs(context, ...args.slice(1))
        }
      }
    }
    // register controllers
    if (controllers && Object.keys(controllers).length) {
      for (let [key, Contrs] of _.pairs(controllers)) {
        if (context.controllers[key]) {
          throw new Error(`Failed to register the controller,
          [key]=${key}, [reason]=duplicated controller`)
        }
        context.controllers[key.replace(/(\w)/, v => v.toLowerCase())] = new Contrs(); 
      }
    }
  }

  allready.ready(() => {
    app.ctx = context
    done()
  })
}

export default context