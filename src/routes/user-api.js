import context from '../app/context'

export default function UserApiRouter(router){
  let { userController }  = context.controllers

  router.get('/:id', userController.getUser)
  
  return router
}