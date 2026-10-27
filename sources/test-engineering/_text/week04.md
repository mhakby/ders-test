# week04

## Slide 1
CEN315
Introduction to Test Engineering
Week 4

## Slide 2  [images: 1]
Coverage Metrics and Mutation Testing
How good is a test suite? This week we study two complementary answers:
Code coverage: how much of the code do the tests execute?
Mutation testing: can the tests detect small faults that are deliberately injected into the code?
Coverage criteria in this lecture: statement, branch (decision), function, condition, path, line and loop coverage.

## Slide 3
What is Code Coverage?
Code coverage is a metric that quantifies how much of a program's source code is executed when the test suite runs.
It is a white-box metric: measuring it requires access to the source code.
It helps developers identify the parts of an application that the tests never execute.

## Slide 4
Why Measure Code Coverage?
Clients expect software that is correct, reliable, secure and maintainable, and the development team is responsible for delivering it.
Code coverage supports this goal indirectly: it shows which parts of the code no test has exercised.
Important: coverage shows what was executed, not whether the results were checked. High coverage alone does not prove that the tests are good.

## Slide 5
How is Code Coverage Calculated?
The general formula is:
Code Coverage = (Covered items / Total items) × 100
The “item” depends on the criterion: statements, lines, branches, conditions, functions or paths.
Example: if the tests execute 45 of 60 statements, statement coverage = 45 / 60 × 100 = 75%.

## Slide 6
Types of Code Coverage
1. Statement Coverage (Block Coverage)
Definition: Measures whether each statement in the source code has been executed at least once.
Formula: Statement Coverage = (Statements executed / Total statements) × 100
Example: If a function has ten statements and the tests execute eight of them, statement coverage is 80%.

## Slide 7
Types of Code Coverage
2. Branch Coverage (Decision Coverage)
Definition: Measures whether every possible outcome (true and false) of each decision point, such as if, while or switch, has been executed.
Formula: Branch Coverage = (Branch outcomes executed / Total branch outcomes) × 100
Example: An if statement without an else has two outcomes. A single test that makes the condition true can reach 100% statement coverage, but only 50% branch coverage.

## Slide 8
Types of Code Coverage
3. Function Coverage
Definition: Measures whether each function (or method) has been called at least once.
Formula: Function Coverage = (Functions called / Total functions) × 100
Example: If a class has five methods and the tests call four of them, function coverage is 80%. This is the weakest criterion: a called function may still contain untested code.

## Slide 9
Types of Code Coverage
4. Condition Coverage
Definition: Measures whether each Boolean condition (sub-expression) inside a decision has evaluated to both true and false.
Formula: Condition Coverage = (Condition outcomes exercised / (2 × Number of conditions)) × 100
Example: In if (A && B), A and B must each be evaluated as true and as false at least once, which gives 4 condition outcomes in total.

## Slide 10
Condition Coverage ≠ Branch Coverage
100% condition coverage does not guarantee 100% branch coverage.
Example: if (A && B) { ... }, assuming that A and B are both evaluated in every test (no short-circuit evaluation).
Test 1:  A = true,   B = false   →   A && B = false
Test 2:  A = false,  B = true    →   A && B = false
Condition coverage: A and B each take both values, so condition coverage is 100%.
Branch coverage: the decision is never true, so the if body never runs. Branch coverage is 50%.
Condition/Decision Coverage and MC/DC require both kinds of coverage.

## Slide 11
Types of Code Coverage
5. Path Coverage
Definition: Measures whether every possible execution path through a function, from entry to exit, has been executed.
Formula: Path Coverage = (Paths executed / Total feasible paths) × 100
Limitations: n independent if statements can create up to 2^n paths, and loops can create an unbounded number. Some paths are infeasible: no input can execute them. 100% path coverage is therefore rarely practical.

## Slide 12
Types of Code Coverage
6. Line Coverage
Definition: Measures whether each executable line of source code has been executed.
Formula: Line Coverage = (Executed lines / Total executable lines) × 100
Example: If a file has 100 executable lines and 80 are executed during testing, line coverage is 80%.
Note: Line and statement coverage differ when one line contains several statements, e.g. if (x > 0) y = 1;

