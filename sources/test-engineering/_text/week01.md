# week01

## Slide 1
CEN315
Introduction to Test Engineering
Week 1

## Slide 2
The Role of Test Engineering and Quality Fundamentals
Differentiate QA, QC, testing, verification, and validation with correct terminology.
Identify static vs. dynamic testing activities and perform a lightweight requirements/testability review.
Explain test levels (unit, integration, system, acceptance)

## Slide 3
What is Test Engineering?

## Slide 4
What is Test Engineering?
Modern Definition: Test Engineering is a proactive quality assurance discipline that integrates quality considerations throughout the entire software development lifecycle, focusing on preventing defects and ensuring system reliability, security, and user satisfaction.

## Slide 5
Terminology: QA, QC, Testing, Verification & Validation
Quality Assurance (QA): Process-oriented activities that establish confidence that quality will be achieved—policies, standards, audits, improvement loops.
Quality Control (QC): Product-oriented activities that evaluate whether a specific deliverable meets requirements—reviews, inspections, testing outcomes. In ISO 9000 terms, QC provides confidence that quality requirements have been fulfilled.
Testing: Dynamic evaluation of a product by executing it under specified conditions and observing outcomes; provides information about risk and quality, not guarantees.
Verification vs. Validation: ‘Are we building the product right?’ vs. ‘Are we building the right product?’
Verification checks conformance to specs;
Validation checks fitness for purpose with stakeholders.

## Slide 6  [images: 1]
Terminology: QA, QC, Testing, Verification & Validation
Slide images (read these for content): img/week01/slide06-1.png

## Slide 7
Quality Models (ISO/IEC 25010 summary)
The product quality model identifies these characteristics and exemplar sub‑characteristics:
Functional suitability — completeness, correctness, appropriateness
Performance efficiency — time behavior, resource utilization, capacity
Compatibility — coexistence, interoperability
Usability — appropriateness recognizability, learnability, operability, user error protection, user interface aesthetics, accessibility
Reliability — maturity, availability, fault tolerance, recoverability
Security — confidentiality, integrity, non‑repudiation, accountability, authenticity
Maintainability — modularity, reusability, analyzability, modifiability, testability
Portability — adaptability, installability, replaceability
Use the model as a trade‑off framework to focus testing on what matters most for the context.
(ISO - International Organization for Standardization) (IEC - International Electrotechnical Commission)

## Slide 8
Static vs. Dynamic Testing
Static testing (shift‑left): Evaluate artefacts without executing code. Examples: requirements walkthroughs, design reviews, code reviews, checklists, linters, SAST, secret scanning, dependency/SBOM checks.
Benefits: early defect detection, cheaper fixes, better shared understanding.
Dynamic testing: Execute the system or components. Examples: unit, API/integration, system, UAT, performance, security, accessibility, usability.

## Slide 9
Core Test Design Techniques (with mini‑exercise)
Equivalence Partitioning (EP): Partition inputs into classes expected to behave similarly; test one representative from each class.
Boundary Value Analysis (BVA): Defects cluster at boundaries; test min, min±1, max, max±1, and just‑inside/just‑outside values.
Decision Tables / Cause‑Effect: For logic with multiple conditions; enumerate combinations and expected outcomes; minimize using pairwise where appropriate.
Instead of testing everything, selecting a small number of tests that are representative of the system or have a high probability of revealing errors.

## Slide 10
Worked Example
Spec: Password must be 8–20 chars; must include at least one letter and one digit; spaces not allowed.
EP: length <8 (invalid), 8–20 (valid), >20 (invalid); char class sets containing letters only, digits only, both; presence/absence of spaces.
BVA: lengths 7, 8, 9, 20, 21; include samples with/without spaces.
Decision table: conditions: length_ok, has_letter, has_digit, has_space; derive expected valid/invalid outcomes; select minimal covering set.

## Slide 11
Core Test Design Techniques
EP > Identify equivalence classes > Select a representative from each class
BVA > Identify boundaries > Test just below, at, and just above the boundary
Decision Table > Identify conditions > Derive combinations of conditions > Determine the expected result for each combination

## Slide 12
Practice (Homework):
Design a minimal test set for an input field that accepts integers 1–999, rejects leading zeros, and formats thousands with no separators. Provide EP and BVA cases plus two negative tests.

## Slide 13
Risk‑Based Testing (RBT)
Prioritize tests by risk: risk = likelihood × impact × detectability. Use a simple FMEA‑style table.
Sample rubric (1–5 scale):
Likelihood: 1=rare, 5=frequent in field or code‑change area
Impact: 1=cosmetic, 5=safety/financial/regulatory breach
Detectability: 1=easy to detect pre‑release, 5=hard to detect until production
High RPN items (L×I×D) get deeper testing (additional scenarios, negative tests, fuzzing, stress/perf, security probes). Document explicit de‑scoping with justification.

## Slide 14  [images: 2]
Risk‑Based Testing (RBT)
Slide images (read these for content): img/week01/slide14-1.png, img/week01/slide14-2.png

