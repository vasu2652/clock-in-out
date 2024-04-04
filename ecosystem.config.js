module.exports = {
  apps : [{
    name: 'clockInOut',
    script: 'index.js',
    instances: 1,
    watch: false
  }, {
    script: './service-worker/',
    watch: ['./service-worker']
  }]
};
