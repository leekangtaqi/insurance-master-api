import app from './app'
import logging, { logger } from './logging'
import config from '../config'
import Nightmare from 'nightmare'

app.ready(() => {
  app.listen(config.port, config.bindip, () => {
    logger.info(`application is startup, listening on port ${config.port}`)
  })
})
  