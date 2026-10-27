# week05

## Slide 1
CEN315
Introduction to Test Engineering
Week 5

## Slide 2
This Week's Goals
By the end of this week you should be able to:
1. Explain the difference between a test level (integration) and a test interface (API).
2. Choose an integration strategy and the stubs or drivers it needs.
3. Read an HTTP request and response and decide what to assert.
4. Write automated API tests in Postman, including negative and boundary cases.
5. Run a test collection from the command line and in a CI pipeline.
How to use these slides: every slide gives one core idea, a restaurant analogy and a Think question. Think questions are not answered on the slides: research them, try them, and bring your answers to class.

## Slide 3
Our Running Analogy: A Restaurant
We use one analogy all week. Every new idea gets a place on this map.
API: the menu and the waiter, the official way to ask the kitchen.
Component / module: a kitchen station: grill, salad bar, dessert.
Unit test: tasting each ingredient on its own.
Integration test: checking that order tickets move correctly between stations.
API test: a mystery shopper orders from the menu and checks what arrives.
System test: eating the full dinner as a real customer.
Think: Where would the restaurant's supplier, who delivers ingredients every morning, fit on this map? And the bank that processes card payments?

## Slide 4
Part 1: Integration Testing
How do parts that work alone behave together?

## Slide 5
Two Different Questions
How big is the piece we test? This is the test level: unit, integration, system, acceptance.
Where do we touch the system? This is the test interface: code (call a function), API (send an HTTP request) or UI (click on the screen).
The two questions are independent. Example: sending POST /orders to a running service that writes to a real database is an API test (interface) and an integration test (level) at the same time.
In the restaurant: ordering from the menu (the interface) can check a single dish, or the teamwork of the whole kitchen (the level).
Think: A Postman test calls a deployed server, which uses a real database and a payment service. Which test level is this? Justify your answer.

## Slide 6
Why Integration Fails: Mars Climate Orbiter (1999)
Ground software sent thruster impulse in pound-force seconds. Navigation software expected newton seconds (SI units). The values were off by a factor of 4.45.
Each module passed its own tests. The defect lived in the interface between them: trajectory corrections were calculated with the wrong values, the orbiter flew far too low, and it was lost while entering Mars orbit in September 1999.
In the restaurant: a recipe written in ounces, cooked by a chef who weighs everything in grams.
Think: Design one integration test that would have failed before launch. What would you send across the interface, and what would you check?

## Slide 7
What Integration Testing Looks For
Integration testing checks the interfaces and interactions between components that have already passed their own unit tests.
Component integration testing: parts inside one system, for example the order service and its database.
System integration testing: your system and systems you do not own, for example your shop and a payment provider.
In the restaurant: the plate reaches the wrong table, or the dessert ticket never arrives.

## Slide 8
Typical Interface Defects
Most integration failures come from a few kinds of interface defects:
Data mismatch: formats or units differ: dates, currency, units.
Missing data: missing fields or unexpected null values.
Call order: calls in the wrong order, or calls never made.
Error handling: wrong assumptions about errors and timeouts.
Configuration: a wrong URL or expired credentials.
Think: Pick two defects from the list. Why can't a unit test, where every neighbour is replaced by a stub, find them?

## Slide 9
Integration Strategies: Big-Bang vs Incremental
Big-bang integration: combine all modules, then test the whole system.
Pro: no stubs or drivers needed; quick to start. Con: a failure could come from anywhere, and testing starts late.
Incremental integration: add one module at a time; test after each step.
Pro: defects appear early and are easy to locate. Con: needs stubs or drivers, and more planning.
In the restaurant: big-bang is opening night with staff who have never worked together; incremental is rehearsing station by station before opening night.
Think: Two days before a demo, six modules have never run together. Which strategy do you choose, and which risk are you accepting?

## Slide 10
Incremental Strategies: Top-Down, Bottom-Up, Sandwich
Example system: the UI calls the order service and the payment service; the order service calls the database layer; the payment service calls the bank adapter.
Top-down: start with the UI. Modules below it that are not ready yet are replaced by stubs. Gives an early working skeleton; low-level defects show up late.
Bottom-up: start with the database layer and the bank adapter. Drivers call them, because the real callers are not ready. Low-level logic is tested early; nothing is visible until late.
Sandwich (hybrid): work top-down and bottom-up in parallel and meet in the middle layer.
Think: The payment provider's sandbox will only be available in week 10, but the UI team is ready now. Which strategy fits, and which test doubles will you need?

