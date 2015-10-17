'use strict';

var chai = require('chai');

// Extend Chai with assertions about promises
chai.use(require('chai-as-promised'));

// Exports
module.exports = {
    expect: chai.expect,
    should: chai.should()
};
