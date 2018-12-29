'use strict';

var ecc = exports;

ecc.version = require('./package.json').version;
ecc.utils = require('./utils');
ecc.rand = ecc.utils.randomArray;
ecc.curve = require('./curve');
ecc.curves = require('./curves');

// Protocols
ecc.ec = require('./ec');
ecc.eddsa = require('./eddsa');
