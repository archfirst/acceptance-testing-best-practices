// This StepLevelPlugin does not work because it clears the database before each step

/*
var Yadda = require('yadda');
Yadda.plugins.mocha.StepLevelPlugin.init();

new Yadda.FeatureFileSearch('./test/features').each(function(file) {

    featureFile(file, function(feature) {

        var library = require('./steps/accounts.steps');
        var yadda = Yadda.createInstance(library);

        scenarios(feature.scenarios, function(scenario) {
            steps(scenario.steps, function(step, done) {
                yadda.run(step, done);
            });
        });
    });
});

*/

// This ScenarioLevelPlugin does not work because it times out on the very first step
var Yadda = require('yadda');
Yadda.plugins.mocha.ScenarioLevelPlugin.init();

new Yadda.FeatureFileSearch('./test/features').each(function(file) {

    featureFile(file, function(feature) {

        var library = require('./steps/accounts.steps');
        var yadda = Yadda.createInstance(library);

        scenarios(feature.scenarios, function(scenario, done) {
            yadda.run(scenario.steps, done);
        });
    });
});
