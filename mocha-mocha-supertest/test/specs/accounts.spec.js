'use strict';

var expect = require('./chai-helpers').expect;
var accountService = require('../services/account.service');

describe('Accounts API', function() {

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
});
