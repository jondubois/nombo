var foo = require('./foo/dep');
exports = module.exports = function(){
  console.log(foo.hello);
}
exports();
