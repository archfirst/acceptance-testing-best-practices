'use strict';

var expect = require('./chai-helpers').expect;
var CategoriesPage = require('../pages/categories.page');

describe('Categories page', function() {

    var page;

    beforeEach(function () {
        page = new CategoriesPage();
    });

    it('should allow the creation of a category', function *() {
        // Given a category called "Shopping"
        yield page.createCategory('Shopping');

        // Then the categories page should show a category called "Shopping"
        var exists = yield page.doesCategoryExist('Shopping');
        expect(exists).to.be.true;
    });

    it('should allow changing the name of a category', function *() {
        // Given a category called "Shopping"
        yield page.createCategory('Shopping');

        // When I change the category name to "General Shopping"
        yield page.changeCategoryName('Shopping', 'General Shopping');

        // Then the categories page should show a category called "General Shopping"
        var exists = yield page.doesCategoryExist('General Shopping');
        expect(exists).to.be.true;
    });
});