## Slide 11
Stubs and Drivers
A driver (fake caller) calls the module under test, which calls a stub (fake callee). All of these are test doubles, like a stunt double who replaces an actor for one scene.
Stub: stands in for a called module and returns fixed, canned answers. Restaurant: a trainee who always says “Table 5 is ready.”
Driver: calls the module under test, because the real caller is not ready yet. Restaurant: a test customer reading orders to the kitchen.

## Slide 12
Mocks and Fakes
Mock: a stub that also checks how it was called: which operation, how often, with what data. Restaurant: a trainee who also notes every order received.
Fake: a simplified but working implementation, for example an in-memory database. Restaurant: a home kitchen instead of the restaurant kitchen.
Think: If every dependency in your test is a stub, which kinds of defects can the test no longer find?

## Slide 13
The Test Pyramid
Many small, fast tests at the bottom; fewer, slower and more realistic tests at the top.
Unit tests (many): fast, cheap, isolated.
Integration / API tests (some): find interface defects that unit tests cannot, but need more setup and can fail for more reasons: network, data, timing.
End-to-end / UI tests (few): slowest and costliest, closest to real use.
In the restaurant: taste ingredients all day, rehearse in the kitchen a few times a week, and hold one full dress-rehearsal dinner before opening.
Think: The pyramid is a heuristic (Mike Cohn, 2009), not a law. Look up the “testing trophy”: when might a team want more integration tests than unit tests?

## Slide 14
Where Do Integration Tests Run?
An integration test needs its dependencies. You decide how real they are.
Real dependency in a container: start a real database or message broker for each run, for example with Testcontainers. Realism high, speed low. Restaurant: rehearse in the real kitchen.
Fake: a lightweight working substitute, for example an in-memory database. Realism medium, speed high. Restaurant: rehearse in a home kitchen.
Mock server: simulates a third-party API you do not control, and can return errors or delays on demand. Realism low, speed high. Restaurant: an actor plays the supplier on the phone.
Think: How should your system behave when the payment provider takes 30 seconds to answer? How would you test that behaviour?

## Slide 15
Part 2: API Testing with Postman
How do we test a system through its menu?

## Slide 16
HTTP in Five Minutes: Request and Response
Request (the order ticket)
POST /orders HTTP/1.1Host: api.shop.exampleContent-Type: application/jsonAuthorization: Bearer eyJhbGci... {"table": 5, "item": "soup", "quantity": 2}
First line: method and path. Next lines: headers (metadata). After the blank line: the body (the data, often JSON).
Response (what comes back to the table)
HTTP/1.1 201 CreatedContent-Type: application/jsonLocation: /orders/42 {"id": 42, "status": "received"}
Think: Open your browser's developer tools (Network tab) on any website and pick one request. What are its method, status code and Content-Type?

## Slide 17
HTTP Methods
The method says what the request wants to do with a resource:
GET: read a resource (“What is on my bill?”)
POST: create a new resource (“A new order, please.”)
PUT / PATCH: replace / partly update (“Make that soup a salad.”)
DELETE: remove a resource (“Cancel my order.”)
Think: Which methods are “idempotent”, and why does that matter when a request is retried?

