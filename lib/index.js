
module.exports = function(adapter) {
  return require('./adapter/'+(adapter || 'mysql'));
}

