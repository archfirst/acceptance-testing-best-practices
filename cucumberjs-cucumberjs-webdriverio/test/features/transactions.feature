Feature: Transactions
  Story
  -----
  In order to track my financial activities,
  as a user,
  I want the ability to create, update and delete transactions in an account.

  Acceptance Criteria
  -------------------
  - User can create transactions
  - User can update transactions
  - User can delete transactions

  Background:
    Given an account called "Amazon VISA"
    And a category called "Auto & Transport"

  Scenario: Transaction Creation
    Given a transaction with the following properties
      | account     | date       | payee               | memo | category         | payment | deposit |
      | Amazon VISA | 02/01/2015   | Chevron Gas Station | Gas  | Auto & Transport | 30.00   |         |

    Then the transaction list should show the following transaction
      | account     | date       | payee               | memo | category         | payment | deposit |
      | Amazon VISA | 02/01/2015 | Chevron Gas Station | Gas  | Auto & Transport | 30.00   |         |


  @todo
  Scenario: Transaction Update
    Given a transaction with the following properties
      | account     | date       | payee               | memo | category         | payment | deposit |
      | Amazon VISA | 02/01/2015 | Chevron Gas Station | Gas  | Auto & Transport | 30.00   |         |

    When I change the payment amount to 50.00

    Then the transaction list should show the following transaction
      | account     | date       | payee               | memo | category         | payment | deposit |
      | Amazon VISA | 02/01/2015 | Chevron Gas Station | Gas  | Auto & Transport | 50.00   |         |


  @todo
  Scenario: Transaction Deletion
    Given a transaction with the following properties
      | account     | date       | payee               | memo | category         | payment | deposit |
      | Amazon VISA | 02/01/2015 | Chevron Gas Station | Gas  | Auto & Transport | 30.00   |         |

    When I delete the transaction

    Then the transaction should not exist