## Slide 18
Status Codes
The status code is the waiter's answer. The first digit gives the family:
2xx Success: 200 OK, 201 Created, 204 No Content (“Here you are.”)
4xx Client error: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found (“We can't take that order.”)
5xx Server error: 500 Internal Server Error, 503 Service Unavailable (“The kitchen is on fire.”)
Think: What is the difference between 401 and 403? Give a restaurant example for each.

## Slide 19
What Do We Assert in an API Test?
A mystery shopper checks more than “the food arrived”. A good API test checks six things:
1. Status code: exactly the code the specification promises, for example 201 after creating.
2. Body values: the returned data is correct: status is “received”, quantity is 2.
3. Schema: every required field is present, with the right type (look up JSON Schema).
4. Headers: Content-Type, Location, caching and security headers.
5. Response time: within the agreed limit, for example under 500 ms.
6. Side effects: the action really happened: read the order back with GET /orders/42.
Think: An API answers 201 Created but never saves the order. Which of the six checks catches this, and why are the others not enough?

## Slide 20
Negative and Boundary Tests
Happy-path tests show the API works. Negative tests show it fails politely: an order that is not on the menu gets “Sorry, we don't have that” (4xx), never a kitchen fire (5xx).
Think: A field “email” must be 5 to 100 characters long and contain “@”. List at least six test inputs, including the boundaries, and the answer you expect for each.
Example: POST /orders, where quantity must be between 1 and 10.
Required field “item” is missing: 400
No token sent: 401
Another customer's token, reading order 42: 403 (or 404)
Order 9999 does not exist: 404
quantity = “two” (wrong type): 400
quantity = 0, 1, 10, 11 (the boundaries): 400, 201, 201, 400

## Slide 21
Postman Building Blocks
Postman is an API platform (desktop and web app) to send, test and document API requests.
Request: one HTTP call: method, URL, headers, body. Restaurant: one order ticket.
Collection: an ordered group of requests and their tests, run as a whole. Restaurant: the mystery shopper's checklist.
Environment: variable values for one target: development, test or production. Restaurant: which branch you visit.

## Slide 22
Variables and Scripts
Variables: {{baseUrl}} or {{token}}, placeholders reused across requests. Restaurant: blanks you fill in at each branch.
Scripts: JavaScript run before (Pre-request) or after (Post-response) a request. Restaurant: notes taken before and after ordering.
Think: Why should the base URL be a variable instead of being typed into every request? What could go wrong otherwise?

## Slide 23
Writing a Test in Postman
// Post-response script of POST /orderspm.test("Order is created", () => {  pm.response.to.have.status(201);});pm.test("Order is received", () => {  const order = pm.response.json();  pm.expect(order.status).to.eql("received");  pm.expect(order.quantity).to.eql(2);});pm.test("Answers within 500 ms", () => {  const ms = pm.response.responseTime;  pm.expect(ms).to.be.below(500);});
pm.test(name, fn): one named check. It passes if the function throws no error.
pm.response: the response that just arrived: status, headers, body, time.
pm.expect(value): an assertion, “expect this value to equal...” (Chai style).
Results appear in the Test Results tab, and in command-line and CI reports.

## Slide 24
Try It Yourself
Think: If the first test fails, do the other two still run? Predict, then try it.
Think: How could you check the whole body against a schema instead of single fields?

## Slide 25
Chaining Requests: Passing Data Between Calls
Real scenarios need several calls in a row: save a value from one response, reuse it in the next.
1. Log in: POST /auth returns {"token": "abc123"}. Save it:pm.environment.set("token", pm.response.json().token);
2. Create an order: POST /orders with the header Authorization: Bearer {{token}} returns {"id": 42}. Save it:pm.environment.set("orderId", pm.response.json().id);

## Slide 26
Chaining Requests: Verifying the Result
3. Verify the side effect: GET /orders/{{orderId}}pm.test("Order exists", () => pm.response.to.have.status(200));
In the restaurant: the host gives you a table number; you quote it in every later order, and finally you check the kitchen board for your order.
Think: If step 1 fails, what happens to steps 2 and 3? Look up how a Postman collection run decides the order of requests.

## Slide 27
Running Collections from the Command Line
Automation means running the same collection without clicking: a robot inspector that follows the checklist after every change.
# install oncenpm install -g postman-cli
# run an exported collection with an environmentpostman collection run orders.json -e test.json
# data-driven: one iteration per CSV rowpostman collection run orders.json -d orders.csv
# write a JUnit report for CIpostman collection run orders.json -r cli,junit

## Slide 28
When a Test Fails
By default every request runs; failed tests are reported and the run continues.
--bail stops the run at the first failure.
Any failed test gives a non-zero exit code: this is how a CI server knows the build failed.
JUnit, HTML and JSON reports need a v2.1 JSON collection; v3 YAML collections report to the terminal only.
Think: What is an exit code? Run a collection with one failing test, then print the code with echo $? (Linux/macOS) or $LASTEXITCODE (PowerShell).

## Slide 29
Postman CLI or Newman?
Postman CLI
Status: actively developed by Postman
Source: closed source, digitally signed
Install: npm install -g postman-cli
Formats: v2.1 JSON and v3 YAML
Beyond runs: monitors, mocks, performance tests, spec linting, push to Postman Cloud
Exports: cookie jar only
Newman
Status: no longer maintained (2026)
Source: open source, since 2014
Install: npm install -g newman
Formats: v2.1 JSON only
Beyond runs: runs collections only
Exports: collection, environment, globals, cookie jar

## Slide 30
Moving from Newman to the Postman CLI
Commands map almost one-to-one:newman run orders.json -e test.jsonpostman collection run orders.json -e test.json
In the restaurant: Newman is the old inspector robot: no spare parts, and it can't read the new tickets.
Think: Your company's CI still uses Newman. Give three arguments for migrating this semester and one against.

## Slide 31
API Tests in a CI Pipeline
# .github/workflows/api-tests.ymlname: api-testson: [push, pull_request]jobs:  test:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v7      - run: npm install -g postman-cli      - run: >          postman collection run          tests/orders.json -e tests/ci.json          -r cli,junit
Every push and pull request runs the collection automatically.
A failed test means a non-zero exit code, which means a red build: the change is stopped before it reaches users.

## Slide 32
What the Pipeline Gives You
Secrets (API keys, passwords) live in the CI secret store and are passed as environment variables. Never commit them.
JUnit reports are written to postman-cli-reports/
In the restaurant: the inspector visits after every menu change, and the doors stay closed until it passes.
Think: Add a step that keeps the JUnit report as a build artifact. Where in GitHub can you then see which test failed?

## Slide 33  [images: 1]
Beyond Functional Testing
Functional tests ask “does it do the right thing?”. Other test types ask different questions; the chart maps nine of them.
Three of them are worth researching next: contract testing, security testing and performance testing.
Slide images (read these for content): img/week05/slide33-1.png

## Slide 34
Three Test Types to Research Next
Contract testing: does the provider still give its consumers exactly what they rely on? Look up: OpenAPI, consumer-driven contracts, Pact. Restaurant: does the printed menu match what the kitchen can cook?
Security testing: can table 5 read table 7's bill? Look up: OWASP API Security Top 10, broken object level authorization.
Performance testing: what happens in the Friday-night rush? Look up: load vs stress testing, tools such as k6 or JMeter.

## Slide 35
Open Questions (1/2)
No answers on these slides. Research, try, and bring your reasoning to class.
1. When would you replace a mock with the real service in your test suite, and what would it cost you?
2. Why are integration tests more often “flaky” than unit tests? Find two techniques that reduce flakiness.
3. Find out which status code Restful-Booker returns for DELETE. Is it what HTTP semantics suggest? Is it a bug?

## Slide 36
Open Questions (2/2)
4. Each Mars Climate Orbiter module passed its own tests. Which practice from this week would have caught the defect, and when?
5. Which kinds of defects can API tests never find? Which test level would find them?
6. A colleague says: “We have 95% unit test coverage, so integration tests are unnecessary.” How do you respond?

## Slide 37
Assignment: Test a Real API
Target: Restful-Booker, a booking API built for testing practice. Some of its bugs are intentional.
1. Read the API documentation. Build a Postman collection covering login and every booking operation (create, read, update, partial update, delete).
2. Write at least 15 tests, including at least 5 negative or boundary tests.
3. Chain data: reuse the auth token and the new booking id across requests.
4. Run one request data-driven from a CSV file with at least 5 rows.
5. Export the collection as v2.1 JSON and run it with the Postman CLI in a GitHub Actions workflow that produces a JUnit report.
6. Report (max. 1 page): which responses surprised you, which ones you consider bugs and why, and one defect a unit test could never find.

## Slide 38
Assignment: Submission
Submit: the repository link (collection, environment without secrets, CSV file, workflow file) and the report.
Assessed on: test coverage, negative and boundary tests, chaining and data-driven run, a working CI run, and the report.
Starting points: Postman CLI documentation; Newman tutorial (legacy tool: redo its steps with the Postman CLI).

## Slide 39
Where to Look Next
ISTQB Foundation Level syllabus: test levels, integration testing, test design techniques
Ham Vocke: The Practical Test Pyramid: how unit, integration and API tests fit together
Martin Fowler: Mocks Aren't Stubs: test doubles in depth
MDN Web Docs: HTTP: methods, headers and status codes
Postman Learning Center: scripts, the Postman CLI, CI integration
OWASP API Security Top 10: the most common API security risks
Mars Climate Orbiter: search for the Mishap Investigation Board Phase I Report (NASA, 1999).
Think: Read the first two before the lab session and note one idea you disagree with.
