# week07

## Slide 1
CEN315
Introduction to Test Engineering
Week 7

## Slide 2  [images: 1]
Model and Property-Based Testing
QuickCheck (Haskell) & jqwik (Java) in Test Engineering
Goal: Understand the idea of QuickCheck/jqwik and be able to write simple properties
Slide images (read these for content): img/week07/slide02-1.png

## Slide 3
Why This Topic Matters
Traditional (example-based) testing:
“For this input, I expect that output.”
Problems:
Test cases are manually chosen → human bias
Corner cases are often missed
Property-based testing:
We specify properties that must always hold
The tool automatically generates many random test cases to check them

## Slide 4
Basic Concept: What Is a Model?
Model:
A simplified, abstract representation of the real system
Easier to reason about, less complex than the real implementation
Purpose:
Compare the complex implementation against a simple, trusted model
Example:
Real system: highly optimised Set implementation
Model: simple List + rule “no duplicates allowed”

## Slide 5
Basic Concept: What Is a Property?
A statement that should always be true for the system
“For any valid input, this condition must hold.”
Example properties:
reverse(reverse(xs)) == xs
For a sorting function:
The output is sorted
The output contains exactly the same elements as the input
Property-based testing:
Check these properties on many random inputs

## Slide 6
Model-Based Testing (High-Level)
Steps:
Define an abstract model of the system
Define the same operations for model and real system
Generate random sequences of operations
Run operations on both model and real system
Compare states and outputs
Typical use cases:
State machines, protocols, APIs, data structures

## Slide 7
Property-Based Testing (High-Level)
Core ingredients:
Generators: produce random input data
Properties: boolean conditions (true/false)Shrinking: minimize failing test cases
QuickCheck/jqwik:
Systematically explore the input space
Often discover corner cases you didn’t anticipate

## Slide 8  [images: 1]
Introduction to QuickCheck (Haskell)
QuickCheck: popular property-based testing library in Haskell
Main ideas:
Properties have type Property (or Bool)
Arbitrary typeclass provides random data generation
Slide images (read these for content): img/week07/slide08-1.png

## Slide 9
How QuickCheck Works
What does quickCheck prop_reverse do?
Uses the Arbitrary instance for [Int]
Generates many random integer lists (e.g. 100 by default)
Runs prop_reverse for each list
If all pass:
+++ OK, passed 100 tests.
If one fails, it reports a counter-example

## Slide 10
Types of Properties (QuickCheck Perspective)
Algebraic properties:
Identity: f(x) == x
Involution: reverse (reverse xs) == xs
Composition: f (g x) == h x
Collection properties:
sort result is ordered
insert preserves membership
Statistical properties (more advanced):
Distribution of random outputs, etc.

## Slide 11
Introduction to jqwik (Java)
jqwik: property-based testing library for the JVM
Integrates with JUnit 5 (JUnit Jupiter)
Key annotations:
@Property – defines a property
@ForAll – marks parameters that jqwik should generate
Included via Maven/Gradle (for the course, focus on concepts & small examples)

## Slide 12  [images: 1]
Simple jqwik Example (Reverse Twice)
jqwik:
Automatically generates many List<Integer> values
Checks that the property holds for all generated lists
Slide images (read these for content): img/week07/slide12-1.png

## Slide 13
jqwik: Core Concepts
@Property:
Similar to a JUnit test, but runs with many inputs, not just one
@ForAll:
Asks jqwik to supply random values for that parameter
Defaults:
Typically 100 runs per property (configurable)

## Slide 14
Generators: Why We Need Them
Why custom generators?
We may not want all possible values
Examples:
Only positive integers
Only odd numbers
Strings with limited length/characters
In jqwik:
Named generators via @Provide
Use them via @ForAll("name")

## Slide 15  [images: 1]
Custom Generator Example (jqwik)
Only strings of length 1–5, lowercase letters
Property: toUpperCase must not change the string length
Slide images (read these for content): img/week07/slide15-1.png

## Slide 16
What Is Shrinking?
When a property fails:
jqwik/QuickCheck tries to shrink the failing input
Goal:
Find the smallest, simplest failing example
Example:
Original failing list: 100 elements
After shrinking: minimal failing list with maybe 2 elements
Makes debugging much easier

## Slide 17  [images: 1]
Example: Modulo Property (Incorrect Assumption)
Intuition: a % b is between 0 and b - 1
Problem: in Java, modulo with a negative a can be negative
jqwik will find a counter-example, e.g.:
a = -1, b = 2, then -1 % 2 == -1
You discover a language-specific corner case

## Slide 18
Property-Based vs Example-Based Testing
Example-based testing:
Pros:
Easy to understand
Good for specific scenarios / use cases
Cons:
Limited number of inputs
Often misses boundary cases
Property-based testing:
Pros:
Many automatically generated inputs
Better chance to hit corner cases
Cons:
Harder to define good properties
Requires more abstract thinking

## Slide 19
When to Use Property-Based Testing?
Works particularly well for:
Pure functions (no side effects)
Data structures (stack, queue, set, map)
String manipulation, parsing
Mathematical functions, algorithms
Model-based testing:
State machines (protocols, device states)
APIs and complex workflows

## Slide 20
QuickCheck vs jqwik
QuickCheck (Haskell):
Origin of property-based testing
Strong support in functional programming community
Uses Arbitrary typeclass for generators
jqwik (Java):
Fits naturally into JUnit 5 test suites
Easy to integrate into existing Java projects
Both provide:
Random generation
Shrinking
Property-focused thinking

## Slide 21
Industrial Perspective
Where is it used?
Library development (collections, parsers, compilers)
Finance, telecom, network protocols
Advantages:
Strengthens regression test suites
Reduces manual test case design effort
Challenges:
Learning curve for developers/testers
Teams used to example-based thinking may resist at first

## Slide 22
Summary
Model-based testing:
Compare complex implementations with a simple, trusted model
Property-based testing:
Test general properties instead of individual examples
QuickCheck & jqwik:
Offer powerful frameworks for random generation and shrinking
For test engineering:
Provides more systematic and thorough testing
Very effective for finding corner cases and unexpected behaviours
