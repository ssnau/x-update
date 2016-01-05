var spawn = require('xspawn');
var noop = function(){};
var co = require('co');
var getRunner = function (dir) {
  return function (cmd, onData) {
    return spawn(`cd ${dir} && ${cmd}`, {$through: true, onData});
  }
}
var runAction = function *() {
  var out = '';
  var onData = str => out+=str;
  var run = function (cmd) {
    return getRunner(__dirname)(cmd, onData);
  };

  // 1. reset and clean
  yield run('git reset --hard HEAD');
  yield run('git clean -f');

  // 2. git pull
  yield run('git pull');
  // 3. diff package.json and install
  var res = yield run('git diff "HEAD^" "HEAD" -- package.json');
  var shouldInstall = !!res.out.trim();
  console.log(shouldInstall ? "found package.json changed, installing deps" : "skip install deps");
  if (shouldInstall) {
    res = yield run('npm install');
  }
  this.body = '<pre>' + out + '</pre>';
}

module.exports = co.wrap(runAction);
