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
        tasks.push(request.post('/accounts').send({name: name}));
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
        .then(function(res) {
            if (res.notFound) {
                throw 'Not found';
            }

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
        .then(function() {
            return true;
        });
}
