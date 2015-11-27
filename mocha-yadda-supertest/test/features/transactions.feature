@libraries=accounts, categories, transactions
Feature: Manage transactions
In order to track my financial activities,
as a user,
I want the ability to add, change and delete transactions

Background:
    Given the following accounts
        -------------
        BofA Checking
        Amazon VISA
        -------------

    And the following categories
        ----------------
        Auto & Transport
        Salary
        Transfer
        Utilities
        ----------------

Scenario: Deposits can be made to bank accounts
    When I make the following deposit to BofA Checking
        -----------------------------------------
        | payee | memo     | amount  | category |
        | Hooli | Paycheck | 1000.00 | Salary   |
        -----------------------------------------

    And I ask for the transaction

    Then I should get the following deposit
        -----------------------------------------
        | payee | memo     | amount  | category |
        | Hooli | Paycheck | 1000.00 | Salary   |
        -----------------------------------------

Scenario: Payments can be made from bank accounts
    When I make the following payment from BofA Checking
        ----------------------------------------------------------
        | payee             | memo          | amount | category  |
        | National Electric | Electric bill | 100.00 | Utilities |
        ----------------------------------------------------------

    And I ask for the transaction

    Then I should get the following payment
        ----------------------------------------------------------
        | payee             | memo          | amount | category  |
        | National Electric | Electric bill | 100.00 | Utilities |
        ----------------------------------------------------------

Scenario: Purchases can be charged to credit cards
    When I make the following purchase using Amazon VISA
        ----------------------------------------------------------
        | payee               | memo | amount | category         |
        | Chevron Gas Station | Gas  | 30.00  | Auto & Transport |
        ----------------------------------------------------------

    And I ask for the transaction

    Then I should get the following payment
        ----------------------------------------------------------
        | payee               | memo | amount | category         |
        | Chevron Gas Station | Gas  | 30.00  | Auto & Transport |
        ----------------------------------------------------------

Scenario: Credit cards can be paid off by direct transfer from other accounts
    When I make the following payment from BofA Checking
        -----------------------------------------------------------
        | payee       | memo                 | amount  | category |
        | Amazon VISA | Pay off monthly bill | 1011.66 | Transfer |
        -----------------------------------------------------------

    And I ask for the transaction

    Then I should get the following payment
        -----------------------------------------------------------
        | payee       | memo                 | amount  | category |
        | Amazon VISA | Pay off monthly bill | 1011.66 | Transfer |
        -----------------------------------------------------------

Scenario: Transactions can be corrected
    When I make the following purchase using Amazon VISA
        ----------------------------------------------------------
        | payee               | memo | amount | category         |
        | Chevron Gas Station | Gas  | 30.00  | Auto & Transport |
        ----------------------------------------------------------

    And I change the purchase amount to 40.00

    And I ask for the transaction

    Then I should get the following payment
        ----------------------------------------------------------
        | payee               | memo | amount | category         |
        | Chevron Gas Station | Gas  | 40.00  | Auto & Transport |
        ----------------------------------------------------------

Scenario: Transactions can be deleted
    Given a transaction with the following properties
        -------------------------------------------------------------------------------------
        | date       | payee               | memo | amount | account     | category         |
        | 2015-02-01 | Chevron Gas Station | Gas  | -30.00 | Amazon VISA | Auto & Transport |
        -------------------------------------------------------------------------------------

    When I delete the transaction

    Then the transaction should not exist
