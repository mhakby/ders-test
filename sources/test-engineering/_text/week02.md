# week02

## Slide 1
CEN315
Introduction to Test Engineering
Week 2

## Slide 2  [images: 2]
Testing
Slide images (read these for content): img/week02/slide02-1.png, img/week02/slide02-2.jpg

## Slide 3  [images: 1]
Verification & Validation
Verification vs. Validation: ‘Are we building the product right?’ vs. ‘Are we building the right product?’
Verification checks conformance to specs;
Validation checks fitness for purpose with stakeholders.
Slide images (read these for content): img/week02/slide03-1.jpg

## Slide 4  [images: 1]
Testing: White Box vs Black Box
Slide images (read these for content): img/week02/slide04-1.png

## Slide 5  [images: 2]
Testing: White Box vs Black Box
Black Box Testing is a way of software testing in which the internal structure or the program or the code is hidden and nothing is known about it.
White Box Testing is a way of testing the software in which the tester has knowledge about the internal structure or the code or the program of the software.

## Slide 6
Kinds of Testing
Static or Dynamic: Does it execute the code?
White or Black Box: Does it look at the code?
Functional or Random
Spec or Use

## Slide 7
JUnit vs NUnit
Addresses the problem: Testing is not closely integrated with development. This prevents you from measuring the progress of development-you can't tell when something starts working or when something stops working. Using Unit Tests you can cheaply and incrementally build a test suite that will help you measure your progress, spot unintended side effects, and focus your development efforts.
Philosophy:  Develop tests in parallel with application code or before!!
See: https://nunit.org/ and https://junit.org/

## Slide 8  [images: 1]
Testing Percentages
Unit tests verify behavior of a single class.
70% of your tests.
System tests verify class interactions.
20% of your tests.
GUI tests verify end-to-end journeys.
10% of your tests.
Slide images (read these for content): img/week02/slide08-1.png

## Slide 9  [images: 1]
Units
Slide images (read these for content): img/week02/slide09-1.png

## Slide 10  [images: 1]
Example (java)
Slide images (read these for content): img/week02/slide10-1.png

## Slide 11  [images: 1]
Example (java)
Slide images (read these for content): img/week02/slide11-1.png

## Slide 12
Example (java)
The assert section ensures that the code behaves as expected.
Assertions replace us humans in checking that the software does what it should.
They express requirements that the unit under test is expected to meet.
Now, often one can write slightly different assertions to capture a given requirement.

## Slide 13  [images: 1]
Example (java)
Slide images (read these for content): img/week02/slide13-1.png

## Slide 14  [images: 2]
Example (C#)
See: https://learn.microsoft.com/en-us/visualstudio/test/walkthrough-creating-and-running-unit-tests-for-managed-code?view=vs-2022
Slide images (read these for content): img/week02/slide14-1.png, img/week02/slide14-2.png

## Slide 15  [images: 1]
Example (C#)
Slide images (read these for content): img/week02/slide15-1.png

## Slide 16  [images: 1]
Example (C#)
Slide images (read these for content): img/week02/slide16-1.png

## Slide 17  [images: 2]
Example (C#)
The assert section ensures that the code behaves as expected.
Assertions replace us humans in checking that the software does what it should.
They express requirements that the unit under test is expected to meet.
Now, often one can write slightly different assertions to capture a given requirement.

## Slide 18  [images: 1]
Example (C#)
Slide images (read these for content): img/week02/slide18-1.png

## Slide 19  [images: 2]
Example (C#) See: https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices
Slide images (read these for content): img/week02/slide19-1.png, img/week02/slide19-2.png

## Slide 20  [images: 1]
Benefits of Unit Testing
Slide images (read these for content): img/week02/slide20-1.png

## Slide 21
Disadvantages of Unit Testing

## Slide 22
Disadvantages of Unit Testing
Time and Effort: Unit testing requires a significant investment of time and effort to create and maintain the test cases, especially for complex systems.
Dependence on Developers: The success of unit testing depends on the developers, who must write clear, concise, and comprehensive test cases to validate the code.
Difficulty in Testing Complex Units: Unit testing can be challenging when dealing with complex units, as it can be difficult to isolate and test individual units in isolation from the rest of the system.
Difficulty in Testing Interactions: Unit testing may not be sufficient for testing interactions between units, as it only focuses on individual units.

## Slide 23
Disadvantages of Unit Testing
Difficulty in Testing User Interfaces: Unit testing may not be suitable for testing user interfaces, as it typically focuses on the functionality of individual units.
Over-reliance on Automation: Over-reliance on automated unit tests can lead to a false sense of security, as automated tests may not uncover all possible issues or bugs.
Maintenance Overhead: Unit testing requires ongoing maintenance and updates, as the code and test cases must be kept up-to-date with changes to the software.

## Slide 24
How do developers use unit tests?
Unit testing plays an important role throughout the software development process:
Test-Driven Development (TDD): In TDD, developers write tests before writing the actual code. This ensures that once the code is completed, it instantly meets the functional requirements when tested, saving time on debugging.
After Completing Code Blocks: After a section of code is finished, unit tests are created (if not already done through TDD). These tests are then run to verify that the code works as expected. Unit tests are rarely the first set of tests run during broader system testing.
DevOps and CI/CD: In DevOps environments, Continuous Integration/Continuous Delivery (CI/CD) automatically runs unit tests whenever new code is added. This ensures that changes are integrated smoothly, tested thoroughly, and deployed efficiently, maintaining overall code quality.

## Slide 25  [images: 1]
How do developers use unit tests?
Slide images (read these for content): img/week02/slide25-1.png

## Slide 26
Manual Unit Testing vs Automated Unit Testing
Manual Testing is like checking each part of a project by hand, without using any special tools. People, like developers, do each step of the testing themselves. But manual unit testing isn't used much because there are better ways to do it and it has some problems:
It costs more because workers have to be paid for the time they spend testing, especially if they're not permanent staff.
It takes a lot of time because tests have to be done every time the code changes.
It is hard to find and fix problems because it is tricky to test each part separately.
Developers often do manual testing themselves to see if their code works correctly.

## Slide 27  [images: 1]
Next Week: Automated Unit Testing
Slide images (read these for content): img/week02/slide27-1.gif
