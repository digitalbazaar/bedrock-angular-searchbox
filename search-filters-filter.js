/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
// TODO: bikeshed name

/* @ngInject */
export default function factory() {
  return filterSearchInput;
}

function filterSearchInput(input) {
  let output = {};
  if(!input) {
    return output;
  }
  // Split spaces, but not spaces inside quotes
  // Regex makes sure quotes are balanced. Don't ask
  const terms = input.split(/ +(?=(?:(?:[^"]*"){2})*[^"]*$)/g);
  for(let i = 0; i < terms.length; i++) {
    const component = terms[i].replace(/"/g, ""); // Remove quotes
    if(component.indexOf(':') < 0) {
      output = {error: 'Invalid search syntax near: ' + component};
      break;
    }
    let property = component.substr(0, component.indexOf(':'));
    if(property === 'is') {
      property = 'filter';
    }
    const value = component.substr(component.indexOf(':') + 1);
    if(!(property in output)) {
      output[property] = [value];
    } else {
      output[property].push(value);
    }
  }
  return output;
}
