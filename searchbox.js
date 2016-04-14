/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([
  'angular',
  './searchbox-component'
], function(
  angular,
  searchboxComponent) {

'use strict';

var module = angular.module('bedrock.searchbox', ['bedrock.alert']);

Array.prototype.slice.call(arguments, 1).forEach(function(dep) {
  dep(module);
});

module.filter('brSearchFilters', function() {
  return function(input) {
    return filterSearchInput(input);
  };

  function filterSearchInput(input) {
    var output = {};
    if(!input) {
      return output;
    }
    // Split spaces, but not spaces inside quotes
    // Regex makes sure quotes are balanced. Don't ask
    var terms = input.split(/ +(?=(?:(?:[^"]*"){2})*[^"]*$)/g);
    for(var i = 0; i < terms.length; i++) {
      var component = terms[i].replace(/"/g, ""); // Remove quotes
      if(component.indexOf(':') < 0) {
        output = {error: 'Invalid search syntax near: ' + component};
        break;
      }
      var splitComponent = {};
      var property = component.substr(0, component.indexOf(':'));
      if(property === 'is') {
        property = 'filter';
      }
      var value = component.substr(component.indexOf(':') + 1);
      if(!(property in output)) {
        output[property] = [value];
      } else {
        output[property].push(value);
      }
    }
    return output;
  }
});

return module.name;

});
