'use strict';

module.exports = {
    createAccount: createAccount,
    getAccount: getAccount
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
 * Gets an existing account.
 *
 * @param {number} id
 * @returns {Promise<Account>} A promise that returns the desired account
 */
function getAccount(id) {

    return request.get('/accounts/' + id)
        .then(function(res) {
            return res.body;
        });
}
