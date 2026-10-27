# week06

## Slide 1
CEN315
Introduction to Test Engineering
Week 6

## Slide 2  [images: 1]
Advanced Test Design - Graph Coverage, Data Flow, Decision Tables
This week covers three ways to derive tests from a model of the software: the control flow graph of the code, the flow of values through its variables, and decision tables for complex Business Logic.

## Slide 3
This Week's Goals
By the end of this week you should be able to:
1) Draw the control flow graph of a short function and list the tests needed for node coverage and edge coverage.
2) Mark the definitions and uses of a variable and write tests for all-defs and all-uses coverage.
3) Turn a business rule into a decision table and measure decision table coverage.
4) Decide when a decision table is the right tool and when equivalence partitioning, boundary values or state transition testing fit better.
As in Week 5, the Think questions are not answered on the slides. Try them before the next class.

## Slide 4
Part 1: Graph Coverage
Which paths through the code did your tests actually take?

## Slide 5
Control Flow Graphs
A control flow graph (CFG) is a model of a piece of code. A node is a statement, or a block of statements that always run one after another. An edge is a possible transfer of control from one node to the next.
A decision such as if (x > 0) has two outgoing edges, one for true and one for false. A loop adds an edge that goes back to an earlier node.
Every graph has an initial node, where execution starts, and at least one final node. A test path starts at an initial node and ends at a final node.
In our restaurant from Week 5, the stations are the nodes and every handoff of the order ticket is an edge. Sending a dish back to the kitchen is a loop.

## Slide 6
From Code to a Control Flow Graph
1
def classify(x, y):
2
if x > 0:
3
if y > 0:
4
return "both positive"
5
return "x positive, y non-positive"
6
return "x non-positive"
This code matches the graph in the introduction.
Line 1 (the function header) is the entry node. Each decision has a T edge and an F edge, and all three return statements lead to one exit node.
F
T
F
T
1
2
6
3
5
4
exit

## Slide 7
Structural Coverage Criteria
Ammann and Offutt define a ladder of criteria on the same graph:
Node coverage asks for every reachable node to be executed at least once. The ISTQB syllabus calls this statement coverage.
Edge coverage asks for every reachable edge to be taken at least once. ISTQB calls it branch coverage and measures it as branches exercised divided by all branches.
Edge-pair coverage asks for every reachable path of up to two edges.

## Slide 8
Measuring Coverage on One Graph
F
T
F
T
1
2
6
3
5
4
exit
Test: classify(-5, 3)
Path: 1 → 2 → 6 → exit
Nodes visited: 4 of 7 (57%)
Edges taken: 3 of 8 (37.5%)
Same test, two different numbers.
Think: which tests would bring node coverage and edge coverage to 100%?

## Slide 9  [images: 2]
What a Coverage Tool Reports
coverage.py 7.17, run with --branch after one test: classify(-5, 3).
Red lines never ran. Line 2 is yellow, a partial branch: the jump from line 2 to line 3 never happened (2 ↛ 3).
Think: the tool counts 1 of 4 branches; the previous slide counted 3 of 8 edges. What does each number count?

## Slide 10
Edge Pairs at a Join Node
A
B
C
D
E
F
2 in, 2 out
Paths of two edges through D:
B → D → E          B → D → F
C → D → E          C → D → F
In-edges × out-edges at D: 2 × 2 = 4 pairs
Two tests, A-B-D-E-F and A-C-D-F, take every edge of this graph but only two of the four pairs. Edge-pair coverage asks for all four, so it also tests how the first decision combines with the second.

## Slide 11
Prime Paths and Complete Paths
Prime path coverage asks for every prime path: a simple path (no repeated node, although it may start and end at the same node) that is not part of any longer simple path. This is how loops get tested.
Complete path coverage asks for every path. A single loop already gives infinitely many paths, so this cannot be reached in practice.

