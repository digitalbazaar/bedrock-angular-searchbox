/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';

export default {
  bindings: {
    options: '<?brOptions',
    onSearch: '&brOnSearch'
  },
  controller: Ctrl,
  templateUrl: 'bedrock-angular-searchbox/searchbox-component.html',
  transclude: {
    help: '?brSearchboxHelp'
  }
};

/* @ngInject */
function Ctrl($filter, $q, $scope, $transclude, brAlertService) {
  const self = this;

  const defaultOptions = {
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

  self.$onInit = () => {
    self.loading = false;
    self.searchOptions = {};
    self.searchText = '';
    self.display = {
      helpButton: false,
      helpText: false
    };

    self.display.helpButton = $transclude.isSlotFilled('help');

    angular.extend(self.searchOptions, self.options, defaultOptions);
    self.searchFields = {};
    self.searchOptions.additional.forEach(field => {
      self.searchFields[field.prefix] = '';
    });
  };

  self.submitSearch = () => {
    brAlertService.clear();
    const filteredSearch = $filter('brSearchFilters')(self.searchText.trim());
    if('error' in filteredSearch) {
      return brAlertService.add('error', filteredSearch.error);
    }
    self.loading = true;
    $q.resolve(self.onSearch({query: filteredSearch}))
      .catch(() => {})
      .then(() => {
        self.loading = false;
      });
  };

  self.searchFieldChanged = () => {
    self.searchText = '';
    for(const key in self.searchFields) {
      if(self.searchFields[key] === '') {
        continue;
      }
      const fieldText = self.searchFields[key];
      // Delimit by comma to construct prefix:text fields
      const components = fieldText.split(',');
      let queryText = '';
      components.forEach(component => {
        let trimmed = component.trim();
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
