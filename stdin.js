#! /usr/local/bin/node
process.stdin.on('data', processInput);

function processInput (buf) {
  for (var ii = 0; ii < buf.length; ii++) {
    console.log(buf.readUInt8(ii));
  }
}
