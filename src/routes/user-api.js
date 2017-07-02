import context from '../app/context'

export default function UserApiRouter(router){
  let { userController }  = context.controllers

  router.use(userController.getUserMid)

  router.post('/onLogin', userController.onLogin)

  router.post('/login', userController.login)
  
  router.get('/:id', userController.getUser)

  return router
}