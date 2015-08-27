Feature: Accounts
  Story
  -----
  In order to organize my transactions,
  as a user,
  I want the ability to create and update accounts.

  Acceptance Criteria
  -------------------
  - User can create accounts
  - User can update accounts


  Scenario: Account Creation
    Given an account called "Cash"

    Then the account list should show an account called "Cash"


  Scenario: Account Update
    Given an account called "BofA Checking"

    When I change the account name to "Bank of America Checking"

    Then the account list should show an account called "Bank of America Checking"
