'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tooManyChangeArguments = tooManyChangeArguments;
exports.newStateLacksShapeOfOriginalState = newStateLacksShapeOfOriginalState;
exports.changeFunctionWasChanged = changeFunctionWasChanged;
var documentationURL = exports.documentationURL = 'https://github.com/8balloon/switchless/blob/master/README.md';

var noProviderChangesProp = exports.noProviderChangesProp = 'Switchless Provider requires an "changes" property';
var changesLeavesNotFunctions = exports.changesLeavesNotFunctions = 'Switchless Provider.props.changes must contain values that are Functions';
var onChangePropIsNotFunction = exports.onChangePropIsNotFunction = 'Switchless Provider onChange must be a Function';

function tooManyChangeArguments(key, path) {
  return 'Change "' + key + '" at path "' + path + '" was called with multiple arguments. Changes may only be invoked with a single argument; see ' + documentationURL;
}

function newStateLacksShapeOfOriginalState(key, path, prop) {
  return 'Change "' + key + '" at path "' + path + '" returned a state which lacks property "' + prop + '". You cannot remove properties defined via Provider.changes.';
}

function changeFunctionWasChanged(key, path, prop) {
  return 'Change "' + key + '" at path "' + path + '" returned a state which lacks the original change function with key "' + prop + '". You cannot change udpate functions at runtime.';
}