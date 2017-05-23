/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';
import SearchboxComponent from './searchbox-component.js';
import SearchFiltersFilter from './search-filters-filter.js';

var module = angular.module(
  'bedrock.searchbox', ['bedrock.alert', 'bedrock.form']);

module.component('brSearchbox', SearchboxComponent);
module.filter('brSearchFilters', SearchFiltersFilter);
