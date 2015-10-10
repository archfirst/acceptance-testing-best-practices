'use strict';

module.exports = {
    createAccount: createAccount,
    createAccounts: createAccounts,
    updateAccount: updateAccount,
    getAccount: getAccount,
    deleteAccount: deleteAccount
};

var _ = require('lodash');
var Promise = require('bluebird');
var request = require('./request');

/**
 * Creates a new account.
 *
 * @param {string} name
 * @returns {Promise<Account>} A promise that returns the created account
 */
function createAccount(name) {

    return request.post('/accounts')
        .send({
            name: name
        })
        .expect(200)
        .then(function(res) {
            return res.body;
        });
}

/**
 * Creates accounts.
 *
 * @param {string[]} accountNames
 * @returns {Promise<Account[]>} A promise that returns the created accounts
 */
function createAccounts(names) {

    var tasks = [];
    _.each(names, function(name) {
        tasks.push(request.post('/accounts').send({name: name}).expect(200));
    });

    return Promise.all(tasks)
        .then(function(responses) {
            return _.map(responses, function(response) {
                return response.body;
            })
        });
}

/**
 * Updates an existing account.
 *
 * @param {string} name
 * @returns {Promise<Account>} A promise that returns the created account
 */
function updateAccount(account) {

    return request.put('/accounts/' + account.id)
        .send(account)
        .expect(200)
        .then(function(res) {
            return res.body;
        });
}

/**
 * Gets an account.
 *
 * @param {number} id
 * @returns {Promise<Account>} A promise that returns the desired account
 * @throws {String} "Not found" if account is not found
 */
function getAccount(id) {

    return request.get('/accounts/' + id)
        .expect(200)
        .then(function(res) {
            return res.body;
        });
}

/**
 * Deletes an account.
 *
 * @param {number} id
 * @returns {Promise} A promise that returns true when the account is deleted
 */
function deleteAccount(id) {

    return request.delete('/accounts/' + id)
        .expect(204)
        .then(function() {
            return true;
        });
}
