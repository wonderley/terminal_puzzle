#! /usr/bin/env node

(function(){

"use strict";
  
function isGridDelegate(obj){
  var ret = typeof obj.onGridChanged === 'function';
  ret = ret && typeof obj.onGameOver === 'function';
  return ret;
}

module.exports = {
  isGridDelegate: isGridDelegate
};

})();
