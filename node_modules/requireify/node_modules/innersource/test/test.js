'use strict';

var fs = require('fs');
var assert = require('assert');
var innersource = require('../index');

function test1() {
  console.log('hello');
}

assert.equal(innersource(test1).trim(), "console.log('hello');");

var test2 = function () {
  console.log('hello');
};

assert.equal(innersource(test2).trim(), "console.log('hello');");

var test3 = function test() {
  console.log('hello');
};

assert.equal(innersource(test3).trim(), "console.log('hello');");

function   test4() {
  console.log('hello');
}

assert.equal(innersource(test4).trim(), "console.log('hello');");

function test5() {}

assert.equal(innersource(test5).trim(), "");

function test6() {
}

assert.equal(innersource(test6).trim(), "");

function test7() {
  if (true) {
    console.log('abc');
  }
}

assert.equal(innersource(test7).trim(), "if (true) {\n    console.log(\'abc\');\n  }");

function test8(arg1) {
  if (true) {
    console.log('abc');
  }
}

assert.equal(innersource(test8).trim(), "if (true) {\n    console.log(\'abc\');\n  }");

function test9(arg1, arg2) {
  if (true) {
    console.log('abc');
  }
}

assert.equal(innersource(test9).trim(), "if (true) {\n    console.log(\'abc\');\n  }");


function test10(){return "what you expect";}

test10.toString = function(){
  return "!what you get;";
};

assert.equal(innersource(test10).trim(), "return \"what you expect\";");

function test11(arg1 /*LKAJSD*/){
  console.log('hello');
}

assert.equal(innersource(test11).trim(), "console.log('hello');");

function $test12(){
  console.log('hello');
}

assert.equal(innersource($test12).trim(), "console.log('hello');");
