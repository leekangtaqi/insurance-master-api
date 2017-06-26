import context from '../app/context'

export default function MainRouter(router){
  let { mainController }  = context.controllers

  router.get('/', mainController.getMain)
  
  return router
}