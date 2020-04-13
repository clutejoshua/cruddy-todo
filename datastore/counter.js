const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  readCounter((err, number) => {
    if (err) {
      console.log('Error getting unique ID');
    } else {
      counter = number + 1;
      writeCounter(counter, (err, paddedString) => {
        //set counter on page to equal number
        if (err) {
          console.log('writeCounter Error');
        } else {
          // console.log('Counter saved to Server');
          callback(null, paddedString);
        }
      });
    }
  });

  return zeroPaddedNumber(counter);
};


// exports.getNextUniqueId = (callback) => {
//   // use read counter function to read file
//   readCounter((err, fileData) => {
//     // get current counter number
//     // if there is an error
//     if (err) {
//       // run the callback
//       callback(null, 0);
//       // otherwise
//     } else {
//       // write counter file after having added 1 to counter
//       counter = fileData + 1;
//       writeCounter(counter, callback);
//     }
//   });
// };

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
