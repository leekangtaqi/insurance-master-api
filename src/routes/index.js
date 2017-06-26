import mount from '../framework/route-mounter'

export default function mountRoutes(app) {

  mount('/', require('./main').default)(app)
  
  mount('/api', require('./api').default)(app)
}