## Slide 13
Types of Code Coverage
7. Loop Coverage
Definition: Measures whether each loop has been executed with zero, one and multiple iterations.
Example: For a loop that processes the items in a list, test it with an empty list, a one-item list and a list with many items.
If a loop has a known maximum number of iterations (max), also test max − 1 and max iterations, and try max + 1. Off-by-one errors often hide at these boundaries.

## Slide 14
Exercise: Computing Coverage
int classify(int x, int y) {
int r = 0;
if (x > 0 && y > 0)
r = 1;
if (x == 0)
r = -1;
return r;
}
Test inputs (x, y):
T1 = (1, 1),   T2 = (0, 5),   T3 = (1, −1)
Compute statement, branch and condition coverage after T1, after T1 + T2, and after all three tests.
How many paths does the function have? Can all of them be executed? Why or why not?
Which test makes the condition (y > 0) false? Why does T2 not do it?
Which criteria reach 100% after only T1 + T2, and which do not?

## Slide 15
Comparing Coverage Criteria: Subsumption
Criterion A subsumes criterion B if every test set that satisfies A also satisfies B.
In the diagram, an arrow from A to B means that A subsumes B.
A stronger criterion needs more tests, but gives more confidence.
Branch coverage subsumes statement coverage, but not the other way round.
Condition coverage and branch coverage do not subsume each other.
Path
MC/DC
Condition/Decision
Branch (Decision)
Condition
Statement
Function

## Slide 16
MC/DC: Modified Condition/Decision Coverage
MC/DC requires that every condition and every decision take both true and false, and that each condition is shown to independently affect the outcome: changing only that condition changes the decision.
Example: if (A && B)
Test 1:  A = true,   B = true    →  true
Test 2:  A = false,  B = true    →  false   (only A changed)
Test 3:  A = true,   B = false   →  false   (only B changed)
Tests 1 and 2 show that A matters; tests 1 and 3 show that B matters.
For n conditions, MC/DC can often be achieved with n + 1 tests, instead of the 2^n tests needed to try every combination.
MC/DC is required for the most safety-critical avionics software (DO-178C, Level A).

## Slide 17
Tools for Code Coverage
Coverage tools are language-specific. Some widely used examples:
Language
Tools
Java
JaCoCo (older tools: Cobertura, Emma, Clover / OpenClover)
JavaScript / TypeScript
Istanbul (nyc); Jest and Vitest also have built-in coverage
Python
coverage.py, pytest-cov
C / C++
gcov (with lcov or gcovr), llvm-cov, BullseyeCoverage, Testwell CTC++
C# / .NET
Coverlet, dotCover, Visual Studio Code Coverage
Reporting platforms
Codecov, Coveralls, SonarQube: they collect and display reports from the tools above, but do not measure coverage themselves

## Slide 18
Advantages of Using Code Coverage
It reveals the parts of the code that no test executes.
It exposes dead or unreachable code.
It guides the design of additional test cases for untested code.

## Slide 19
Advantages of Using Code Coverage
It gives an objective, quantitative measure of how thoroughly the code is exercised.
It can be checked automatically in continuous integration (CI), for example to stop the coverage of new code from dropping.
It makes maintenance safer: well-covered code is protected by regression tests when it changes.

## Slide 20
Disadvantages of Using Code Coverage
Coverage shows what was executed, not what was verified: a test without any assertion can still reach 100% coverage.
It cannot detect missing code (faults of omission): if a requirement was never implemented, there is no code to cover.
100% is often impossible because of infeasible paths and defensive code that cannot be triggered.

