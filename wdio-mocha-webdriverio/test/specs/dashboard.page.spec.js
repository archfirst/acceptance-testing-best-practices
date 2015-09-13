'use strict';

var expect = require('./chai-helpers').expect;
var AccountsPage = require('../pages/accounts.page');
var CategoriesPage = require('../pages/categories.page');
var DashboardPage = require('../pages/dashboard.page');
var TransactionsPage = require('../pages/transactions.page');

describe('Dashboard page', function() {

    var page;

    beforeEach(function *() {
        page = new DashboardPage();

        /* ----- Background ----- */
        // Given the following accounts
        var accountsPage = new AccountsPage();
        yield accountsPage.createAccount('Cash');
        yield accountsPage.createAccount('Credit');

        // And the following categories
        var categoriesPage = new CategoriesPage();
        yield categoriesPage.createCategory('Auto & Transport');
        yield categoriesPage.createCategory('Food & Dining');

        // And the following transactions
        var transactionsPage = new TransactionsPage();
        yield transactionsPage.createTransaction({
            account: 'Cash',   date: '01/01/2015', payee: 'Gas Station',   memo: 'Gas',  category: 'Auto & Transport', payment: '10.00', deposit: ''
        });
        yield transactionsPage.createTransaction({
            account: 'Credit', date: '01/02/2015', payee: 'Grocery Store', memo: 'Food', category: 'Food & Dining',    payment: '20.00', deposit: ''
        });
        yield transactionsPage.createTransaction({
            account: 'Cash',   date: '01/03/2015', payee: 'Gas Station',   memo: 'Gas',  category: 'Auto & Transport', payment: '30.00', deposit: ''
        });
        yield transactionsPage.createTransaction({
            account: 'Credit', date: '01/04/2015', payee: 'Grocery Store', memo: 'Food', category: 'Food & Dining',    payment: '40.00', deposit: ''
        });
        yield transactionsPage.createTransaction({
            account: 'Cash',   date: '01/05/2015', payee: 'Gas Station',   memo: 'Gas',  category: 'Auto & Transport', payment: '50.00', deposit: ''
        });
        yield transactionsPage.createTransaction({
            account: 'Credit', date: '01/06/2015', payee: 'Grocery Store', memo: 'Food', category: 'Food & Dining',    payment: '60.00', deposit: ''
        });
    });

    it('should show a summary of transactions by category', function *() {
        // Expected category totals
        // | category         | payment |
        // | Auto & Transport |  90.00  |
        // | Food & Dining    | 120.00  |

        // We will simply check for the number of horizontal bars
        var numberOfCategories = yield page.getNumberOfCategories();
        expect(numberOfCategories).to.equal(2);
    });
});
