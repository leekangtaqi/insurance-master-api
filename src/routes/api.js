import userApi from './user-api'
import mount, { Router } from '../framework/route-mounter'
import { logger } from '../middlewares'

export default function Api(router) {

  router.use(logger)

  mount('/user', userApi)(router)

  return router 
}