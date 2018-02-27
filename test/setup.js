'use strict';

const chai = require('chai');
const sinonChai = require('sinon-chai');

// Add chai plugins.
chai.use(sinonChai);

// Add test lib globals.
global.expect = chai.expect;

// Force NODE_ENV. Some things like caches behave differently.
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
