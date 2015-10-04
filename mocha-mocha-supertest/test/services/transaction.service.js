'use strict';

module.exports = {
    createTransaction: createTransaction,
    createTransactions: createTransactions,
    updateTransaction: updateTransaction,
    getTransaction: getTransaction,
    getTransactionsByCategory: getTransactionsByCategory,
    deleteTransaction: deleteTransaction
};

var _ = require('lodash');
var Promise = require('bluebird');
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
 * Creates transactions.
 *
 * @param {Transaction[]} transactions
 * @returns {Promise<Transaction[]>} A promise that returns the created transactions
 */
function createTransactions(transactions) {

    var tasks = [];
    _.each(transactions, function(transaction) {
        tasks.push(request.post('/transactions').send(transaction));
    });

    return Promise.all(tasks)
        .then(function(responses) {
            return _.map(responses, function(response) {
                return response.body;
            })
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
 * Gets transactions by category.
 *
 * @param startDate
 * @param endDate
 * @returns {Promise<Object[]>} A promise that returns categories with total amounts.
 */
function getTransactionsByCategory(startDate, endDate) {

    var dateRange = '&startDate=' + startDate.toISOString() + '&endDate=' + endDate.toISOString();

    return request.get('/transactions?groupByCategory' + dateRange)
        .then(function(response) {
            return response.body;
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