## Slide 21
Disadvantages of Using Code Coverage
When coverage becomes a target, developers may write shallow tests just to raise the number (Goodhart's law).
Error-handling code is hard to cover; it often needs mocks, stubs or fault injection.
Complex code needs many test cases, and writing them requires solid unit-testing skills.

## Slide 22
Code Coverage: Research Questions
Investigate the following questions and cite your sources:
Google's engineering guidance defines “acceptable”, “commendable” and “exemplary” coverage levels. What are they, and why is 100% not required?
Inozemtseva and Holmes (ICSE 2014) studied coverage and test suite effectiveness. What did they find, and how did they measure effectiveness?
The “Condition Coverage ≠ Branch Coverage” example assumes no short-circuit evaluation. Does it still hold for && in C or Java? Explain.
What is multiple condition coverage? Where would it appear in the subsumption diagram?
The figure on slide 2 calls condition coverage “predicate coverage”, but Ammann & Offutt use “predicate” and “clause” coverage differently. Compare the definitions.
Which coverage criteria do DO-178C (avionics) and ISO 26262 (automotive) require at each criticality level, and why?

## Slide 23
Mutation Testing
Mutation testing is a fault-based, white-box technique for evaluating the quality of a test suite.
Small changes (mutations) are deliberately made to the source code. Each modified version of the program is called a mutant.
If the tests detect the change, the test suite is effective. If they do not, the tests have a weakness.
Key idea: mutation testing tests the tests, not the program.

## Slide 24
History of Mutation Testing
Mutation testing was first proposed by Richard Lipton in 1971 and formalised by DeMillo, Lipton and Sayward in 1978.
Its high computational cost initially limited its use. Faster hardware and better tools have made it practical: today, mature tools exist for Java, JavaScript/TypeScript, C#, Python, C/C++ and other languages.

## Slide 25
Why Do Small Mutations Work?
Mutations are deliberately small. Two hypotheses (DeMillo, Lipton and Sayward, 1978) justify this:
1. Competent Programmer Hypothesis: programmers usually write code that is close to correct, so real faults are often small deviations, such as < instead of <=.
2. Coupling Effect: tests that detect simple faults also tend to detect more complex faults made of several simple ones.
Together, they suggest that a test suite that kills simple mutants is also good at finding real faults.

## Slide 26
Objectives of Mutation Testing
The objectives of mutation testing are:
To measure how effective a test suite is at detecting faults.
To find code that is executed by tests but not properly checked.
To guide the design of new and stronger test cases.
To calculate the mutation score.
To understand how a fault propagates (or fails to propagate) to the output.
To compare the quality of different test suites.

## Slide 27
The Mutation Testing Process
Original program
(all tests pass)
Create mutants
(apply mutation operators)
Run the test suite
on each mutant
All tests pass:
mutant SURVIVED
At least one test fails:
mutant KILLED
Analyse the survivor:
equivalent or missing test?
Add or improve tests
(they must pass on the original)
Repeat until the mutation score is acceptable.

## Slide 28
Key Terms
Mutant: a copy of the program with one small change.
Mutation operator: a rule that creates mutants, e.g. replace < with <=, or delete a statement.
Killed mutant: at least one test fails on the mutant; the tests detected the change.
Survived (live) mutant: all tests pass on the mutant; the change went unnoticed.
Equivalent mutant: syntactically different from the original, but behaves exactly the same. No test can kill it.
Stillborn mutant: a mutant that does not compile. It is discarded and not counted.

## Slide 29
Mutation Score
Mutation Score = Killed mutants / (Total mutants − Equivalent mutants) × 100
Stillborn (non-compiling) mutants are discarded before counting.
Example: 100 mutants are generated and 5 do not compile, which leaves 95. The tests kill 80 of them and 15 survive. Inspection shows that 5 of the survivors are equivalent.
Mutation score = 80 / (95 − 5) × 100 ≈ 88.9%. The other 10 survivors reveal weaknesses in the test suite.
Because equivalent mutants are usually unknown, many tools simply report killed / total mutants.

## Slide 30
Why Coverage Is Not Enough: The RIP Model
For a test to kill a mutant, three conditions must hold (Ammann & Offutt):
1. Reachability: the test executes the mutated statement.
2. Infection: after that statement, the program state differs from the state of the original program.
3. Propagation: the incorrect state reaches the output, and an assertion in the test checks it.
Code coverage only guarantees reachability. Mutation testing requires all three.

## Slide 31
Types of Mutation Testing
Mutants are created by mutation operators. A simple classification groups them into three types, based on the kind of change:
1. Value Mutations
Constant values are changed, typically a small value to a larger one, or a larger value to a smaller one.

## Slide 32  [images: 2]
Types of Mutation Testing
1. Value Mutations
With small inputs such as a = 1 and b = 2, both versions give c = 3, so the mutant survives: the choice of test data matters.
Slide images (read these for content): img/week04/slide32-1.png, img/week04/slide32-2.png

## Slide 33  [images: 2]
Types of Mutation Testing
2. Decision Mutations
Relational, logical or arithmetic operators in a decision are changed, e.g. < becomes >, or && becomes ||.
This mutant is easy to kill: almost any test with a ≠ b detects it. Changing < to <= is much harder to detect, because only a test with a == b kills it. This is why boundary-value tests matter.

## Slide 34
Types of Mutation Testing
3. Statement Mutations
A statement is deleted, duplicated or replaced, e.g. a method call is removed. Do the tests notice the missing behaviour?
Initial Code:
if (a < b)
c = 10;
else
c = 20;
Changed Code:
if (a < b)
;        // Mutation: statement deleted
else
c = 20;

## Slide 35
Equivalent Mutants
An equivalent mutant changes the code but not the program's behaviour. No test can kill it.
Initial Code:
for (int i = 0; i < 10; i++)
sum += i;
Changed Code:
for (int i = 0; i != 10; i++)
sum += i;
Both loops run exactly ten times, so the mutant behaves exactly like the original program.
Deciding whether a mutant is equivalent is undecidable in general, so surviving mutants often have to be inspected manually. This is one of the main costs of mutation testing.

## Slide 36
Tools for Mutation Testing
Mutation testing tools are also language-specific:
Language
Tools
Java
PIT (Pitest)
JavaScript / TypeScript, C#, Scala
Stryker (StrykerJS, Stryker.NET, Stryker4s)
Python
mutmut, Cosmic Ray
C / C++
Mull
Rust
cargo-mutants
PHP
Infection
Older Java tools such as Jester, Jumble, Judy and MuClipse are no longer actively developed.

## Slide 37
Advantages of Mutation Testing
It directly measures the fault-detection ability of a test suite, which coverage cannot do.
It shows exactly which change in which line the tests miss, so it guides new test cases.
With suitable operators, it is a stronger criterion than statement and branch coverage.
Empirical studies show that detecting mutants is correlated with detecting real faults.
It encourages precise assertions and boundary-value tests.

## Slide 38
Disadvantages of Mutation Testing
It is computationally expensive: each mutant requires running (part of) the test suite.
Equivalent mutants cannot be detected automatically in general and must be inspected manually.
It requires access to the source code, so it is not applicable to black-box testing.
Some mutants cause infinite loops or crashes, which tools must handle with timeouts.
Analysing surviving mutants requires good programming knowledge.

## Slide 39
Code Coverage vs Mutation Testing
Code Coverage
Mutation Testing
Question answered
Was the code executed?
Would the tests detect a fault?
RIP model
Reachability only
Reachability, infection and propagation
A test with no assertions
Can still reach 100%
Kills almost no mutants (only those that crash or hang)
Cost
Low: one run of the test suite
High: tests are run for every mutant
What it measures
How much of the code is exercised
How strong the tests are

## Slide 40
Mutation Testing: Research Questions
Investigate the following questions and cite your sources:
Offutt et al. (1996) found that a small set of mutation operators is almost as effective as the full set. Which operators are they, and why does this matter?
Just et al. (FSE 2014) asked whether mutants are a valid substitute for real faults. What did they conclude, and what evidence did they use?
Find at least three techniques that reduce the cost of mutation testing. How does each one work?
How does Google apply mutation testing at scale? (Petrović and Ivanković, ICSE-SEIP 2018)
Look at PIT's default mutators. Which of them match the value, decision and statement mutations in this lecture?

## Slide 41
References
P. Ammann and J. Offutt, Introduction to Software Testing, 2nd ed., Cambridge University Press, 2016.
R. A. DeMillo, R. J. Lipton and F. G. Sayward, “Hints on Test Data Selection: Help for the Practicing Programmer,” IEEE Computer, vol. 11, no. 4, 1978.
A. J. Offutt, A. Lee, G. Rothermel, R. H. Untch and C. Zapf, “An Experimental Determination of Sufficient Mutant Operators,” ACM TOSEM, vol. 5, no. 2, 1996.
L. Inozemtseva and R. Holmes, “Coverage Is Not Strongly Correlated with Test Suite Effectiveness,” ICSE 2014.
R. Just, D. Jalali, L. Inozemtseva, M. D. Ernst, R. Holmes and G. Fraser, “Are Mutants a Valid Substitute for Real Faults in Software Testing?,” FSE 2014.
G. Petrović and M. Ivanković, “State of Mutation Testing at Google,” ICSE-SEIP 2018.
C. Arguelles, M. Ivanković and A. Bender, “Code Coverage Best Practices,” Google Testing Blog, 2020.
RTCA, DO-178C: Software Considerations in Airborne Systems and Equipment Certification, 2011.
