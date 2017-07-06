import context from '../app/context'

export default function UserApiRouter(router){
  let { botController }  = context.controllers

  router.get('/toLoginByUserId', botController.toLoginByUserId)

  router.get('/loginByUserIdUsernamePwdAndVcode', botController.loginByUserIdUsernamePwdAndVcode)

  return router
}