var English = require('yadda').localisation.English;
var accountService = require('./services/account.service');
var expect = require('../chai-helpers').expect;

var account = null;

module.exports = English.library()

    .when('I create an account called "$accountName"', function(accountName, next) {
        accountService.createAccount(accountName)
            .then(function(createdAccount) {
                account = createdAccount;
                next();
            })
    })

    .when('I ask for the account', function(next) {
        accountService.getAccount(account.id)
            .then(function(receivedAccount) {
                account = receivedAccount;
                next();
            })
    })

    .then('I should get the account called "$accountName"', function(accountName, next) {
        expect(account.name).to.equal(accountName);
        next();
    })

    .given('an account called "$accountName"', function(accountName, next) {
        accountService.createAccount(accountName)
            .then(function(createdAccount) {
                account = createdAccount;
                next();
            })
    })

    .when('I change the account name to "$accountName"', function(accountName, next) {
        account.name = accountName;
        accountService.updateAccount(account)
            .then(function(receivedAccount) {
                account = receivedAccount;
                next();
            })
    })

    .when('I delete the account', function(next) {
        accountService.deleteAccount(account.id)
            .then(function(receivedAccount) {
                next();
            })
    })

    .then('the account should not exist', function(next) {
        expect(accountService.getAccount(account.id))
            .to.eventually.be.rejected;
        next();
    });
