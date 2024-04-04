module.exports = {
  apps : [{
    name: 'clockInOut',
    script: 'index.js',
    watch: '.'
  }, {
    script: './service-worker/',
    watch: ['./service-worker']
  }],

};
