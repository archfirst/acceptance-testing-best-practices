'use strict';

module.exports = function() {

    this.World = require('./support/world').World;

    this.When(/^I ask for transactions by category$/, function(callback) {
        this.goToDashboard(callback);
    });

    this.Then(/^I should get the following summary of transactions by category$/, function(table, callback) {
        this.assertTransactionsByCategory(table.hashes(), callback);
    });
};
