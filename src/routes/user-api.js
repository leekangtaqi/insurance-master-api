import context from '../app/context'

export default function UserApiRouter(router){
  let { userController }  = context.controllers

  router.get('/:id', userController.getUser)
  router.get('/fetchUser', userController.fetchUser)
  router.get('/getSessionKey', userController.getSessionKey)
  return router
}