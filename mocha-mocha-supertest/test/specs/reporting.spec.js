'use strict';

var _ = require('lodash');
var expect = require('./chai-helpers').expect;
var accountService = require('../services/account.service');
var categoryService = require('../services/category.service');
var transactionService = require('../services/transaction.service');

describe('Reporting API', function() {

    var accounts = null;
    var categories = null;

    /* ----- Background ----- */
    beforeEach(function() {
        // Given two accounts: "Cash", "Credit"
        return accountService.createAccounts(['Cash', 'Credit'])

            // And two categories "Auto & Transport", "Food & Dining"
            .then(function(createdAccounts) {
                accounts = createdAccounts;
                return categoryService.createCategories(['Auto & Transport', 'Food & Dining']);
            })

            .then(function(createdCategories) {
                categories = createdCategories;
            });
    });

    // ----- Transactions By Category -----
    it('should show a summary of transactions by category', function() {

        // When I create the following transactions
        var transactions = [
            { txn_date: new Date('2015-01-01'), payee: 'Gas Station',   memo: 'Gas',  amount: -10.00, account_id: accounts[0].id, category_id: categories[0].id },
            { txn_date: new Date('2015-01-02'), payee: 'Grocery Store', memo: 'Food', amount: -20.00, account_id: accounts[1].id, category_id: categories[1].id },
            { txn_date: new Date('2015-01-03'), payee: 'Gas Station',   memo: 'Gas',  amount: -30.00, account_id: accounts[0].id, category_id: categories[0].id },
            { txn_date: new Date('2015-01-04'), payee: 'Grocery Store', memo: 'Food', amount: -40.00, account_id: accounts[1].id, category_id: categories[1].id },
            { txn_date: new Date('2015-01-05'), payee: 'Gas Station',   memo: 'Gas',  amount: -50.00, account_id: accounts[0].id, category_id: categories[0].id },
            { txn_date: new Date('2015-01-06'), payee: 'Grocery Store', memo: 'Food', amount: -60.00, account_id: accounts[1].id, category_id: categories[1].id }
        ];
        return transactionService.createTransactions(transactions)

            // When I ask for transactions by category with start date of "2015-01-02" and end date of "2015-01-05"
            .then(function() {
                return transactionService.getTransactionsByCategory(new Date('2015-01-02'), new Date('2015-01-05'));
            })

            // Then I should get the following summary of transactions by category
            .then(function(returnedItems) {
                var expectedItems = [
                    { cat_id: categories[0].id, cat_name: 'Auto & Transport', amount: -80.00 },
                    { cat_id: categories[1].id, cat_name: 'Food & Dining',    amount: -60.00 }
                ];

                // Sort returnedItems by cat_name (expectedItems are sorted already)
                expect(_.sortBy(returnedItems, 'cat_name')).to.deep.equal(expectedItems);
            });
    });
});
