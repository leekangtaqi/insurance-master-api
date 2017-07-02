import app from './app'
import logging, { logger } from './logging'
import config from '../config'
import Nightmare from 'nightmare'

app.ready(() => {
  app.listen(config.port, config.bindip, () => {
    logger.info(`application is startup, listening on port ${config.port}`)
  })
})

var nightmare = Nightmare({ show: true });

let p1 = nightmare
  .goto('http://www.ctrip.com/')
  .click('#c_ph_login')
  .type('#txtUserName', '15210383276')
  .type('#txtPwd', '40115891r')
  .wait(function() {
    return document.querySelector('#imgCode').src
  })
  .evaluate(function() {
    return document.querySelector('#imgCode').src
  })
  .then(() => {
    console.warn('22222')
  })

setTimeout(function() {
  p1.end()
}, 20000);
  
  