Feature: User Login
  As a user
  I want to login using a valid email
  So that I can access the application

  Scenario: Failed login with invalid credential
    Given the user is on the login page
    When the user enters an invalid username and password
    And the user clicks the login button
    Then the user should see a failed message

  Scenario: Successful login with valid details
    Given the user is on the login page
    When the user enters a valid username and password
    And the user clicks the login button
    Then the user should see a success message

  Scenario: Successfully adding an item to cart
    Given the user is on the login page
    And the user is on the item page
    When the user add item to the cart
    And the user in the item list
    Then item should be seen in the item page

  Scenario: Successfully removing an item from cart
    Given the user is on the login page
    And the user is on the item page
    When the user add item to the cart
    And the user in the item list
    When the user remove item to the cart
    Then item shouldn't be seen in the item page

  Scenario: Attempt to checkout with empty cart
    Given the user is on the login page
    And the user is on the item page
    And the user in the item list
    When the user proceeds to checkout
    Then the user should see an error message indicating empty cart

  Scenario: Sorting items by price (low to high)
    Given the user is on the login page
    And the user is on the item page
    When the user sorts items by price low to high
    Then the first item should be the cheapest
