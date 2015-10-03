'use strict';

var expect = require('./chai-helpers').expect;
var categoryService = require('../services/category.service');

describe('Categories API', function() {

    // ----- Category Creation -----
    // When I create a category called "Shopping"
    // And I ask for the category
    // Then I should get the category called "Shopping"
    it('should allow the creation of a category', function() {

        // When I create a category called "Shopping"
        return categoryService.createCategory('Shopping')

            // And I ask for the category
            .then(function(category) {
                return categoryService.getCategory(category.id);
            })

            // Then I should get the category called "Shopping"
            .then(function(category) {
                expect(category.name).to.equal('Shopping');
            });
    });

    // ----- Category Update -----
    // Given a category called "Shopping"
    // When I change the category name to "General Shopping"
    // And I ask for the category
    // Then I should get the category called "General Shopping"
    it('should allow updating of a category', function() {

        // Given a category called "Shopping"
        return categoryService.createCategory('Shopping')

            // When I change the category name to "General Shopping"
            .then(function(category) {
                category.name = 'General Shopping';
                return categoryService.updateCategory(category);
            })

            // And I ask for the category
            .then(function(category) {
                return categoryService.getCategory(category.id);
            })

            // Then I should get the category called "General Shopping"
            .then(function(category) {
                expect(category.name).to.equal('General Shopping');
            });
    });

    // ----- Category Deletion -----
    // Given a category called "Shopping"
    // When I delete the category
    // Then the category should not exist
    it('should allow the deletion of a category', function() {

        var category = null;

        // Given a category called "Shopping"
        return categoryService.createCategory('Shopping')

            // When I delete the category
            .then(function(createdCategory) {
                category = createdCategory;
                return categoryService.deleteCategory(category.id);
            })

            // Then the category should not exist
            .then(function() {
                return expect(categoryService.getCategory(category.id))
                    .to.eventually.be.rejectedWith('Not found');
            });
    });
});
