'use strict';

module.exports = {
    createAccount: createAccount,
    updateAccount: updateAccount,
    getAccount: getAccount,
    deleteAccount: deleteAccount
};

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
 * Gets an existing account.
 *
 * @param {number} id
 * @returns {Promise<Account>} A promise that returns the desired account
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
