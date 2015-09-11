'use strict';

var CategoriesPage = function() {
    this.url = '/settings/categories';
};

CategoriesPage.prototype.createCategory = function(name) {
    return browser
        .url(this.url)
        .setValue('.categoryAddForm-name', name)
        .click('.categoryAddForm button');
};

CategoriesPage.prototype.changeCategoryName = function *(curretName, newName) {

    // Get the category row
    var categoryRow = yield browser
        .url(this.url)
        .element('.categoryView=' + curretName)
        .element('..');

    // Click on the category row to show the category form
    var categoryForm = yield browser
        .elementIdClick(categoryRow.value.ELEMENT)
        .elementIdElement(categoryRow.value.ELEMENT, '.categoryForm');

    // Fill in the category name
    var nameField = yield browser
        .elementIdElement(categoryForm.value.ELEMENT, '.categoryForm-name');

    yield browser
        .elementIdClear(nameField.value.ELEMENT)
        .elementIdValue(nameField.value.ELEMENT, newName);

    // Submit the form
    yield browser
        .submit(categoryForm.value.ELEMENT);
};

CategoriesPage.prototype.doesCategoryExist = function(name) {
    return browser
        .url(this.url)
        .isExisting('.categoryView=' + name);
};

module.exports = CategoriesPage;
