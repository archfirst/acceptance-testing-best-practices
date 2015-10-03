'use strict';

var expect = require('./chai-helpers').expect;
var accountService = require('../services/account.service');

describe('Accounts API', function() {

    // ----- Account Creation -----
    // When I create an account called "Cash"
    // And I ask for the account
    // Then I should get the account called "Cash"
    it('should allow the creation of an account', function() {

        // When I create an account called "Cash"
        return accountService.createAccount('Cash')

            // And I ask for the account
            .then(function(account) {
                return accountService.getAccount(account.id);
            })

            // Then I should get the account called "Cash"
            .then(function(account) {
                expect(account.name).to.equal('Cash');
            });
    });

    // ----- Account Update -----
    // Given an account called "BofA Checking"
    // When I change the account name to "Bank of America Checking"
    // And I ask for the account
    // Then I should get the account called "Bank of America Checking"
    it('should allow updating of an account', function() {

        return accountService.createAccount('BofA Checking')
            .then(function(account) {
                account.name = 'Bank of America Checking';
                return accountService.updateAccount(account);
            })
            .then(function(account) {
                return accountService.getAccount(account.id);
            })
            .then(function(account) {
                expect(account.name).to.equal('Bank of America Checking');
            });
    });

    // ----- Account Deletion -----
    // Given an account called "BofA Checking"
    // When I delete the account
    // Then the account should not exist
    it('should allow the deletion of an account', function() {

        var account = null;

        return accountService.createAccount('BofA Checking')
            .then(function(createdAccount) {
                account = createdAccount;
                return accountService.deleteAccount(account.id);
            })
            .then(function() {
                return expect(accountService.getAccount(account.id))
                    .to.eventually.be.rejectedWith('Not found');
            });
    });
});
