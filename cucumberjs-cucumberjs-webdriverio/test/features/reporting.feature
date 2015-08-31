Feature: Reporting
  Story
  -----
  In order to analyze my financial activities,
  as a user,
  I want the ability to summarize my transactions in different ways.

  Acceptance Criteria
  -------------------
  - User can group transactions by category

  Background:
    Given the following accounts
      | name   |
      | Cash   |
      | Credit |

    And the following categories
      | name             |
      | Auto & Transport |
      | Food & Dining    |

  Scenario: Transactions By Category
    Given the following transactions
      | account | date       | payee         | memo  | category         | payment | deposit |
      | Cash    | 01/01/2015 | Gas Station   | Gas   | Auto & Transport | 10.00   |         |
      | Credit  | 01/02/2015 | Grocery Store | Food  | Food & Dining    | 20.00   |         |
      | Cash    | 01/03/2015 | Gas Station   | Gas   | Auto & Transport | 30.00   |         |
      | Credit  | 01/04/2015 | Grocery Store | Food  | Food & Dining    | 40.00   |         |
      | Cash    | 01/05/2015 | Gas Station   | Gas   | Auto & Transport | 50.00   |         |
      | Credit  | 01/06/2015 | Grocery Store | Food  | Food & Dining    | 60.00   |         |

    When I ask for transactions by category

    Then I should get the following summary of transactions by category
      | category         | payment |
      | Auto & Transport |  90.00  |
      | Food & Dining    | 120.00  |
