#! /usr/bin/env node

(function(){

"use strict";
  
function isInputDelegate(obj){
  return typeof obj.onUserInput === 'function';
}

module.exports = {
  isInputDelegate: isInputDelegate
};

})();
