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
  fs.readdir(exports.dataDir, (err, files) => {
    if ( err ) {
      throw err;
    } else {

      var array = _.map(files, (text, index) => {
        var id = zeroPaddedNumber(index + 1);
        var filePath = path.join(exports.dataDir, `${id}.txt`);
        text = text.slice(0, -4);
        var file = {id, text};
        fs.readFile(filePath, (err, contents) => {
          if (err) {
            throw err;
          } else {
            //edit the object
            file.text = contents;
          }
        });
        return file;
      });
      // Promise.all(array).then(array => callback(null, array));
      callback(null, array);
    }
  });

};

exports.readOne = (id, callback) => {
  var text = items[id];
  //find file path using id
  var filePath = path.join(exports.dataDir, `${id}.txt`);

  //fs.readFile
  fs.readFile(filePath, 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  }
  );
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