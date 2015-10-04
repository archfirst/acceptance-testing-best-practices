'use strict';

var expect = require('./chai-helpers').expect;
var accountService = require('../services/account.service');
var categoryService = require('../services/category.service');
var transactionService = require('../services/transaction.service');

describe('Transactions API', function() {

    var account = null;
    var category = null;

    function toResource(txn) {
        return {
            id: txn.id,
            txn_date: new Date(txn.txn_date),
            payee: txn.payee,
            memo: txn.memo,
            amount: txn.amount,
            account_id: txn.account.id,
            category_id: txn.category.id
        };
    }

    /* ----- Background ----- */
    // Given an account called "Amazon VISA"
    // And a category called "Auto & Transport"
    beforeEach(function() {
        // Given an account called "Amazon VISA"
        return accountService.createAccount('Amazon VISA')

            // And a category called "Auto & Transport"
            .then(function(createdAccount) {
                account = createdAccount;
                return categoryService.createCategory('Auto & Transport');
            })

            .then(function(createdCategory) {
                category = createdCategory;
            });
    });

    // ----- Transaction Creation -----
    it('should allow the creation of a transaction', function() {

        // When I create a transaction with the following properties
        var transaction = {
            txn_date: new Date('2015-02-01T00:00Z'),
            payee: 'Chevron Gas Station',
            memo: 'Gas',
            amount: -30.00,
            account_id: account.id,
            category_id: category.id
        };
        return transactionService.createTransaction(transaction)

        // And I ask for the transaction
        .then(function(createdTransaction) {
            transaction.id = createdTransaction.id;
            return transactionService.getTransaction(transaction.id);
        })

        // Then I should get the same transaction back
        .then(function(receivedTransaction) {
            expect(toResource(receivedTransaction)).to.deep.equal(transaction);
        });
    });

    // ----- Transaction Update -----
    it('should allow the update a transaction', function() {

        // When I create a transaction with the following properties
        var transaction = {
            txn_date: new Date('2015-02-01T00:00Z'),
            payee: 'Chevron Gas Station',
            memo: 'Gas',
            amount: -30.00,
            account_id: account.id,
            category_id: category.id
        };
        return transactionService.createTransaction(transaction)

            // When I change the transaction amount to -50.00
            .then(function(createdTransaction) {
                transaction.id = createdTransaction.id;
                transaction.amount = -50.00;
                return transactionService.updateTransaction(transaction);
            })

            // And I ask for the transaction
            .then(function() {
                return transactionService.getTransaction(transaction.id);
            })

            // Then I should get the updated transaction back
            .then(function(receivedTransaction) {
                expect(toResource(receivedTransaction)).to.deep.equal(transaction);
            });
    });

    // ----- Transaction Deletion -----
    it('should allow the deletion of a transaction', function() {

        // When I create a transaction with the following properties
        var transaction = {
            txn_date: new Date('2015-02-01T00:00Z'),
            payee: 'Chevron Gas Station',
            memo: 'Gas',
            amount: -30.00,
            account_id: account.id,
            category_id: category.id
        };
        return transactionService.createTransaction(transaction)

            // When I delete the transaction
            .then(function(createdTransaction) {
                transaction.id = createdTransaction.id;
                return transactionService.deleteTransaction(transaction.id);
            })

            // Then the transaction should not exist
            .then(function() {
                return expect(transactionService.getTransaction(transaction.id))
                    .to.eventually.be.rejectedWith('Not found');
            });
    });
});
