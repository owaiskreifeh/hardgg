module.exports = {
  require: ['@babel/register'],
  extension: ['js'],
  spec: 'test/**/*.test.js',
  timeout: 5000,
  reporter: 'spec',
  slow: 75,
  ui: 'bdd'
};
