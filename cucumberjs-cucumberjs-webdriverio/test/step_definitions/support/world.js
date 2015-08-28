/* jshint expr: true */
'use strict';

var World = function World(callback) {
    // ----- Cached objects -----
    this.accountName = undefined;
    this.categoryName = undefined;

    // ----- Accounts -----
    this.createAccount = function(name, callback) {
        this.accountName = name;
        this.client
            .url('/settings/accounts')
            .setValue('.accountAddForm-name', name)
            .click('.accountAddForm button')
            .then(function() {
                callback();
            });
    };

    this.changeAccountName = function(newName, callback) {

        // This approach has a lot of repetition because we are not saving the list-item element
        // See the alternate approach below.
        //this.client
        //    .url('/settings/accounts')
        //    .element('.accountView=' + this.accountName).click('..')
        //    .element('.accountView=' + this.accountName).element('..').setValue('.accountForm-name', newName)
        //    .element('.accountView=' + this.accountName).element('..').submitForm('.accountForm')
        //    .then(function() {
        //        callback();
        //    });

        var self = this;

        var liElement = null;
        var accountFormElement = null;
        var accountFormNameElement = null;

        this.client
            .url('/settings/accounts')
            .element('.accountView=' + this.accountName).element('..')
            .then(function(res) {
                // Click the list item
                liElement = res.value.ELEMENT;
                return self.client.elementIdClick(liElement);
            })
            .then(function() {
                return self.client.elementIdElement(liElement, '.accountForm-name')
            })
            .then(function(res) {
                // Clear the existing account name from the form field
                accountFormNameElement = res.value.ELEMENT;
                return self.client.elementIdClear(accountFormNameElement);
            })
            .then(function() {
                // Fill in the new account name
                return self.client.elementIdValue(accountFormNameElement, newName);
            })
            .then(function() {
                return self.client.elementIdElement(liElement, '.accountForm')
            })
            .then(function(res) {
                // Submit the form
                accountFormElement = res.value.ELEMENT;
                return self.client.submit(accountFormElement);
            })
            .call(callback);
    };

    this.assertAccountExists = function(expectedName, callback) {

        // This approach is a bit of hand-waving because any accountView that "contains" the expected name will match
        //this.client
        //    .url('/settings/accounts')
        //    .getText('.accountView')
        //    .should.eventually.contain(expectedName)
        //    .notify(callback);

        this.client
            .url('/settings/accounts')
            .element('.accountView=' + expectedName)
            .call(callback);
    };

    // ----- Categories -----
    this.createCategory = function(name, callback) {
        this.categoryName = name;
        this.client
            .url('/settings/categories')
            .setValue('.categoryAddForm-name', name)
            .click('.categoryAddForm button')
            .then(function() {
                callback();
            });
    };

    this.changeCategoryName = function(newName, callback) {

        var self = this;

        var liElement = null;
        var categoryFormElement = null;
        var categoryFormNameElement = null;

        this.client
            .url('/settings/categories')
            .element('.categoryView=' + this.categoryName).element('..')
            .then(function(res) {
                // Click the list item
                liElement = res.value.ELEMENT;
                return self.client.elementIdClick(liElement);
            })
            .then(function() {
                return self.client.elementIdElement(liElement, '.categoryForm-name')
            })
            .then(function(res) {
                // Clear the existing category name from the form field
                categoryFormNameElement = res.value.ELEMENT;
                return self.client.elementIdClear(categoryFormNameElement);
            })
            .then(function() {
                // Fill in the new category name
                return self.client.elementIdValue(categoryFormNameElement, newName);
            })
            .then(function() {
                return self.client.elementIdElement(liElement, '.categoryForm')
            })
            .then(function(res) {
                // Submit the form
                categoryFormElement = res.value.ELEMENT;
                return self.client.submit(categoryFormElement);
            })
            .call(callback);
    };

    this.assertCategoryExists = function(expectedName, callback) {
        this.client
            .url('/settings/categories')
            .element('.categoryView=' + expectedName)
            .call(callback);
    };

    callback();
};

module.exports.World = World;
