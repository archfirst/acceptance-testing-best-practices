'use strict';

var English = require('yadda').localisation.English;
var accountService = require('./services/account.service');
var expect = require('../chai-helpers').expect;

module.exports = English.library()

    .when('I create an account called "$accountName"', function(accountName, next) {
        var self = this;
        accountService.createAccount(accountName)
            .then(function(createdAccount) {
                self.ctx.account = createdAccount;
                next();
            });
    })

    .when('I ask for the account', function(next) {
        var self = this;
        accountService.getAccount(this.ctx.account.id)
            .then(function(receivedAccount) {
                self.ctx.account = receivedAccount;
                next();
            });
    })

    .then('I should get the account called "$accountName"', function(accountName, next) {
        expect(this.ctx.account.name).to.equal(accountName);
        next();
    })

    .given('an account called "$accountName"', function(accountName, next) {
        var self = this;
        accountService.createAccount(accountName)
            .then(function(createdAccount) {
                self.ctx.account = createdAccount;
                next();
            });
    })

    .when('I change the account name to "$accountName"', function(accountName, next) {
        var self = this;
        this.ctx.account.name = accountName;
        accountService.updateAccount(this.ctx.account)
            .then(function(receivedAccount) {
                self.ctx.account = receivedAccount;
                next();
            });
    })

    .when('I delete the account', function(next) {
        accountService.deleteAccount(this.ctx.account.id)
            .then(function() {
                next();
            });
    })

    .then('the account should not exist', function(next) {
        expect(accountService.getAccount(this.ctx.account.id))
            .to.eventually.be.rejected;
        next();
    });
