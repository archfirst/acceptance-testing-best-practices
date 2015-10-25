mocha-yadda-supertest
=====================

This is a special project to demonstrate the acceptance testing of the *Manage My Money* server API. As such we don't
need a front-end driver. Instead we will use [SuperTest](https://github.com/visionmedia/supertest) to drive the REST API.
Also note that the acceptance tests have been worded in terms of the API. You will find the Cucumber version
[here](https://github.com/archfirst/manage-my-money-server/tree/master/test/features).

```
Test runner:       mocha
Testing framework: yadda
HTTP driver:       supertest/supertest-as-promised
```

Running tests
-------------

- Make sure that mocha is installed globally

```bash
$ npm install -g mocha
```

- Make sure *Manage My Money* application is running

```bash
# --- In command shell 1 ---
$ cd Projects/manage-my-money-server
$ npm start
```

- Run the tests:

```bash
# --- In command shell 2 ---
$ cd <this-directory>
$ npm install
$ npm test
```

Yadda Configuration
-------------------
Yadda can be integrated with Mocha in two ways, using the `StepLevelPlugin` or the `ScenarioLevelPlugin`.
Each plugin translates features, scenarios and steps to different constructs in Mocha. 

- `StepLevelPlugin`: Each step is a separate Mocha test. This is generally better for output
because you can see all the steps executed.
    - feature > describe
    - scenario > describe
    - step > it
    
- `ScenarioLevelPlugin`: Each scenario is a separate Mocha test. You only see the scenario title in the mocha output.
    - feature > describe
    - scenario > it
    - step > no translation (executes as part of the scenario)

We are using the `StepLevelPlugin` to integrate with Mocha. See [here](test/test.js).