## Slide 12
Simple Path or Prime Path?
1
2
3
4
5
[2, 3, 4, 2]
Simple: only the first and last node are the same.
Prime: no longer simple path contains it.
1
2
3
4
5
[1, 2, 3]
Simple, but not prime: it sits inside the longer simple path [1, 2, 3, 4].
1
2
3
4
5
[1, 2, 3, 4, 2]
Not simple: node 2 appears twice, and the path does not start at 2.
Try: list every prime path of this graph.

## Slide 13
Which Criterion Is Stronger?
Criterion A subsumes criterion B when every test set that satisfies A also satisfies B. Edge coverage subsumes node coverage: a test set that takes every edge has also visited every node.
The reverse fails. For if (x > 0) { y = 1; } with no else branch, one test with x = 1 visits every node but never takes the false edge.
In our restaurant, a mystery shopper can pass through every station once and still never use the handoff from the grill straight to the cashier.
Think: Draw the CFG of a while loop that adds up a list. How many tests do you need for node coverage, edge coverage and prime path coverage? Why are the numbers different?

## Slide 14
Part 2: Data Flow Testing
Where does a value come from, and where does it go?

## Slide 15
Definitions and Uses
Data flow testing follows the values of variables along the control flow graph.
A definition (def) is a place where a variable gets a value: an assignment, an input statement or a parameter that is passed in. A use is a place where the value is read. A use inside a computation is a c-use; a use inside a decision, as in if (total > 200), is a p-use.
A du-pair is a definition and a use of the same variable where at least one path leads from the def to the use with no other def of that variable on the way. Such a path is called def-clear.
In our restaurant, the sauce is defined when the cook prepares it and used when a plate is served with it. If someone remakes the sauce in between, the first batch never reaches that plate.

## Slide 16
Defs, Uses and Def-Clear Paths
1
price = read_price()
def of price
2
if price > 100:
p-use of price
3
price = 100
def of price
4
print(price)
c-use of price
du-pairs for price: (1, 2), (1, 4), (3, 4)
A pair only counts if some path from the def to the use has no other def of price on the way.
T
F
1
2
3
4
T
F
1
2
3
4
1 → 2 → 4 is def-clear, so (1, 4) is a du-pair.
1 → 2 → 3 → 4 is not def-clear for (1, 4): line 3 gives price a new value.

## Slide 17
A Small Data Flow Example
The bill for one table, with 10% off when it is above 200 TL:
1   total = 02   for item in order:3       total = total + item.price4   if total > 200:5       total = total * 0.96   print(total)
The variable total is defined on lines 1, 3 and 5. It is used on lines 3, 5 and 6 (c-uses) and on line 4 (p-use).
Think: List every du-pair for total. Which pairs can only be covered with an empty order? Which test covers the pair (line 1, line 6)?

## Slide 18
Data Flow Coverage Criteria
All-defs coverage needs, for every definition, one def-clear path to at least one of its uses.
All-uses coverage needs, for every definition, a def-clear path to every use that the definition can reach.
All-du-paths coverage needs every simple def-clear path from each definition to each of its uses.
Each criterion subsumes the one before it. All-du-paths can need many more tests than all-uses when there are branches or loops between a definition and its use.
In our restaurant, all-defs checks that every batch of sauce reaches at least one plate, and all-uses checks that it reaches every plate it should.

## Slide 19
All-Defs and All-Uses on One Example
def
line 1
def
line 3
use
line 2
use
line 4
def
line 1
def
line 3
use
line 2
use
line 4
All-defs: each def reaches at least one use.
price = 150 runs 1 → 2 → 3 → 4 and covers (1, 2) and (3, 4). One test is enough.
All-uses: each def reaches every use it can reach.
Add price = 50, which runs 1 → 2 → 4 and covers (1, 4). Two tests.
Your assignment asks for the same analysis on the bill code.

## Slide 20
Data Flow Anomalies
Some data flow problems are visible before any test runs:
A variable is defined and never used. The work is wasted, or the value was meant to go somewhere and did not.
A variable is defined twice with no use in between, so the first value is lost.
A variable is used before any definition. Where the language does not stop this at compile time, the program reads a default or leftover value.
Compilers and linters report many of these. Data flow testing adds the dynamic part: it runs the paths between definitions and uses and checks the results.
Think: Take a function you wrote last semester and one variable in it. List its definitions and uses. Which du-pairs does your current test suite cover?

