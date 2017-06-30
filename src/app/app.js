import config from '../config'
import Koa from 'koa'
import Ready from '../framework/lean-ready'
import logging, { logger } from './logging'
import views from 'koa-views'
import cors from 'koa-cors'
import path from 'path'
import bodyParser from 'koa-body'
import mountRoutes from '../routes'
import errors from '../framework/errors'
import context, { load } from './context'

const app = new Koa()
app.env = process.env.NODE_ENV || config.env.mode;
app.proxy = true;
app.port =  process.env.PORT || config.env.port;
app.bindip =  process.env.BINDIP || config.env.bindIp;

// add some global middlewares here
app.use(logging.middleware);

app.use(views(path.join(__dirname, '../views'), { map: { html: 'swig' }}));

// body parser -> delay
app.use(bodyParser(config.bodyOptions))

// cors
app.use(cors(config.corsOptions))

Ready.mixin(app)

// wire modules
let launchContextDone = app.add('launchContext')
load(app, launchContextDone)

// routes
mountRoutes(app)

//404
app.use(async function(ctx, next) {
  ctx.throw(new errors.NotFoundError())
})

// error handler
app.on('error', (err, ctx) => {
  logger.error(err);
  ctx.status = err.statusCode
  ctx.body = { errmsg: err.message }
});

export default app