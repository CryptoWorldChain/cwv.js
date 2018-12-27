import _ from 'lodash';

import cwv from './cwv/brewchain.js'

window.cwv = cwv;

function component() {
    let element = document.createElement('div');
    element.innerHTML = _.join(['Hello', 'webpack'
    	], ' ');
   	return element;
 }


document.body.appendChild(component());