## Slide 21
Two Subsumption Ladders
Graph coverage
Data flow coverage
Complete path
Prime path
Edge-pair
Edge
Node
ISTQB: branch coverage
ISTQB: statement coverage
no self-loops
All-du-paths
All-uses
All-defs
An arrow from A to B means A subsumes B: every test set that satisfies A also satisfies B. The dashed arrow holds only on graphs without self-loops.

## Slide 22
Part 3: Decision Tables
How do we test every combination of business rules?

## Slide 23
Advanced Test Design
There are several test case design techniques. In this part, we will learn how to use the Decision Table technique effectively to write test cases for an application with complex Business Logic.

## Slide 24
Advanced Test Design
The rules and validations of business take up a major portion of the requirements given by the customers.
While observing how these requirements are represented and communicated to the entire project team by Business Analysts or customers, we come to know that most of such business rules and logic are presented in a logical process flow diagram.

## Slide 25
Advanced Test Design
A logical process Flow diagram for a complex requirement comprises many branches, nodes, and decision boxes.
Testers are expected to cover all those branches and touch every nook and corner of such a complex logical tree.
Testers have faced such complex business flows and tried many test case/test scenario preparation techniques to make the process easier.

## Slide 26
Parts of a Decision Table
The ISTQB Foundation syllabus (v4.0.1) describes a decision table like this:
The rows hold the conditions (inputs) and the actions (outputs) of the system. Each column is a rule: one combination of conditions and the actions that follow from it.
A condition is written T (satisfied) or F (not satisfied). A dash (-) means the condition does not affect the outcome, and N/A means the combination is infeasible. For actions, X means the action happens and a blank means it does not.
A full table has a column for every combination, so n true/false conditions give 2^n columns. The table can be minimized by merging columns in which some conditions do not change the outcome.

## Slide 27  [images: 1]
Decision Table Example
The first step we do is to name all the branches and leave them with numbers or alphabets as below.
1, 2, 3 are the leaves and a, b & c are the branches.
Slide images (read these for content): img/week06/slide27-1.png

## Slide 28  [images: 1]
Decision Table Example
Then, we have to create a Decision table as shown below:
Slide images (read these for content): img/week06/slide28-1.png

## Slide 29
Reading the Tutorial Table
Tutorial layout: one row per rule
Rule
Any field blank?
Both valid?
Result
1
YES
NA
Ask for non-blank credentials
2
NO
NO
Ask for valid credentials
3
NO
YES
Log in
ISTQB layout: one column per rule
R1
R2
R3
C1  Any field blank?
T
F
F
C2  Both valid?
-
F
T
A1  Ask for non-blank credentials
X
A2  Ask for valid credentials
X
A3  Log in
X
Same three rules in both tables. The tutorial lists rules as rows; ISTQB gives each rule a column, so conditions and actions become rows.
The tutorial's NA means “does not matter”, which ISTQB writes as “-”. ISTQB keeps N/A for combinations that cannot happen.

## Slide 30
The Login Example in ISTQB Notation
Conditions: C1, both fields are filled in; C2, the user id and password are valid.
Rule 1: C1 = F, C2 = - (does not matter). Action: “Please enter non blank credentials”.
Rule 2: C1 = T, C2 = F. Action: “Enter valid credentials to login”.
Rule 3: C1 = T, C2 = T. Action: log in.
Rule 1 merges two columns of the full table, because C2 does not matter when a field is blank. The minimized table has three columns, so three test cases reach 100% decision table coverage.

