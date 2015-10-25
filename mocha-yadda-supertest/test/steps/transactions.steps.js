'use strict';

var _ = require('lodash');
var Yadda = require('yadda');
var expect = require('./common/chai-helpers').expect;
var transactionService = require('./services/transaction.service');

var English = Yadda.localisation.English;
var Dictionary = Yadda.Dictionary;

var dictionary = new Dictionary()
    .define('table', /([^\u0000]*)/, Yadda.converters.table);

function specToResource(txnSpec, accountId, categoryId) {
    return {
        txn_date: new Date(txnSpec.date),
        payee: txnSpec.payee,
        memo: txnSpec.memo,
        amount: parseFloat(txnSpec.amount),
        account_id: accountId,
        category_id: categoryId
    };
}

function receivedToResource(received) {
    return {
        id: received.id,
        txn_date: new Date(received.txn_date),
        payee: received.payee,
        memo: received.memo,
        amount: parseFloat(received.amount),
        account_id: received.account.id,
        category_id: received.category.id
    };
}

function receivedToResources(receivedList) {
    var txns = [];
    _.each(receivedList, function(received) {
        txns.push(receivedToResource(received));
    });
    return txns;
}

module.exports = English.library(dictionary)

    .when('I create a transaction with the following properties\n$table', function(table, next) {
        var self = this;
        var txn = specToResource(table[0], this.ctx.account.id, this.ctx.category.id);
        transactionService.createTransaction(txn)
            .then(function(createdTransaction) {
                self.ctx.transaction = receivedToResource(createdTransaction);
                next();
            });
    })

    .when('I ask for the transaction', function(next) {
        var self = this;
        transactionService.getTransaction(this.ctx.transaction.id)
            .then(function(receivedTransaction) {
                self.ctx.transaction = receivedToResource(receivedTransaction);
                next();
            });
    })

    .then('I should get the following transaction\n$table', function(table, next) {
        var actual = this.ctx.transaction;
        var expected = specToResource(table[0], this.ctx.account.id, this.ctx.category.id);
        expected.id = actual.id; // expected does not have a id, just add one
        expect(actual).to.deep.equal(expected);
        next();
    })

    .given('a transaction with the following properties\n$table', function(table, next) {
        var self = this;
        var txn = specToResource(table[0], this.ctx.account.id, this.ctx.category.id);
        transactionService.createTransaction(txn)
            .then(function(createdTransaction) {
                self.ctx.transaction = receivedToResource(createdTransaction);
                next();
            });
    })

    .when('I change the transaction amount to $amount', function(amount, next) {
        var self = this;
        this.ctx.transaction.amount = amount;
        transactionService.updateTransaction(this.ctx.transaction)
            .then(function(receivedTransaction) {
                self.ctx.transaction = receivedToResource(receivedTransaction);
                next();
            });
    })

    .when('I delete the transaction', function(next) {
        transactionService.deleteTransaction(this.ctx.transaction.id)
            .then(function() {
                next();
            });
    })

    .then('the transaction should not exist', function(next) {
        expect(transactionService.getTransaction(this.ctx.transaction.id))
            .to.eventually.be.rejected;
        next();
    })

    .given('the following transactions\n$table', function(txnSpecs, next) {
        var self = this;

        // Convert transaction specs to resources
        var txns = [];
        _.each(txnSpecs, function(txnSpec) {
            var accountId = _.findWhere( self.ctx.accounts, {name: txnSpec.account} ).id;
            var categoryId = _.findWhere( self.ctx.categories, {name: txnSpec.category} ).id;
            txns.push(specToResource(txnSpec, accountId, categoryId));
        });

        // Create transactions
        transactionService.createTransactions(txns)
            .then(function(createdTransactions) {
                self.ctx.transactions = receivedToResources(createdTransactions);
                next();
            });
    })

    .when('I ask for transactions by category with start date of $start and end date of $end', function(start, end, next) {
        var self = this;
        transactionService.getTransactionsByCategory(new Date(start), new Date(end))
            .then(function(transactionsByCategory) {
                self.ctx.transactionsByCategory = transactionsByCategory;
                next();
            });
    })

    .then('I should get the following summary of transactions by category\n$table', function(expectedItems, next) {
        var self = this;
        _.each(expectedItems, function(expectedItem) {
            var actualItem =  _.findWhere( self.ctx.transactionsByCategory, {cat_name: expectedItem.category} );
            expect(actualItem.amount).to.equal(parseFloat(expectedItem.amount));
        });
        next();
    });