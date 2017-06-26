import 'babel-polyfill'
import request from 'supertest';
import assert from 'assert';
import app from '../../src/app/app.js';

let mockServer = null

before(function(done){
  // app.ready(() => {
  //   app.listen(3000, done)
  // })
  done()
})

describe('GET /api/user - ', () => {
  it('should return 500', done => {
    let mock = {
      "newPassWord1":"111112",
      "newPassWord2":"111112",
      "oldPassWord":"111111",
      "userId":"445016",
      "userType":"01"
    }
    request('http://172.28.32.13:8081')
      .post('/user/getAccountInfo')
      .send(mock)
      // .set({
      //   'X-Toon-User-ID': '373942',
      //   'X-Toon-User-Token': 'aa426ba0-1119-4b5c-a0a3-10c7ea0bcfc3',
      //   'X-Toon-User-Agent': 'platform:android,deviceId:99000640014344,appVersion:1.5,platformVersion:19,toonType:102',
      // })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        assert.equal(res.body.code, 124311)
        assert.equal(res.body.code, 124311)
      })
      .end(done)
  })
})