## Slide 31
The Login Table, Full and Minimized
Full table: 2 conditions, 4 columns
1
2
3
4
C1  Both fields filled?
F
F
T
T
C2  Valid user id and password?
F
T
F
T
A1  Ask for non-blank credentials
X
X
A2  Ask for valid credentials
X
A3  Log in
X
Minimized: 3 columns
R1
R2
R3
C1  Both fields filled?
F
T
T
C2  Valid user id and password?
-
F
T
A1  Ask for non-blank credentials
X
A2  Ask for valid credentials
X
A3  Log in
X
When C1 is F, the outcome is the same for either value of C2, so columns 1 and 2 merge into R1 with C2 = “-”. Three columns remain, so three tests reach 100% decision table coverage.
C1 here asks whether both fields are filled, so the tutorial's YES (a field is blank) appears as F.

## Slide 32
Decision Table Rules
All the validations specified in the decision boxes should be made of the columns on the table.
All the results (leaves) mentioned in the flow diagram should be covered in the decision table.
All combinations of inputs needed to obtain a certain result shall be mentioned in the combinations column and can be included while writing the test cases.
After completing the Decision table, one has to just verify whether all the branches and leaves in the logical tree are covered.

## Slide 33
Decision Table Coverage
In decision table testing the coverage items are the columns with feasible combinations of conditions. Coverage is the number of columns exercised by the tests divided by the number of feasible columns.
100% decision table coverage tests every rule once. It does not test the values inside a condition, such as which field is blank, which password is wrong or how long a user id may be. Equivalence partitioning and boundary value analysis cover that part.
Think: The restaurant gives students 10% off and gives a free dessert with orders over 400 TL, but both offers end at 18:00. Build the full decision table, then minimize it. How many tests do you need for 100% coverage?

## Slide 34
Advantages of Using the Decision Table Technique
1) Any complex Business flow represented as a diagram can be covered with this technique, and missing or contradictory rules show up as empty or conflicting columns.
2) The result can be measured: every feasible column becomes at least one test case, and coverage can be counted.
3) Easy to understand. Anyone can make test cases from this Decision table template.
4) Less rework on the test cases and test scenarios, because missing combinations are found before the tests are written. The table itself still needs a review: a wrong rule in the table gives a wrong test.

## Slide 35
Disadvantages of Using the Decision Table Technique
1) Certain test case preparation techniques like Boundary Value Analysis (BVA) and Equivalence Partitioning (EP) cannot be directly accommodated in this template. But, one can note it down in the combinations column and use them while writing test cases.
2) The table grows quickly. Ten true/false conditions give 1,024 columns before minimization.
3) A decision table describes combinations of conditions at one moment. When the result depends on the order of events (an order that is placed, paid and then cancelled), state transition testing fits better.

## Slide 36
How Fast a Decision Table Grows
n true/false conditions give 2^n columns before minimization.
Ten conditions already mean 1,024 columns, one test each.
Think: Open Question 4 asks you to look up pairwise testing. What does it give up to stay small?

## Slide 37
Part 4: Choosing a Technique
Which technique fits which requirement?

## Slide 38
Other Test Case Design Techniques
1) Boundary Value Analysis is a Software Testing technique in which test cases are designed to include representatives of boundary values in and out of a given range. The ISTQB syllabus has two variants: 2-value BVA tests each boundary and its closest neighbour, 3-value BVA tests the boundary and both neighbours.
2) Equivalence Partitioning, also called Equivalence Class Partitioning, is a Software Testing technique that divides the given condition into partitions, and one input data from each partition can be chosen for testing.

## Slide 39
Partitions and Boundaries on One Input
Requirement: a password is 8 to 16 characters long.
0
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
length
too short: 0 to 7
valid: 8 to 16
too long: 17 and up
EP
one value per partition, e.g. 4, 12, 20
2-value BVA
0, 7, 8, 16, 17
3-value BVA
0, 1, 6, 7, 8, 9, 15, 16, 17, 18
Boundary values are the smallest and largest value of every partition, invalid ones included. Length 0 has no lower neighbour, so it adds only itself. Source: ISTQB, Boundary Value Analysis white paper (2025).

## Slide 40
Other Test Case Design Techniques
3) State Transition testing is a black-box testing technique, which can be used to design test cases for a system that acquires a finite number of states and can transit from one state to another upon specific events. Its coverage is measured as all states, all valid transitions, or all transitions including attempts at invalid ones.
4) Use Case Testing: in this technique, use cases/scenarios are used to write the test cases. The interaction of users and systems is described in a use case. The current ISTQB Foundation syllabus (v4.0.1) no longer lists it; Ammann and Offutt treat use cases as graphs (Section 7.6).

