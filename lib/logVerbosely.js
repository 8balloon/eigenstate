"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logVerbosely = logVerbosely;
function logVerbosely(details) {
  var key = details.key;
  var path = details.path;
  var payload = details.payload;
  var contextStateAtPath = details.contextStateAtPath;
  var localChangeResults = details.localChangeResults;
  var newLocalState = details.newLocalState;


  console.log("CHANGE DETAILS:", details);
}