import context from '../app/context'

export default function UserApiRouter(router){
  let { fileController }  = context.controllers

  router.post('/download', fileController.download)
  
  router.post('/upload', fileController.upload)
  
  return router
}