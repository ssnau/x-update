var spawn = require('xspawn');
var noop = function(){};
var co = require('co');
var getRunner = function (dir) {
  return function (cmd, onData) {
    return spawn(`cd ${dir} && ${cmd}`, {$through: true, onData});
  }
}
var runAction = function *(opts) {
  var out = '';
  var onData = str => out+=str;
  var run = function (cmd) {
    return getRunner(opts.root)(cmd, onData);
  };

  // 1. reset and clean
  yield run('git reset --hard HEAD');
  yield run('git clean -fd');
  var res = yield run('git rev-parse --verify HEAD');
  var version = res.out.trim();

  // 2. git pull
  yield run('git pull');
  // 3. diff package.json and install
  var res = yield run(`git diff ${version} HEAD -- package.json`);
  var shouldInstall = !!res.out.trim();
  console.log(shouldInstall ? "found package.json changed, installing deps" : "skip install deps");
  if (shouldInstall) {
    res = yield run(opts.install || 'npm install');
  }
  return out;
}

module.exports = co.wrap(runAction);
