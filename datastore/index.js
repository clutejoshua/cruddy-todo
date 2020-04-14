const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const sprintf = require('sprintf-js').sprintf;

var items = {};

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
//var id = counter.getNextUniqueId(callback?)
//var filename = `exports.dataDir/${id}.txt`
//fs.writeFile(filename, text, (err) => {})

  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw err;
    } else {
      // fs.writeFile to create a new file and store text on that file
      var filename = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFile(filename, text, (err) => {
        if (err) {
          throw err;
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {

  /*
{ 0: "000.txt"
  1: "0001.txt"
}
*/

  var directory = exports.dataDir;

  _.map(directory, (text, index) => {
    var filename = zeroPaddedNumber(index + 1);
    var filePath = path.join(exports.dataDir, `${filename}.txt`);
    fs.readFile(filePath, (err, text) => {
      if (err) {
        throw err;
      } else {
        callback(null, { filename, text });
      }
    });

  });

  // set map to a variable then do something with that variable
  // look at promise.all() and different fs.read functions
  //

  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });

  // callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};


// exports.create = (text, callback) => {
//   var id = counter.getNextUniqueId();
//
//   items[id] = text;
//   callback(null, { id, text });
// };