#! /usr/bin/env node

(function(){

"use strict";
  
function isInputDelegate(obj){
  return typeof obj.onUserInput === 'function' && 
         typeof obj.isLocked === 'boolean';
}

module.exports = {
  isInputDelegate: isInputDelegate
};

})();
