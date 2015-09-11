'use strict';

var knex = null;

// Runs before all test cases.
// Initializes knex.
before(function() {
    knex = require('knex')({
        client: 'postgresql',
        debug: false,
        connection: {
            host: 'localhost',
            user: '',
            password: '',
            database: 'manage-my-money',
            charset: 'utf8'
        }
    });
});

// Runs before each test case.
// Truncates tables.
beforeEach(function() {
    return knex.raw('truncate table accounts, categories, transactions cascade');
});

// Runs after each test case.
// Does nothing.
afterEach(function() {
});

// Runs after all test cases.
// Destroys the database connection.
after(function() {
    if (knex && knex.client) {
        return knex.destroy();
    }
});
