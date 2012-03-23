
module.exports = function(adapterName) {
  return require('./'+adapterName);
}

