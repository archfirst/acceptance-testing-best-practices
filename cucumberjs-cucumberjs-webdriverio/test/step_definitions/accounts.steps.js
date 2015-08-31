'use strict';

module.exports = function() {

    this.World = require('./support/world').World;

    this.Given(/^an account called "([^"]*)"$/, function(name, callback) {
        this.createAccount(name, callback);
    });

    this.Given(/^the following accounts$/, function (table, callback) {
        this.createAccounts(table.hashes(), callback);
    });

    this.When(/^I change the account name to "([^"]*)"$/, function (newName, callback) {
        this.changeAccountName(newName, callback);
    });

    this.Then(/^the account list should show an account called "([^"]*)"$/, function (name, callback) {
        this.assertAccountExists(name, callback);
    });
};
