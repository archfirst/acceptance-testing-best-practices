'use strict';

var Yadda = require('yadda');
Yadda.plugins.mocha.StepLevelPlugin.init();

var knex = null;

new Yadda.FeatureFileSearch('./test/features').each(function(file) {

    // Establish before and after hooks for the test suite
    before(initDb);
    after(releaseDb);

    featureFile(file, function(feature) {

        var libraries = require_feature_libraries(feature);
        var yadda = Yadda.createInstance(libraries);

        scenarios(feature.scenarios, function(scenario) {

            // Truncate tables before every scenario
            before(truncateTables);

            var ctx = {};
            steps(scenario.steps, function(step, done) {
                yadda.run(step, { ctx: ctx }, done);
            });
        });
    });
});

function require_feature_libraries(feature) {
    return feature.annotations.libraries.split(', ').reduce(require_library, []);
}

function require_library(libraries, library) {
    return libraries.concat(require('./steps/' + library + '.steps'));
}

function initDb(done) {
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
    done();
}

function releaseDb(done) {
    if (knex && knex.client) {
        return knex.destroy()
            .then(function() {
                done();
            });
    }
}

function truncateTables(done) {
    return knex.raw('truncate table accounts, categories, transactions cascade')
        .then(function() {
            done();
        });
}
