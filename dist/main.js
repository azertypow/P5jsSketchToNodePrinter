// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"printFile.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _pdfToPrinter = _interopRequireDefault(require("pdf-to-printer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * send document to print
 * @param {String} documentPath - path of the document to print
 * */
async function _default(documentPath) {
  const arrayOfPrinters = await _pdfToPrinter.default.list();
  console.log(arrayOfPrinters);

  _pdfToPrinter.default.print(documentPath, {
    printer: arrayOfPrinters[0]
  }).then(value => {
    console.info(`printed!\r\n${value}`);
  }).catch(reason => {
    console.error(reason);
  });
}
},{}],"saveImageFromDataUri.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveImageFromDataUri = saveImageFromDataUri;

var _fs = _interopRequireDefault(require("fs"));

var _jimp = _interopRequireDefault(require("jimp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function saveImageFromDataUri(dataUri, pathOfDirectory = "/") {
  const absolutePathOfDirectory = __dirname + pathOfDirectory;
  const pathOfImage = absolutePathOfDirectory + "out.png"; // strip off the data: url prefix to get just the base64-encoded bytes

  const base64Data = dataUri.replace(/^data:image\/\w+;base64,/, "");

  _fs.default.writeFile(pathOfImage, base64Data, 'base64', err => {
    console.log(err);
  });

  _jimp.default.read(pathOfImage).then(image => {
    return image.quality(100) // set quality
    .write(absolutePathOfDirectory + 'out.bmp'); // save
  }).catch(err => {
    console.error(err);
  });
}
},{}],"server.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _printFile = _interopRequireDefault(require("./printFile"));

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _socket = _interopRequireDefault(require("socket.io"));

var _saveImageFromDataUri = require("./saveImageFromDataUri");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PORT_CLIENT = 8080;

function _default() {
  const app = (0, _express.default)();

  const http = _http.default.createServer(app);

  const io = (0, _socket.default)(http);
  app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
  });
  app.use('/public', _express.default.static(__dirname + '/client/public'));
  http.listen(PORT_CLIENT, () => {
    console.log(`listening on *:${PORT_CLIENT}`);
  });
  io.on("connection", socket => {
    console.log("new connection");
    socket.on("printFromClient", dataUri => {
      console.log(dataUri);
      (0, _saveImageFromDataUri.saveImageFromDataUri)(dataUri, '/documents/'); // printFile(dataUri).then(() => {
      //     // action when printed file action was success
      // })
    });
  });
}
},{"./printFile":"printFile.js","./saveImageFromDataUri":"saveImageFromDataUri.js"}],"main.js":[function(require,module,exports) {
"use strict";

var _server = _interopRequireDefault(require("./server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * main function of node application
 * */
async function main() {
  (0, _server.default)();
  return "main file is running";
} // start process


main().then(console.info);
},{"./server":"server.js"}]},{},["main.js"], null)
//# sourceMappingURL=/main.js.map