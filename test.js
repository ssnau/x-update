var run = require('./');
run({root: __dirname})
  .then(function(res) {
    console.log(res);
  })
  .catch(function(e) {
    console.log('err', e);
  });
