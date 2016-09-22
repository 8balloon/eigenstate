'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tooManyUpdateArguments = tooManyUpdateArguments;
exports.newStateLacksShapeOfOriginalState = newStateLacksShapeOfOriginalState;
exports.updateFunctionWasChanged = updateFunctionWasChanged;
var documentationURL = exports.documentationURL = 'https://github.com/8balloon/switchless/blob/master/README.md';

var noProviderUpdatesProp = exports.noProviderUpdatesProp = 'Switchless Provider requires an "updates" property';
var updatesLeavesNotFunctions = exports.updatesLeavesNotFunctions = 'Switchless Provider.props.updates must contain values that are Functions';
var middlewareIsNotFunction = exports.middlewareIsNotFunction = 'Switchless Provider middleware must be a Function';

function tooManyUpdateArguments(key, path) {
  return 'Update "' + key + '" at path "' + path + '" was called with multiple arguments. Updates may only be invoked with a single argument; see ' + documentationURL;
}

function newStateLacksShapeOfOriginalState(key, path, prop) {
  return 'Update "' + key + '" at path "' + path + '" returned a state which lacks property "' + prop + '". You cannot remove properties defined via Provider.updates.';
}

function updateFunctionWasChanged(key, path, prop) {
  return 'Update "' + key + '" at path "' + path + '" returned a state which lacks the original update function with key "' + prop + '". You cannot change udpate functions at runtime.';
}