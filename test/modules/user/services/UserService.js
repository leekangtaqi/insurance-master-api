import 'babel-polyfill'
import { expect } from 'chai';
import context, { load } from '../../../../src/app/context';

before(function(done){
  load(null, done)
})

describe('UserService', () => {
  it('#onLogin - a invalid code supported, failed', async () => {
    let code = '111'
    let service = context.services.UserService()
    
  })
})