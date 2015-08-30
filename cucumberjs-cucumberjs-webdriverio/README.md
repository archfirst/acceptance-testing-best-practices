cucumberjs-cucumberjs-webdriverio
=================================
```
Test runner:       cucumber-js
Testing framework: cucumber-js
Front-end driver:  WebdriverIO
```

Running tests
-------------

- Make sure *Manage My Money* application is running

```bash
# --- In command shell 1 ---
$ cd Projects/manage-my-money-server
$ npm start

# --- In command shell 2 ---
$ cd Projects/manage-my-money-client
$ gulp serve-dev
```

- Run the Selenium Standalone Server:

```bash
# --- In command shell 3 ---
$ java -jar /usr/local/bin/selenium-server-standalone-2.47.1.jar
```

- Run the tests:

```bash
# --- In command shell 4 ---
$ cd <this-directory>
$ npm install
$ npm test
```

By default, the tests run in Chrome. To switch to another browser, change the `browserName` in `test/step_definitions/support/hooks.js`.

Skipping specific tests
-----------------------
If you want to skip testing an entire feature or a specific scenario, simply tag it with @todo. For example:

```
  @todo
  Scenario: Account Creation
    Given an account called "Cash"

    Then the account list should show an account called "Cash"
```

Running only specific tests
---------------------------
If you are working on a feature or a scenarion and only want to run that feature or scenario, tag it with @wip. For example:

```
  @wip
  Scenario: Account Creation
    Given an account called "Cash"

    Then the account list should show an account called "Cash"
```

Now run the test using the following command
```bash
./node_modules/cucumber/bin/cucumber.js ./test/features/ --require ./test/step_definitions/ --format pretty --tags @wip
```
