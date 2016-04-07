/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

/* @ngInject */
function factory(config, $filter) {
  return {
    restrict: 'E',
    scope: {
      options: '=brOptions',
      searchCallback: '&brSearchCallback'
    },
    templateUrl: requirejs.toUrl(
      'bedrock-angular-searchbox/searchbox.html'),
    link: Link
  };

  function Link(scope) {
    var options = {
      searchbox: {
        label: 'Credential Search'
      },
      additional: [
        {
          label: 'Issued',
          placeholder: 'monday, tuesday',
          prefix: 'issued',
        },
        {
          label: 'From',
          placeholder: 'sally, bob',
          prefix: 'from',
        }
      ]
    }
    var model = scope.model = {};
    model.options = options;
    model.searchFields = {};
    model.options.additional.forEach(function(field) {
      model.searchFields[field.prefix] = '';
    })
    console.log($filter('brSearchFilters')("foo:bar baz:qux"));
    
    model.submitSearch = function() {
      var filteredSearch = $filter('brSearchFilters')(scope.searchText.trim())
      console.log(filteredSearch);
      scope.searchCallback({output: filteredSearch});
    }

    model.searchFieldChanged = function(field) {
      console.log(model.searchFields[field]);
      scope.searchText = "";
      for (var key in model.searchFields) {
        if (model.searchFields[key] == "") {
          continue;
        }
        var fieldText = model.searchFields[key];
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
            trimmed = trimmed.replace(/"/g,"")
          }
          queryText = queryText + key + ":" + trimmed + " ";
        })
        scope.searchText = scope.searchText + queryText;
      }
    }
  }
}

return {brSearchbox: factory};

});
