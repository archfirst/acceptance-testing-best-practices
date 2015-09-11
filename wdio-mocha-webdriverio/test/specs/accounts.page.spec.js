'use strict';

var expect = require('./chai-helpers').expect;
var AccountsPage = require('../pages/accounts.page');

describe('Accounts page', function() {

    var page;

    beforeEach(function () {
        page = new AccountsPage();
    });

    it('should allow the creation of an account', function *() {
        // Given an account called "Cash"
        yield page.createAccount('Cash');

        // Then the accounts page should show an account called "Cash"
        var exists = yield page.doesAccountExist('Cash');
        expect(exists).to.be.true;
    });

    it('should allow changing the name of an account', function *() {
        // Given an account called "BofA Checking"
        yield page.createAccount('BofA Checking');

        // When I change the account name to "Bank of America Checking"
        yield page.changeAccountName('BofA Checking', 'Bank of America Checking');

        // Then the accounts page should show an account called "Bank of America Checking"
        var exists = yield page.doesAccountExist('Bank of America Checking');
        expect(exists).to.be.true;
    });
});