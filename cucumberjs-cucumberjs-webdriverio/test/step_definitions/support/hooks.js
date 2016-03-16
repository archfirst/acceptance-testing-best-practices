'use strict';

var webdriverio = require('webdriverio');
var client = null;
var knex = null;

var myHooks = function() {

    // No World instance available on `this` here
    this.BeforeFeatures(function(event, callback) {
        initKnex();
        initClient(callback);
    });

    // World instance available on `this` here
    this.Before(function(callback) {

        // Set the client on the world
        this.client = client;

        // Truncate tables
        knex.raw('truncate table accounts, categories, transactions cascade')
            .then(function() {
                callback();
            })
            .catch(function(e) {
                console.error(e);
            });
    });

    // No World instance available on `this` here
    this.AfterFeatures(function(event, callback) {

        // Destroy the database connection pool and close the browser
        if (knex && knex.client) {
            knex.destroy(function() {
                client.end().call(callback);
            });
        }
        else {
            client.end().call(callback);
        }
    });

};

// --------------------------------------------------------
// Initialize knex (the query builder)
// --------------------------------------------------------
var initKnex = function() {

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
};

// --------------------------------------------------------
// Initialize Selenium Client
// --------------------------------------------------------
var initClient = function(callback) {

    var options = {
        desiredCapabilities: {
            browserName: 'chrome'
        },
        logLevel:'silent',
        baseUrl: 'http://localhost:3000'
    };

    client = webdriverio
        .remote(options)
        .init()
        .setViewportSize({width: 1024, height: 768}, true)
        .getViewportSize().then(function(size) {
            console.log(size);
        })
        .call(callback);
};

module.exports = myHooks;