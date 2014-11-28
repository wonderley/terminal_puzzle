#! /usr/local/bin/node
var Cursor = require('./cursor.js');

(function(){

"use strict";
  
function InputController(cursor){
  if (!Cursor.isValidCursor(cursor)){
    throw 'Invalid cursor';
  }
  var _cursor = cursor;
}
  
if (require.main === module) {
}
  
module.exports = {
  InputController: InputController
};

})();