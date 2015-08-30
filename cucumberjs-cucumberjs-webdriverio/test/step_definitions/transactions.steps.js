'use strict';

module.exports = function() {

    this.World = require('./support/world').World;

    this.Given(/^a transaction with the following properties$/, function(table, callback) {
        this.createTransaction(table.hashes()[0], callback);
    });

    this.When(/^I change the transaction amount to \-(\d+)\.(\d+)$/, function (arg1, arg2, callback) {
        //this.changeTransactionAmount(amount, callback);
        callback.pending();
    });

    this.When(/^I delete the transaction$/, function (callback) {
        //this.deleteTransaction(callback);
        callback.pending();
    });

    this.Then(/^the transaction list should show the following transaction$/, function (table, callback) {
        this.assertTransactionExists(table.hashes()[0], callback);
    });

    this.Then(/^the transaction should not exist$/, function (callback) {
        //this.assertTransactionDoesNotExist(callback);
        callback.pending();
    });
};
