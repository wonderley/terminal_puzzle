#! /usr/local/bin/node

(function(){

"use strict";
  
function isGridDelegate(obj){
  return typeof obj.onGridChanged === 'function';
}

module.exports = {
  isGridDelegate: isGridDelegate
};

})();