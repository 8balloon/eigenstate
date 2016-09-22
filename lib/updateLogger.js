'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateLogger = updateLogger;
function updateLogger(executeUpdate, payload, extras) {
  var path = extras.path;
  var key = extras.key;


  console.log("UPDATE:", path.join('.') + '.' + key);
  console.log("PAYLOAD:", payload);

  executeUpdate(payload);
}