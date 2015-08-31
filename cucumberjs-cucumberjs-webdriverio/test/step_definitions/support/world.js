/* jshint expr: true */
'use strict';

var Promise = require('bluebird');
var expect = require('./chai-helpers').expect;

var World = function World(callback) {
    // ----- Cached objects -----
    this.account = undefined;
    this.category = undefined;
    this.transaction = undefined;

    // ----- Accounts -----
    this.createAccount = function(name, callback) {
        this.account = { name: name };
        this.client
            .url('/settings/accounts')
            .setValue('.accountAddForm-name', name)
            .click('.accountAddForm button')
            .call(callback);
    };

    this.createAccounts = function(accounts, callback) {

        var self = this;

        this.client
            .url('/settings/accounts')
            .then(function() {
                return Promise.each(accounts, function(account) {
                    return self.client
                        .setValue('.accountAddForm-name', account.name)
                        .click('.accountAddForm button');
                })
            })
            .call(callback);
    };

    this.changeAccountName = function(newName, callback) {

        // This approach has a lot of repetition because we are not saving the list-item element
        // See the alternate approach below.
        //this.client
        //    .url('/settings/accounts')
        //    .element('.accountView=' + this.account.name).click('..')
        //    .element('.accountView=' + this.account.name).element('..').setValue('.accountForm-name', newName)
        //    .element('.accountView=' + this.account.name).element('..').submitForm('.accountForm')
        //    .call(callback);

        var self = this;

        var liElement = null;
        var accountFormNameElement = null;

        this.client
            .url('/settings/accounts')
            .element('.accountView=' + this.account.name).element('..')
            .then(function(res) {
                // Click the list item
                liElement = res.value.ELEMENT;
                return self.client.elementIdClick(liElement);
            })
            .then(function() {
                return self.client.elementIdElement(liElement, '.accountForm-name');
            })
            .then(function(res) {
                // Clear the existing account name from the form field
                accountFormNameElement = res.value.ELEMENT;
                return self.client.elementIdClear(accountFormNameElement);
            })
            .then(function() {
                // Fill in the new account name
                return self.client.elementIdValue(accountFormNameElement, newName);
            })
            .then(function() {
                return self.client.elementIdElement(liElement, '.accountForm');
            })
            .then(function(res) {
                // Submit the form
                return self.client.submit(res.value.ELEMENT);
            })
            .call(callback);
    };

    this.assertAccountExists = function(expectedName, callback) {

        // This approach is a bit of hand-waving because any accountView that "contains" the expected name will match
        //this.client
        //    .url('/settings/accounts')
        //    .getText('.accountView')
        //    .should.eventually.contain(expectedName)
        //    .notify(callback);

        this.client
            .url('/settings/accounts')
            .element('.accountView=' + expectedName)
            .call(callback);
    };

    // ----- Categories -----
    this.createCategory = function(name, callback) {
        this.category = { name: name };
        this.client
            .url('/settings/categories')
            .setValue('.categoryAddForm-name', name)
            .click('.categoryAddForm button')
            .call(callback);
    };

    this.createCategories = function(categories, callback) {

        var self = this;

        this.client
            .url('/settings/categories')
            .then(function() {
                return Promise.each(categories, function(category) {
                    return self.client
                        .setValue('.categoryAddForm-name', category.name)
                        .click('.categoryAddForm button');
                })
            })
            .call(callback);
    };

    this.changeCategoryName = function(newName, callback) {

        var self = this;

        var liElement = null;
        var categoryFormNameElement = null;

        this.client
            .url('/settings/categories')
            .element('.categoryView=' + this.category.name).element('..')
            .then(function(res) {
                // Click the list item
                liElement = res.value.ELEMENT;
                return self.client.elementIdClick(liElement);
            })
            .then(function() {
                return self.client.elementIdElement(liElement, '.categoryForm-name');
            })
            .then(function(res) {
                // Clear the existing category name from the form field
                categoryFormNameElement = res.value.ELEMENT;
                return self.client.elementIdClear(categoryFormNameElement);
            })
            .then(function() {
                // Fill in the new category name
                return self.client.elementIdValue(categoryFormNameElement, newName);
            })
            .then(function() {
                return self.client.elementIdElement(liElement, '.categoryForm');
            })
            .then(function(res) {
                // Submit the form
                return self.client.submit(res.value.ELEMENT);
            })
            .call(callback);
    };

    this.assertCategoryExists = function(expectedName, callback) {
        this.client
            .url('/settings/categories')
            .element('.categoryView=' + expectedName)
            .call(callback);
    };

    // ----- Transaction -----
    function _createTransaction(client, transaction) {

        var amount = (transaction.payment.length > 0) ? transaction.payment : transaction.deposit;
        var amountElement = (transaction.payment.length > 0) ? 'payment' : 'deposit';
        var txn_date = transaction.date.replace(/\//g, '');  // remove slashes

        return client
            .url('/accounts')
            .element('.accountsPanel ul').click('a=' + transaction.account)
            .waitForExist('.transactionsPanel')
            .click('.transactionsPanel button')
            .pause(300) // wait for dialog box animation to complete
            .element('form[name=transactionForm]').click('#txn_date').keys(txn_date)
            .setValue('form[name=transactionForm] #payee', transaction.payee)
            .setValue('form[name=transactionForm] #memo', transaction.memo)
            .selectByVisibleText('form[name=transactionForm] #category', transaction.category)
            .setValue('form[name=transactionForm] #' + amountElement, amount)
            .element('form[name=transactionForm]').click('button=OK');
    }

    this.createTransaction = function(transaction, callback) {
        this.transaction = transaction;

        _createTransaction(this.client, transaction)
            .call(callback);
    };

    this.createTransactions = function(transactions, callback) {

        var self = this;

        return Promise.each(transactions, function(transaction) {
            return _createTransaction(self.client, transaction);
        })
        .then(function() {
            callback();
        });
    };

    this.changePaymentAmount = function(newAmount, callback) {

        var self = this;

        this.client
            .url('/accounts')
            .element('.accountsPanel ul').click('a=' + this.transaction.account)
            .waitForExist('.transactionsPanel')
            .element('.transactions-columnPayee=' + this.transaction.payee).element('..')
            .then(function(res) {
                return self.client.elementIdClick(res.value.ELEMENT);
            })
            .pause(300) // wait for dialog box animation to complete
            .then(function() {
                return self.client.setValue('form[name=transactionForm] #payment', newAmount)
            })
            .then(function() {
                return self.client.element('form[name=transactionForm]').click('button=OK');
            })
            .call(callback);
    };

    this.deleteTransaction = function(callback) {

        var self = this;

        this.client
            .url('/accounts')
            .element('.accountsPanel ul').click('a=' + this.transaction.account)
            .waitForExist('.transactionsPanel')
            .element('.transactions-columnPayee=' + this.transaction.payee).element('..')
            .then(function(res) {
                return self.client.elementIdClick(res.value.ELEMENT);
            })
            .pause(300) // wait for dialog box animation to complete
            .then(function() {
                return self.client.element('form[name=transactionForm]').click('button=Delete');
            })
            .call(callback);
    };

    /**
     * Note: We skip the checking of memo and category fields because they are not shown in smaller widths.
     */
    this.assertTransactionExists = function(txn, callback) {

        var self = this;

        // Table row that contains the expectedTransaction
        var row = null;

        var amount = (txn.payment.length > 0) ? txn.payment : txn.deposit;
        var amountElement = (txn.payment.length > 0) ? '.transactions-columnPayment' : '.transactions-columnDeposit';

        this.client
            .url('/accounts')
            .element('.accountsPanel ul').click('a=' + txn.account)
            .waitForExist('.transactionsPanel')
            .element('.transactions-columnPayee=' + txn.payee).element('..')
            .then(function(res) {
                row = res.value.ELEMENT;
                self.client.elementIdElement(row, '.transactions-columnDate')
                    .getText()
                    .should.eventually.equal(txn.date)
            })
            .then(function() {
                self.client.elementIdElement(row, amountElement)
                    .getText()
                    .should.eventually.equal(amount)
                    .notify(callback);
            });
    };

    this.assertTransactionDoesNotExist = function(callback) {

        this.client
            .url('/accounts')
            .element('.accountsPanel ul').click('a=' + this.transaction.account)
            .waitForExist('.transactionsPanel')
            .element('.transactions-columnPayee=' + this.transaction.payee)
            .then(callback.fail, callback.bind(null, null));
    };

    // ----- Reporting -----
    this.goToDashboard = function(callback) {
        this.client
            .url('/')
            .selectByVisibleText('.txnFilterForm-period', 'All time')
            .call(callback);
    };

    // A very lightweight test that checks for the number of horizontal bars
    this.assertTransactionsByCategory = function(categories, callback) {
        this.client
            .elements('.chart .plot .bar')
            .then(function(res) {
                expect(res.value.length).to.equal(categories.length);
            })
            .call(callback);
    };

    callback();
};

module.exports.World = World;
