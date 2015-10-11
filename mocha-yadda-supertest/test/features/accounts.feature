Feature: Accounts
In order to organize my transactions,
as a user,
I want the ability to create, update and delete accounts.

Scenario: Account Creation
    When I create an account called "Cash"
    And I ask for the account
    Then I should get the account called "Cash"
