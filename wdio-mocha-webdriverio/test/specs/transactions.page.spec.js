'use strict';

var expect = require('./chai-helpers').expect;
var AccountsPage = require('../pages/accounts.page');
var CategoriesPage = require('../pages/categories.page');
var TransactionsPage = require('../pages/transactions.page');

describe('Transactions page', function() {

    var page;

    beforeEach(function *() {
        page = new TransactionsPage();

        /* ----- Background ----- */
        // Given an account called "Amazon VISA"
        var accountsPage = new AccountsPage();
        yield accountsPage.createAccount('Amazon VISA');

        // And a category called "Auto & Transport"
        var categoriesPage = new CategoriesPage();
        yield categoriesPage.createCategory('Auto & Transport');
    });

    it('should allow the creation of a transaction', function *() {
        // Given a transaction with the following properties
        var transaction = {
            account: 'Amazon VISA',
            date: '02/01/2015',
            payee: 'Chevron Gas Station',
            memo: 'Gas',
            category: 'Auto & Transport',
            payment: '30.00',
            deposit: ''
        };
        yield page.createTransaction(transaction);

        // Then the transactions page should show the transaction
        var result = yield page.getTransactionForPayee(transaction.account, transaction.payee);
        expect(result).to.deep.equal(transaction);
    });

    it('should allow changing the payment amount of a transaction', function *() {
        // Given a transaction with the following properties
        var transaction = {
            account: 'Amazon VISA',
            date: '02/01/2015',
            payee: 'Chevron Gas Station',
            memo: 'Gas',
            category: 'Auto & Transport',
            payment: '30.00',
            deposit: ''
        };
        yield page.createTransaction(transaction);

        // When I change the payment amount to 50.00
        transaction.payment = '50.00';
        yield page.changePaymentAmount(transaction.account, transaction.payee, transaction.payment);

        // Then the transactions page should show the modified transaction
        var result = yield page.getTransactionForPayee(transaction.account, transaction.payee);
        expect(result).to.deep.equal(transaction);
    });

    it('should allow the deletion of a transaction', function *() {
        // Given a transaction with the following properties
        var transaction = {
            account: 'Amazon VISA',
            date: '02/01/2015',
            payee: 'Chevron Gas Station',
            memo: 'Gas',
            category: 'Auto & Transport',
            payment: '30.00',
            deposit: ''
        };
        yield page.createTransaction(transaction);

        // When I delete the transaction
        yield page.deleteTransaction(transaction.account, transaction.payee);

        // Then the transaction should not exist
        var exists = yield page.doesTransactionExist(transaction.account, transaction.payee);
        expect(exists).to.be.false;
    });
});
