define([], function() {

'use strict';

function register(module) {
  module.component('brSearchbox', {
    bindings: {
      options: '<brOptions',
      searchAction: '&brSearchAction'
    },
    controller: Ctrl,
    templateUrl:
      requirejs.toUrl('bedrock-angular-searchbox/searchbox-component.html')
  });
}

/* @ngInject */
function Ctrl($filter) {
  var self = this;
  self.searchText = '';
  var options = {
    searchbox: {
      label: 'Credential Search'
    },
    additional: [
      {
        label: 'Issued',
        placeholder: 'monday, tuesday',
        prefix: 'issued'
      },
      {
        label: 'From',
        placeholder: 'sally, bob',
        prefix: 'from'
      }
    ]
  };
  self.options = options;
  self.searchFields = {};
  self.options.additional.forEach(function(field) {
    self.searchFields[field.prefix] = '';
  });
  console.log($filter('brSearchFilters')("foo:bar baz:qux"));

  self.submitSearch = function() {
    var filteredSearch = $filter('brSearchFilters')(self.searchText.trim());
    console.log(filteredSearch);
    self.searchAction({output: filteredSearch});
  };

  self.searchFieldChanged = function(field) {
    console.log(self.searchFields[field]);
    self.searchText = "";
    for (var key in self.searchFields) {
      if (self.searchFields[key] === "") {
        continue;
      }
      var fieldText = self.searchFields[key];
      // Delimit by comma to construct prefix:text fields
      var components = fieldText.split(',');
      var queryText = "";
      components.forEach(function(component) {
        var trimmed = component.trim();
        if (trimmed.length === 0) {
          return;
        }
        if (trimmed.indexOf(' ') >= 0) {
          trimmed = '"' + trimmed + '"';
        } else {
          // If it had quotes, and now has no spaces, remove the quotes
          trimmed = trimmed.replace(/"/g,"");
        }
        queryText = queryText + key + ":" + trimmed + " ";
      });
      self.searchText = self.searchText + queryText;
    }
  };
}

return register;

});
