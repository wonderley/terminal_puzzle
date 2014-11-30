#! /usr/local/bin/node
var Cursor = require('./cursor.js');

(function(){

"use strict";
  
function TerminalInputController(cursor){
  if (!Cursor.isValidCursor(cursor)){
    throw 'Invalid cursor';
  }
  var _cursor = cursor;
  this.onUserInput = function(input){
    if (!input || !input.full){
      return;
    }
    var key = input.full;
    // Quit on Escape, q, or Control-C.
    if (key === 'escape' || key === 'q' || key === 'C-c'){
      return process.exit(0);
    }
    if (key === 'up' || key === 'k'){
      _cursor.goUp();
    }
    if (key === 'down' || key === 'j'){
      _cursor.goDown();
    }
    if (key === 'left' || key === 'h'){
      _cursor.goLeft();
    }
    if (key === 'right' || key === 'l'){
      _cursor.goRight();
    }
    if (key === 'space'){
      _cursor.swapTiles();
    }
  };
}

if (require.main === module) {
}
  
module.exports = {
  TerminalInputController: TerminalInputController
};

})();