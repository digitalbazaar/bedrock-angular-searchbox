define(['angular'], function(angular) {

'use strict';

function register(module) {
  module.component('brSearchbox', {
    bindings: {
      options: '<brOptions',
      onSearch: '&brOnSearch'
    },
    controller: Ctrl,
    templateUrl:
      requirejs.toUrl('bedrock-angular-searchbox/searchbox-component.html')
  });
}

/* @ngInject */
function Ctrl($filter, $scope, brAlertService) {
  var self = this;
  self.loading = false;
  self.searchOptions = {};
  self.searchText = '';
  var defaultOptions = {
    searchbox: {
      placeholder: 'Search...'
    },
    additional: [
      // {
      //   label: 'Issued',
      //   placeholder: 'monday, tuesday',
      //   prefix: 'issued'
      // },
      // {
      //   label: 'From',
      //   placeholder: 'sally, bob',
      //   prefix: 'from'
      // }
    ]
  };
  angular.extend(self.searchOptions, self.options, defaultOptions);
  self.searchFields = {};
  self.searchOptions.additional.forEach(function(field) {
    self.searchFields[field.prefix] = '';
  });

  self.submitSearch = function() {
    var filteredSearch = $filter('brSearchFilters')(self.searchText.trim());
    if('error' in filteredSearch) {
      return brAlertService.add('error', filteredSearch.error);
    }
    self.loading = true;
    Promise.resolve(self.onSearch({query: filteredSearch}))
      .catch(function() {})
      .then(function() {
        self.loading = false;
        $scope.$apply();
      });
  };

  self.searchFieldChanged = function() {
    self.searchText = '';
    for(var key in self.searchFields) {
      if(self.searchFields[key] === '') {
        continue;
      }
      var fieldText = self.searchFields[key];
      // Delimit by comma to construct prefix:text fields
      var components = fieldText.split(',');
      var queryText = '';
      components.forEach(function(component) {
        var trimmed = component.trim();
        if(trimmed.length === 0) {
          return;
        }
        if(trimmed.indexOf(' ') >= 0) {
          trimmed = '"' + trimmed + '"';
        } else {
          // If it had quotes, and now has no spaces, remove the quotes
          trimmed = trimmed.replace(/"/g, '');
        }
        queryText = queryText + key + ':' + trimmed + ' ';
      });
      self.searchText = self.searchText + queryText;
    }
  };
}

return register;

});
