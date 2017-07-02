import 'babel-polyfill'
import { expect } from 'chai';
import wechatApp from '../../../src/framework/wechatApp';
import context, { load } from '../../../src/app/context';

before(function(done){
  load(null, done)
})

describe('UserService', () => {
  it('#onLogin - a invalid code supported, failed', async () => {
    let code = '111'
    try {
      let res = await wechatApp.onLogin(code)
    } catch(e) {
      expect(e).to.not.be.null
    }
    
  })
})