## Slide 15
Role of Test Engineers in the Software Development Lifecycle
Sequential Development (Waterfall)
Incremental Development
Agile and DevOps Environments
AI-Assisted Software Development ?

## Slide 16
Role of Test Engineers in the Software Development Lifecycle
Sequential Development (Waterfall)
Requirements
Design
Implementation
Testing
Deployment
Maintenance
Test engineer's role: test as a distinct downstream phase
Incremental Development
Software developed and tested in increments
Regression testing becomes important
Test engineers participate repeatedly across increments
Early feedback becomes possible

## Slide 17
Role of Test Engineers in the Software Development Lifecycle
Agile and DevOps Environments
Continuous integration and continuous delivery
Continuous testing
Test automation
Shift-left testing
Test engineers become integrated members of cross-functional teams
AI-Augmented (Assisted) Software Development
AI-assisted requirements engineering
AI-assisted design
AI code generation
AI-assisted debugging
AI-generated test cases
AI-based test execution and analysis
AI-assisted code review
Automated documentation
Agentic software development

## Slide 18
Modern Test Engineer Responsibilities
Technical Activities:
Design and execute test cases across multiple levels
Develop and maintain test automation frameworks
Perform risk-based testing and impact analysis
Create test environment requirements and manage test data
Conduct exploratory and session-based testing
Daily Activities Example
Morning routine:
Review overnight CI/CD test results
Discuss blocking issues with development team
Plan testing activities for current sprint
Update test execution status and coverage

## Slide 19
Modern Test Engineer Responsibilities
Collaborative Responsibilities:
Participate in requirements reviews and design discussions
Work with developers on testability improvements
Provide input on user experience and product strategy
Facilitate communication between technical and business teams
Quality Assurance Focus:
Establish quality gates and exit criteria
Monitor quality metrics and reporting
Support continuous improvement initiatives
Ensure compliance with quality standards

## Slide 20
Testing Types and Levels
Testing Level Hierarchy
Testing levels represent different phases based on scope and integration level of the system under test.
The Testing Pyramid
Base (Unit Tests): Many tests, fast execution, low cost
Middle (Integration Tests): Moderate number, medium speed/cost
Top (System/E2E Tests): Fewer tests, slower execution, higher cost

## Slide 21
Testing Types and Levels - Unit Testing
Scope: Individual components, functions, or modules
Performed by: Developers
Environment: Development with mocked dependencies
Techniques: Primarily white-box testing
Characteristics:
Tests smallest testable parts
Fast execution and fully automated
High code coverage achievable
Independent tests in any order
Example: Testing a calculator's add() function with various input combinations

## Slide 22
Testing Types and Levels - Integration Testing (API)
Scope: Interactions between integrated components/modules
Types:
Component Integration: Between software components
System Integration: Between different systems
Integration Strategies:
Big Bang: All modules integrated simultaneously
Incremental:
Top-down: Start with top-level, use stubs
Bottom-up: Start with low-level, use drivers
Sandwich/Hybrid: Combines both approaches
Example: Testing integration between user authentication and profile modules to ensure proper data flow after login

## Slide 23
Testing Types and Levels - System Testing
Scope: Complete integrated application
Environment: Production-like environment
Performed by: Independent test team
Types of System Testing:
Functional: Features work as specified
Performance: Response times, throughput, scalability
Security: Authentication, authorization, data protection
Usability: User experience and interface design
Compatibility: Different browsers, operating systems

## Slide 24
Testing Types and Levels - Acceptance Testing
Scope: Validation against business requirements and user needs
Types:
Alpha Testing: Internal testing by organization
Beta Testing: External users in real environment
User Acceptance Testing (UAT): Final validation by business users
Acceptance Criteria Examples:
System processes 1,000 transactions per minute
95% of users complete checkout within 3 minutes
All regulatory compliance requirements met

## Slide 25
Ethics & Professionalism
Report truthfully; quantify uncertainty and risk.
Respect privacy and Personally Identifiable Information (PII); use masked or synthetic data where possible.
Document residual risk and assumptions explicitly.

## Slide 26
Skills Roadmap (Self‑Assessment)
Unit/API testing (framework fluency)
Test design techniques (EP/BVA/decision tables/state)
Automation maintainability (page‑object/screenplay, fixtures, data builders)
Security & accessibility basics
Observability & performance testing
Risk analysis & communication

## Slide 27
Professional Certifications
ISTQB Certification Path (https://istqb.org/certifications/):
Foundation Level (CTFL): Entry-level industry standard
Advanced Level: Test Analyst, Test Manager, Technical Test Analyst
Specialist: Performance, Security, Mobile, AI Testing
Expert Level: Strategic and operational management
Industry Value:
Global recognition across 120+ countries
Structured learning path with clear progression

## Slide 28
References & Further Reading
ISO/IEC/IEEE 29119 Software Testing (process guidance)
ISO/IEC 25010 Systems and software quality models
ISTQB Foundation Syllabus (for terminology alignment)
Kaner, Bach, Pettichord — Lessons Learned in Software Testing
Google Testing Blog; Thoughtworks Technology Radar (testing)
OWASP Testing Guide; WCAG 2.2 Quick Reference
