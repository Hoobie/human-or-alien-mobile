module.exports = {
  include: [{
    src: '{{SRC}}/assets/',
    dest: '{{WWW}}/assets/'
  }, {
    src: '{{SRC}}/index.html',
    dest: '{{WWW}}/index.html'
  }, {
    src: '{{SRC}}/manifest.json',
    dest: '{{WWW}}/manifest.json'
  }, {
    src: '{{SRC}}/service-worker.js',
    dest: '{{WWW}}/service-worker.js'
  }, {
    src: 'node_modules/ionic-angular/polyfills/polyfills.js',
    dest: '{{BUILD}}/polyfills.js'
  }, {
    src: 'node_modules/ionicons/dist/fonts/',
    dest: '{{WWW}}/assets/fonts/'
  }, {
    src: 'node_modules/tracking/build/tracking.js',
    dest: '{{BUILD}}/tracking/tracking.js'
  }, {
    src: 'node_modules/tracking/build/data/eye.js',
    dest: '{{BUILD}}/tracking/eye.js'
  }, {
    src: 'node_modules/tracking/build/data/face.js',
    dest: '{{BUILD}}/tracking/face.js'
  }, {
    src: 'node_modules/tracking/build/data/mouth.js',
    dest: '{{BUILD}}/tracking/mouth.js'
  }]
};
