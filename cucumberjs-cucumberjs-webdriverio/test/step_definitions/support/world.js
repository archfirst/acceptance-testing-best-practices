/* jshint expr: true */
'use strict';

var World = function World(callback) {
    // ----- Cached objects -----
    this.accountName = undefined;
    this.categoryName = undefined;

    // ----- Accounts -----
    this.createAccount = function(name, callback) {
        this.accountName = name;
        this.client
            .url('/settings/accounts')
            .setValue('.accountAddForm-name', name)
            .click('.accountAddForm button')
            .call(callback);
    };

    this.changeAccountName = function(newName, callback) {

        // This approach has a lot of repetition because we are not saving the list-item element
        // See the alternate approach below.
        //this.client
        //    .url('/settings/accounts')
        //    .element('.accountView=' + this.accountName).click('..')
        //    .element('.accountView=' + this.accountName).element('..').setValue('.accountForm-name', newName)
        //    .element('.accountView=' + this.accountName).element('..').submitForm('.accountForm')
        //    .call(callback);

        var self = this;

        var liElement = null;
        var accountFormNameElement = null;

        this.client
            .url('/settings/accounts')
            .element('.accountView=' + this.accountName).element('..')
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
        this.categoryName = name;
        this.client
            .url('/settings/categories')
            .setValue('.categoryAddForm-name', name)
            .click('.categoryAddForm button')
            .call(callback);
    };

    this.changeCategoryName = function(newName, callback) {

        var self = this;

        var liElement = null;
        var categoryFormNameElement = null;

        this.client
            .url('/settings/categories')
            .element('.categoryView=' + this.categoryName).element('..')
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
    this.createTransaction = function(transaction, callback) {
        var amount = (transaction.payment.length > 0) ? transaction.payment : transaction.deposit;
        var amountElement = (transaction.payment.length > 0) ? 'payment' : 'deposit';
        var txn_date = transaction.date.replace(/\//g, '');  // remove slashes

        this.client
            .url('/accounts')
            .element('.accountsPanel ul').click('a=' + transaction.account)
            .waitForExist('.transactionsPanel button')
            .click('.transactionsPanel button')
            .waitForExist('form[name=transactionForm] #txn_date')
            .element('form[name=transactionForm]').click('#txn_date').keys(txn_date)
            .setValue('form[name=transactionForm] #payee', transaction.payee)
            .setValue('form[name=transactionForm] #memo', transaction.memo)
            .selectByVisibleText('form[name=transactionForm] #category', transaction.category)
            .setValue('form[name=transactionForm] #' + amountElement, amount)
            .element('form[name=transactionForm]').click('button=OK')
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
            .waitForExist('.transactionsPanel button')
            .element('.transactions-columnPayee=' + txn.payee).element('..')
            .then(function(res) {
                row = res.value.ELEMENT;
                // @TODO: this assertion is frequently failing
                self.client.elementIdElement(row, '.transactions-columnDate')
                    .getText()
                    .should.eventually.equal(txn.date)
                    .notify(callback);
            })
            .then(function() {
                self.client.elementIdElement(row, amountElement)
                    .getText()
                    .should.eventually.equal(amount)
                    .notify(callback);
            });
    };

    callback();
};

module.exports.World = World;
