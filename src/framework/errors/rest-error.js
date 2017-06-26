import util from 'util'

function RestError({ restCode, statusCode, message, constructorOpt }){
  this.restCode = restCode;
  this.statusCode = restCode;
  this.message = restCode;
  this.constructorOpt = restCode;
  Error.call(this)
}

util.inherits(RestError, Error)

function register(constrName, statusCode, message){
  
  const Contrs = new Function(`options`, `
    this.restCode = options && options.restCode || null;
    this.statusCode = options && options.restCode || ${statusCode};
    this.message = options && options.restCode || '${message}';
    this.constructorOpt = ${Contrs};
    this.name = '${constrName}'
  `)
  Object.defineProperty(Contrs, 'name', { writable: true });
  Contrs.name = constrName
  util.inherits(Contrs, RestError)
  return Contrs
}

export { register }
export default RestError