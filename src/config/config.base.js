export default {
  port: 3030,
  mongo: {
    host: "127.0.0.1",
    port: 27017,
    db: "wenode",
    // db: "admin",
    // username: 'root',
    // password: "Kang1x2IOAOb4AIcom"
  },
  mysql: {
    host: "127.0.0.1",
    port: 3306,
    db: "wenode",
    password: "40115891r",
    username: "root"
  },
  redis: {
    mode: 'single',
    host: '127.0.0.1',
    port: 6379,
    // auth: 'Deploy100%'
  },
  logging: {
    reloadSecs: 0, //INFO: set 0 could let nodeunit tests which use log4js exit properly
    level: 'DEBUG'
  },
  env: {
    mode: 'development',
    port: 3000,
    bindIp: '127.0.0.1'
  },
  bodyOptions: {
    multipart: true,
    formLimit: '10mb',
    formidable: {
      keepExtensions: true,
      maxFieldsSize: 1024*1024*5,
      onPart: function(part) {
        part.addListener('data',function(){
          console.log('parting...');
        });
      }
    }
  },
  corsOptions: {
    headers: [
      'Content-Type', 'Authorization', 'Accept',
      'X-API-From', 'X-APPID', 'X-Component', 'X-FXER',
      'x-api-from', 'x-appid', 'x-component', 'x-fxer'
    ],
    Origin: '*',
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    credentials: true
  },
  wx: {
    wxApp: {
      appid: 'wx17e63937c7fc1a11',
      appSecret: '225e6db48eb5221525dae873f492e5a8'
    }
  }
}
