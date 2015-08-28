Feature: Categories
    Story
    -----
    In order to analyze my income and expenses,
    as a user,
    I want the ability to create and update categories.

    Acceptance Criteria
    -------------------
    - User can create categories
    - User can update categories


    Scenario: Category Creation
        Given a category called "Shopping"

        Then the category list should show a category called "Shopping"


    Scenario: Category Update
        Given a category called "Shopping"

        When I change the category name to "General Shopping"

        Then the category list should show a category called "General Shopping"
