var English = require('yadda').localisation.English;
var accountService = require('./services/account.service');
var expect = require('../chai-helpers').expect;

var account = null;

module.exports = English.library()

    .when('I create an account called "$accountName"', function(accountName, next) {
        console.log('create an account');
        return accountService.createAccount(accountName)
            .then(function(createdAccount) {
                account = createdAccount;
                next();
            })
    })

    .when('I ask for the account', function(next) {
        console.log('ask for the account');
        return accountService.getAccount(account.id)
            .then(function(receivedAccount) {
                account = createdAccount;
                next();
            })
    })

    .then('I should get the account called "$accountName"', function(accountName, next) {
        console.log('verify account');
        expect(account.name).to.equal(accountName);
        next();
    });