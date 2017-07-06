import userApi from './user-api'
import botApi from './bot-api'
import fileApi from './file-api'
import mount, { Router } from '../framework/route-mounter'
import { logger, auth } from '../middlewares'
import context from '../app/context'

export default function Api(router) {
  
  router.use(logger)
  // router.use(context.controllers.UserController)
  mount('/user', userApi)(router)

  mount('/bot', botApi)(router)

  mount('/file', fileApi)(router)

  return router 
}