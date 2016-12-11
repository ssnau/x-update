# x-update


## How to use

```
var xUpdate = require('x-update');
xUpdate({
  root: __dirname,  // the root path of your project
  install: void 0  // the install command, default to be "npm install"
}).then(function() {
  process.exit(-1);   // do whatever you want
});

```
