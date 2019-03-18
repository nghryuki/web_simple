"use strict";

function test(cb) {
  console.log('test');
  cb();
}

test(function () {
  console.log('callback');
});