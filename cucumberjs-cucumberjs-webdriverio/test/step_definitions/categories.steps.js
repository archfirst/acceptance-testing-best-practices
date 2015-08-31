'use strict';

module.exports = function() {

    this.World = require('./support/world').World;

    this.Given(/^a category called "([^"]*)"$/, function (name, callback) {
        this.createCategory(name, callback);
    });

    this.Given(/^the following categories$/, function (table, callback) {
        this.createCategories(table.hashes(), callback);
    });

    this.When(/^I change the category name to "([^"]*)"$/, function (newName, callback) {
        this.changeCategoryName(newName, callback);
    });

    this.Then(/^the category list should show a category called "([^"]*)"$/, function (name, callback) {
        this.assertCategoryExists(name, callback);
    });
};
