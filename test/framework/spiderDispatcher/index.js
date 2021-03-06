import dispatcher from '../../../src/framework/botDispatcher'
import types from '../../../src/framework/botDispatcher/events-definition'
import { expect } from 'chai'

describe('dispatch', () => {
  it('#request spide ctrip, fill receive event login request', done => {
    try {
      dispatcher.request(types.CTRIP_WEB_TOLOGIN, { key: '111', payload: '222' }, function(err, data){
        expect(data.action).to.be.equal('ctripWebNeedlogin')
        dispatcher.request(types.CTRIP_WEB_LOGIN, { key: '111', payload: { username: '15210383276', password: '40115891r', vcode : '555' }}, function(err, data) {
          expect(data.key).to.be.equal('111')
          done()
        })
      })
    } catch(e) {
      expect(e).to.not.be.null
    }
  })
})