## Slide 41
An Order as a State Machine
Placed
Paid
Shipped
Cancelled
pay
ship
cancel
cancel (refund)
cancel: rejected
(invalid transition)
Coverage can target all states, all valid transitions, or all transitions including attempts at invalid ones, such as cancelling a shipped order.
Think: how many tests does each level need for this machine?

## Slide 42
Experience-Based Techniques
5) Error Guessing is a technique where the experience of a tester is used to find the errors or part of an application with the highest possibility of finding errors. It has no formal rules, but testers often work from lists of faults they have seen before.
6) Exploratory testing designs, runs and evaluates tests at the same time, often inside a fixed time box and with a short written charter.
7) Checklist-based testing works through a list of conditions to check, built from experience, standards or earlier defects.
Think: Write a five-item error guessing checklist for the login page. Which items would the decision table never produce?

## Slide 43
Why Other Techniques Are Not Enough
Why can’t other test case design techniques for Business logic prove to be useful as Decision Tables?

## Slide 44
Why Other Techniques Are Not Enough
1) Boundary Value Analysis and Equivalence Partitioning work on the input domain. EP fits any kind of input (numbers, text, options), while BVA needs values that have an order. Both of these techniques alone cannot ensure 100% Test Coverage for business rules, because they do not test combinations of conditions.
2) Error Guessing is more about the experience. Though experience is required, it cannot prove to be everything.
3) State Transition testing covers states and transitions, and its state diagram or state table is a test artifact in the same way as a decision table. It fits behaviour that depends on the order of events better than fixed combinations of rules.

## Slide 45
Conclusions
For writing test cases for business logic, it is advisable to follow the below steps to prepare test cases so as to ensure maximum Test Coverage:
Step 1) Use a Decision Table test case design technique to test every feasible combination of the business rules (100% decision table coverage).
Step 2) Boundary Value Analysis and Equivalence partitioning for covering various ranges of inputs.

## Slide 46
Conclusions
Step 3) Combinations and permutations for field-level validations (though not all permutations are required).
Step 4) Error guessing (apart from the errors that can be identified from the above three steps) with experience as a final touch.
For the code behind the rules, check node and edge coverage of its control flow graph, and data flow coverage for the variables that carry the business values.

## Slide 47
Open Questions
No answers on this slide. Bring your reasoning to class.
1) A test suite reaches 100% edge coverage and still misses a bug. Write a five-line function where this happens.
2) Show on a small graph that edge-pair coverage subsumes edge coverage.
3) Which data flow anomalies can your compiler or linter report, and which ones only a test can reveal?
4) When does a decision table become too large to use? Look up pairwise testing and explain what it gives up.
5) The login page passes all three decision table tests. Name two defects that could still be there.

## Slide 48
Assignment
Tutorial: How to Write Test Cases in Software Testing
1) Read the tutorial and use its test case format for the two tasks below.
2) Build the full and the minimized decision table for the restaurant discount rule (Decision Table Coverage slide), then write one test case per feasible column.
3) Draw the control flow graph of the bill code (A Small Data Flow Example slide). List the tests for edge coverage and for all-uses coverage of the variable total.

## Slide 49
Where to Look Next
ISTQB CTFL Syllabus v4.0.1, Chapter 4: equivalence partitioning, boundary values, decision tables, state transitions, statement and branch coverage.
Ammann and Offutt, Introduction to Software Testing (2nd ed.): Chapter 6 (input space partitioning) and Chapter 7 (graph coverage, with data flow in Section 7.2.3).
Think: Read Section 7.2.3 of the book and compare its data flow criteria with the ones on these slides.

## Slide 50
Info for Midterms
Book pdf: Introduction to Software Testing (Part 1-2-3)(end of page 183)
Slides: week1 - week6 (include)
Tutorials
Good Luck!
