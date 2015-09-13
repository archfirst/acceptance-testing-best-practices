'use strict';

var TransactionsPage = function() {
    this.url = '/accounts';
};

/**
 * Create a transaction
 * @param {Object} txn
 *     Example:
 *     {
 *         account: 'Amazon VISA',
 *         date: '02/01/2015',
 *         payee: 'Chevron Gas Station',
 *         memo: 'Gas',
 *         category: 'Auto & Transport',
 *         payment: '30.00',
 *         deposit: ''
 *     }
 * @returns {Promise}
 */
TransactionsPage.prototype.createTransaction = function(transaction) {

    var amount = (transaction.payment.length > 0) ? transaction.payment : transaction.deposit;
    var amountElement = (transaction.payment.length > 0) ? 'payment' : 'deposit';
    var txn_date = transaction.date.replace(/\//g, '');  // remove slashes

    return browser
        .url(this.url)
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
};

TransactionsPage.prototype.changePaymentAmount = function(account, payee, newAmount) {
    return browser
        .url(this.url)
        .element('.accountsPanel ul').click('a=' + account)
        .waitForExist('.transactionsPanel')
        .element('.transactions-columnPayee=' + payee).element('..')
        .then(function(res) {
            return browser.elementIdClick(res.value.ELEMENT);
        })
        .pause(300) // wait for dialog box animation to complete
        .then(function() {
            return browser.setValue('form[name=transactionForm] #payment', newAmount);
        })
        .then(function() {
            return browser.element('form[name=transactionForm]').click('button=OK');
        });
};

TransactionsPage.prototype.getTransactionForPayee = function *(account, payee) {

    // Get the transaction row with the specified payee
    var rowWebElement = yield browser
        .url(this.url)
        .element('.accountsPanel ul').click('a=' + account)
        .waitForExist('.transactionsPanel')
        .element('.transactions-columnPayee=' + payee)
        .element('..');
    var row = rowWebElement.value.ELEMENT;

    var date = yield browser
        .elementIdElement(row, '.transactions-columnDate').getText();

    var memo = yield browser
        .elementIdElement(row, '.transactions-columnMemo').getText();

    var category = yield browser
        .elementIdElement(row, '.transactions-columnCategory').getText();

    var payment = yield browser
        .elementIdElement(row, '.transactions-columnPayment').getText();

    var deposit = yield browser
        .elementIdElement(row, '.transactions-columnDeposit').getText();

    return {
        account: account,
        date: date,
        payee: payee,
        memo: memo,
        category: category,
        payment: payment,
        deposit: deposit
    };
};

TransactionsPage.prototype.deleteTransaction = function *(account, payee) {
    return browser
        .url(this.url)
        .element('.accountsPanel ul').click('a=' + account)
        .waitForExist('.transactionsPanel')
        .element('.transactions-columnPayee=' + payee).element('..')
        .then(function(res) {
            return browser.elementIdClick(res.value.ELEMENT);
        })
        .pause(300) // wait for dialog box animation to complete
        .then(function() {
            return browser.element('form[name=transactionForm]').click('button=Delete');
        });
};

TransactionsPage.prototype.doesTransactionExist = function(account, payee) {
    return browser
        .url(this.url)
        .element('.accountsPanel ul').click('a=' + account)
        .waitForExist('.transactionsPanel')
        .isExisting('.transactions-columnPayee=' + payee);
};

module.exports = TransactionsPage;
