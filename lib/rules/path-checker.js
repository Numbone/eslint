/**
 * @fileoverview fsd relative path
 * @author nur
 */

const path = require('path');

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "fsd relative path",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
    return {
      ImportDeclaration(node){


        const importTo=node.source.value;

        const fromFilename=context.getFilename();

        if(shouldBeRelative(fromFilename,importTo)){ 
          context.report({node: node,messageId:'relative'})
        }
      }
    };
  },
};


function isPathRelative(path){
  return path ===  '.' || path.startWith('./') || path.startsWith('../');
}

const layers={
  'entities': 'entities',
  'widjet': 'widjet',
  'app': 'app',
  'shared':'shared',
  'features': 'features',
}

function shouldBeRelative(from ,to){
  if(isPathRelative){
    return false;
  }

  const toArray=to.split('/');

  const toLayer=toArray[0];
  
  const toSlice=toArray[1];

  if(!toLayer  || !toSlice ||!layers[toLayer]){
    return false;
  }

  const normalized = path.toNamespacedPath(from);

  const projectFrom=normalized.split('src')[1];

  const fromArray=projectFrom.split('\\');

  const fromLayer=fromArray[1];

  const fromSlice=fromArray[2];

  if(!fromLayer  || !fromSlice ||!layers[fromLayer]){
    return false;
  }
   
  return fromSlice === toSlice && toLayer === fromLayer;
}