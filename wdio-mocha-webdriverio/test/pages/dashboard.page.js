'use strict';

var DashboardPage = function() {
    this.url = '/';
};

DashboardPage.prototype.getNumberOfCategories = function() {
    return browser
        .url(this.url)
        .selectByVisibleText('.txnFilterForm-period', 'All time')
        .elements('.chart .plot .bar')
        .then(function(res) {
            return res.value.length;
        })
};

module.exports = DashboardPage;
