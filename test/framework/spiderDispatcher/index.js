import dispatcher from '../../../src/framework/spiderDispatcher'
import types from '../../../src/framework/spiderDispatcher/events-definition'
import { expect } from 'chai'

describe('dispatch', () => {
  it('#request spide ctrip, fill receive event login request', done => {
    let code = '111'
    try {
      // define message flow
      dispatcher.request(types.CTRIP_WEB_TOLOGIN, { key: '111', payload: '222' }, function(err, data){
        console.warn(data)
      })
      // dispatcher.request(types.CTRIP_SPIDE_REQUEST_INIT, { key: '111', payload: '222' }, function(err, data) {
      //   console.warn('request init done')
      //   console.warn(data)
      //   dispatcher.request(types.CTRIP_LOGIN_SIMPLE_REQUEST_RESPONSE, { key: '111', payload: { username: '15210383276', password: '40115891r', vcode : '555' }}, function(err, data) {
      //     console.warn('login done')
      //     done()
      //   }) 
      // })
      
      // dispatcher.once(types.CTRIP_LOGIN_REQUEST, function(payload) {
      //   console.warn(ctx)
      //   this.body = ctx
      //   done()
      // })
      // dispatcher.emit(types.CTRIP_SPIDE_REQUEST_INIT, { key: '111', payload: '222' })
    } catch(e) {
      expect(e).to.not.be.null
    }
  })


})