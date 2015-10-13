var Yadda = require('yadda');
Yadda.plugins.mocha.StepLevelPlugin.init();

var knex = null;

new Yadda.FeatureFileSearch('./test/features').each(function(file) {

    // Runs before all test cases.
    // Initializes knex.
    before(function(done) {
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
    })

    // Runs after all test cases.
    // Destroys the database connection.
    after(function(done) {
        if (knex && knex.client) {
            return knex.destroy()
                .then(function() {
                    done();
                });
        }
    })

    featureFile(file, function(feature) {

        var library = require('./steps/accounts.steps');
        var yadda = Yadda.createInstance(library);

        scenarios(feature.scenarios, function(scenario) {

            before(function(done) {
                return knex.raw('truncate table accounts, categories, transactions cascade')
                    .then(function() {
                        done();
                    })
            })

            var ctx = {};
            steps(scenario.steps, function(step, done) {
                yadda.run(step, { ctx: ctx }, done);
            });
        });
    });
});
