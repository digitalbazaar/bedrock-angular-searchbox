/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([
  'angular',
  './searchbox-component',
  './search-filters-filter'
], function(angular) {

'use strict';

var module = angular.module(
  'bedrock.searchbox', ['bedrock.alert', 'bedrock.form']);

Array.prototype.slice.call(arguments, 1).forEach(function(dep) {
  dep(module);
});

});
