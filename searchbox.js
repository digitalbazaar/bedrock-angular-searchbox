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

var module = angular.module('bedrock.searchbox', []);

Array.prototype.slice.call(arguments, 1).forEach(function(dep) {
  dep(module);
});

module.filter('brSearchFilters', function() {
  return function(input) {
    return filterSearchInput(input);
  };

  function filterSearchInput(input) {
    var output = {};
    console.log(input);
    // Split spaces, but not spaces inside quotes
    // Regex makes sure quotes are balanced. Don't ask
    input.split(/ +(?=(?:(?:[^"]*"){2})*[^"]*$)/g).forEach(function(component) {
      console.log(component);
      component = component.replace(/"/g, ""); // Remove quotes
      var splitComponent = component.split(':', 2);
      console.log('split: :',  splitComponent);
      if (!output[splitComponent[0]]) {
        output[splitComponent[0]] = splitComponent[1];
        return;
      }
      output[splitComponent[0]] =
        output[splitComponent[0]] + ',' + splitComponent[1];
    });
    return output;
  }
});

return module.name;

});
