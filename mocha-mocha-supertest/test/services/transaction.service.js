'use strict';

module.exports = {
    createTransaction: createTransaction,
    updateTransaction: updateTransaction,
    getTransaction: getTransaction,
    deleteTransaction: deleteTransaction
};

var request = require('./request');

/**
 * Creates a new transaction.
 *
 * @param {Transaction} transaction
 * @returns {Promise<Transaction>} A promise that returns the created transaction
 */
function createTransaction(transaction) {

    return request.post('/transactions')
        .send(transaction)
        .then(function(res) {
            return res.body;
        });
}

/**
 * Updates an existing transaction.
 *
 * @param {string} name
 * @returns {Promise<Transaction>} A promise that returns the created transaction
 */
function updateTransaction(transaction) {

    return request.put('/transactions/' + transaction.id)
        .send(transaction)
        .then(function(res) {
            return res.body;
        });
}

/**
 * Gets a transaction.
 *
 * @param {number} id
 * @returns {Promise<Transaction>} A promise that returns the desired transaction
 * @throws {String} "Not found" if transaction is not found
 */
function getTransaction(id) {

    return request.get('/transactions/' + id)
        .then(function(res) {
            if (res.notFound) {
                throw 'Not found';
            }

            return res.body;
        });
}

/**
 * Deletes a transaction.
 *
 * @param {number} id
 * @returns {Promise} A promise that returns true when the transaction is deleted
 */
function deleteTransaction(id) {

    return request.delete('/transactions/' + id)
        .then(function() {
            return true;
        });
}
