'use strict';

var AccountsPage = function() {
    this.url = '/settings/accounts';
};

AccountsPage.prototype.createAccount = function(name) {
    return browser
        .url(this.url)
        .setValue('.accountAddForm-name', name)
        .click('.accountAddForm button');
};

AccountsPage.prototype.changeAccountName = function *(curretName, newName) {

    // Get the account row
    var accountRow = yield browser
        .url(this.url)
        .element('.accountView=' + curretName)
        .element('..');

    // Click on the account row to show the account form
    var accountForm = yield browser
        .elementIdClick(accountRow.value.ELEMENT)
        .elementIdElement(accountRow.value.ELEMENT, '.accountForm');

    // Fill in the account name
    var nameField = yield browser
        .elementIdElement(accountForm.value.ELEMENT, '.accountForm-name');

    yield browser
        .elementIdClear(nameField.value.ELEMENT)
        .elementIdValue(nameField.value.ELEMENT, newName);

    // Submit the form
    yield browser
        .submit(accountForm.value.ELEMENT);
};

AccountsPage.prototype.doesAccountExist = function(name) {
    return browser
        .url(this.url)
        .isExisting('.accountView=' + name);
};

module.exports = AccountsPage;
