'use strict';

var Yadda = require('yadda');
var expect = require('../chai-helpers').expect;
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
        amount: txnSpec.amount,
        account_id: accountId,
        category_id: categoryId
    };
}

module.exports = English.library(dictionary)

    .when('I create a transaction with the following properties\n$table', function(table, next) {
        var self = this;
        var txn = specToResource(table[0], this.ctx.account.id, this.ctx.category.id);
        transactionService.createTransaction(txn)
            .then(function(createdTransaction) {
                self.ctx.transaction = createdTransaction;
                next();
            });
    })

    .when('I ask for the transaction', function(next) {
        var self = this;
        transactionService.getTransaction(this.ctx.transaction.id)
            .then(function(receivedTransaction) {
                self.ctx.transaction = receivedTransaction;
                next();
            });
    })

    .then('I should get the following transaction\n$table', function(table, next) {
        var actual = this.ctx.transaction;
        var expected = table[0];
        expect(new Date(actual.txn_date)).to.equalDate(new Date(expected.date));
        expect(actual.payee).to.equal(expected.payee);
        expect(actual.memo).to.equal(expected.memo);
        expect(actual.amount).to.almost.equal(parseFloat(expected.amount), 2);
        expect(actual.payee).to.equal(expected.payee);
        expect(actual.account.name).to.equal(expected.account);
        expect(actual.category.name).to.equal(expected.category);
        next();
    });
