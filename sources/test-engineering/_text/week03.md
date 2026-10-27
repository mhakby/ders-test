# week03

## Slide 1
CEN315
Introduction to Test Engineering
Week 3

## Slide 2  [images: 1]
Advanced Unit Testing: TDD & Mocking
Why Advanced Unit Testing?
Bridge from basic tests to design-shaping tests
Speed, confidence, refactoring safety net
Foundation for automation & CI
Advanced unit testing turns tests into a design tool, not just a bug net. It speeds feedback, raises confidence, and lets you refactor safely as requirements evolve.

## Slide 3
Advanced Unit Testing: TDD & Mocking
Recap: What Is a Unit Test?
Tests a single unit in isolation (function/class)
Fast, deterministic, repeatable
Clear Arrange - Act - Assert structure
A unit test validates a small, isolated piece of code with fast, deterministic checks. It follows the Arrange - Act - Assert pattern to keep structure and intent clear.

## Slide 4  [images: 1]
Advanced Unit Testing: TDD & Mocking
TDD in a Nutshell
Red → Green → Refactor cycle
Write a failing test first (specification)
Make it pass with minimal code
Refactor with tests as safety net
Test-Driven Development follows Red → Green → Refactor. You write a failing test first, implement the minimal code to pass, then clean up the design with tests as a safety net.

## Slide 5  [images: 1]
Advanced Unit Testing: TDD & Mocking
TDD Workflow (Step-by-Step)
Pick a tiny behavior/user story
Write minimal failing test (RED)
Implement minimal solution (GREEN)
Refactor: clean code + tests (REFACTOR)
Repeat; keep cycles short (2–10 min)
Work in tiny steps: pick one behavior, write a failing test, make it pass, then refactor. Keep cycles short (minutes) to maintain momentum and reduce complexity.

## Slide 6  [images: 1]
Advanced Unit Testing: TDD & Mocking
What TDD Is Not
Not writing tests after coding
Not full design up front
Not end-to-end testing
TDD is not “write tests after coding,” and it’s not a big-upfront design ceremony. It complements, rather than replaces, higher-level tests like integration or E2E.

## Slide 7  [images: 2]
Advanced Unit Testing: TDD & Mocking
Benefits of TDD (When It Shines)
Emergent design & better cohesion
Fewer regressions, safer refactors
Self-documenting examples/specs
Slide images (read these for content): img/week03/slide07-1.png, img/week03/slide07-2.png

## Slide 8
Advanced Unit Testing: TDD & Mocking
Benefits of TDD (When It Shines)
Emergent design & better cohesion
Fewer regressions, safer refactors
Self-documenting examples/specs
TDD tends to produce cohesive, decoupled code and fewer regressions. It also leaves behind living examples that document expected behavior.

## Slide 9
Advanced Unit Testing: TDD & Mocking
Limits & Pitfalls of TDD
Over-specifying internals (brittle tests)
Slow cycles with large units
Mocking everything → fragile tests
“Test theater” (coverage without value)
Over-specifying internals or mocking everything can make tests brittle. TDD can slow you down if your units are too large or entangled with I/O.

## Slide 10
Advanced Unit Testing: TDD & Mocking
Designing for Testability
Dependency Inversion, interfaces/abstractions
Small, pure functions where possible
Clear seams for substituting dependencies
Avoid global state & static singletons
Favor dependency inversion, pure functions, and clear seams to swap implementations. Avoid global state and static singletons that hide dependencies.

## Slide 11
Advanced Unit Testing: TDD & Mocking
Test Doubles: The Family
Dummy: passed but never used
Stub: returns canned values
Fake: lightweight working impl (e.g., in-mem DB)
Spy: records interactions
Mock: verifies behavior/interaction
Test doubles simulate collaborators at different fidelity levels: dummies, stubs, fakes, spies, and mocks. Choose the lightest double that proves the behavior you care about.

## Slide 12
Advanced Unit Testing: TDD & Mocking
When to Mock vs. When Not To
Mock external/difficult deps (I/O, time, HTTP)
Don’t mock your own data models/algorithms
Prefer fakes to keep tests realistic & fast
Mock external or hard-to-control dependencies like time, network, and file systems. Prefer fakes over mocks when you can keep tests realistic and less brittle.

## Slide 13
Advanced Unit Testing: TDD & Mocking
Mocking Framework Patterns
Arrange expectations (given/when)
Verify calls (times, arguments)
Argument matchers & stubbing exceptions
Resetting/teardown to avoid leakage
Set up expectations (given/when), stub returns and errors, and verify interactions and call counts. Always reset or isolate state between tests to prevent leakage.

## Slide 14
Advanced Unit Testing: TDD & Mocking
Example Test Structure (AAA)
Arrange: inputs, doubles, system under test
Act: invoke one behavior
Assert: outcome or interaction
One assertion concept per behavior
Arrange inputs and doubles, Act by invoking exactly one behavior, then Assert on the outcome or interaction. Aim for one clear reason to fail per test.

## Slide 15
Advanced Unit Testing: TDD & Mocking
Parameterized & Edge-Case Testing
Cover multiple cases with data sets
Boundary values & equivalence classes
Property-based tests for invariants (where useful)
Parameterized tests cover multiple inputs concisely; focus on boundaries and equivalence classes. Property-based tests can reveal invariants and hidden edge cases.

## Slide 16  [images: 1]
Advanced Unit Testing: TDD & Mocking
Flaky Tests: Causes & Fixes
Time, randomness, concurrency, networking
Control time & randomness (seeds/clocks)
Isolate and fake external systems
Stabilize setup/teardown
Flakiness often comes from time, randomness, concurrency, or real networks. Control clocks and RNGs, isolate external systems, and stabilize setup/teardown.

## Slide 17
Advanced Unit Testing: TDD & Mocking
Measuring Quality (Beyond Coverage)
Statement/branch/condition coverage (useful, not a goal)
Mutation testing to catch weak assertions
Test review: readability, intent, maintenance cost
Coverage is a helpful indicator but not a goal; weak assertions can still yield high coverage. Mutation testing and code reviews assess test strength and clarity.

## Slide 18
Advanced Unit Testing: TDD & Mocking
Test Smells & Anti-Patterns
Over-mocking, brittle verifications
Testing private internals
Copy-pasted fixtures, giant setups
Slow “unit” tests touching real I/O
Over-mocking and verifying implementation details create fragile tests. Huge fixtures, copy-paste setup, and “unit” tests that hit real I/O slow feedback and mask issues.

## Slide 19
Advanced Unit Testing: TDD & Mocking
Practical Tips & Conventions
One behavior per test; clear names
Given/When/Then naming or Should_DoX_When_Y
Fast local runs (<1s per test suite segment)
Keep test code quality high
Name tests by behavior (Given/When/Then or Should_DoX_When_Y). Keep suites fast, readable, and maintain test code quality on par with production code.

## Slide 20
Automated Testing & CI/CD Pipeline
Why Automate?
Catch issues early (shift-left)
Consistency across environments
Faster feedback for developers
Automation catches defects early (“shift left”) and ensures consistent results across machines. Faster feedback loops raise developer productivity and release confidence.

## Slide 21  [images: 1]
Automated Testing & CI/CD Pipeline
Testing Pyramid Refresher
Many unit tests → fewer service/integration → few end-to-end
Keep unit tests fast and cheap
Use integration/E2E for cross-service confidence
Rely on many fast unit tests, fewer integration/service tests, and a small number of E2E tests. This shape keeps feedback quick and costs manageable.

## Slide 22
Automated Testing & CI/CD Pipeline
Pipeline Anatomy (High Level)
Trigger (push/PR/schedule)
Build → Test → Analyze → Package → Deploy
Feedback (status checks, artifacts, notifications)
A pipeline usually triggers on pushes/PRs, then builds, tests, analyzes, packages, and deploys. Status checks and artifacts provide immediate, actionable feedback.

## Slide 23
Automated Testing & CI/CD Pipeline
Typical CI Stages
Checkout, dependency restore/cache
Linting & static analysis (style, SAST)
Unit tests (parallel/matrix)
Integration tests with services (DB, API)
Artifact build & publish (packages, images)
CI stages include checkout, dependency caching, linting/static analysis, unit and integration tests, and artifact publishing. Parallel jobs and matrices speed feedback.

## Slide 24
Automated Testing & CI/CD Pipeline
Typical CD Stages
Promote build to staging
Smoke tests & health checks
Manual/auto approvals & gates
Deploy to production (blue/green, canary, rolling)
Post-deploy verification & rollback strategy
CD promotes a tested artifact to staging, runs smoke checks, and gates promotion to production. It includes automated or manual approvals, verification, and rollback plans.

## Slide 25
Automated Testing & CI/CD Pipeline
Branching & Triggers
Trunk-based vs. GitFlow (trade-offs)
PR checks as quality gates
Tag/release triggers for versioned artifacts
Feature flags for safer releases
Trunk-based development enables rapid integration; GitFlow offers stricter release control. Use PR checks as quality gates and tags/releases to version artifacts.

## Slide 26
Automated Testing & CI/CD Pipeline
Infrastructure for CI
Runners/agents (hosted vs. self-hosted)
Build matrices (OS/SDK versions)
Caching (deps, Docker layers) for speed
Secrets management (never hard-code)
Over-specifying internals or mocking everything can make tests brittle. TDD can slow you down if your units are too large or entangled with I/O.

## Slide 27
Automated Testing & CI/CD Pipeline
Quality Gates & Policy
Minimum coverage & mutation thresholds
Lint/format must pass
Security checks: SAST, dependency scanning (SBOM)
License compliance & artifact signing
Favor dependency inversion, pure functions, and clear seams to swap implementations. Avoid global state and static singletons that hide dependencies.

## Slide 28
Automated Testing & CI/CD Pipeline
Artifacts & Reproducibility
Versioned artifacts (SemVer)
Package registries & container registries
Immutable builds; provenance (SLSA basics)
Create immutable, versioned artifacts (e.g., SemVer) and publish to registries. Track provenance and signatures to increase supply-chain trust.

## Slide 29
Automated Testing & CI/CD Pipeline
Test Types in CI
Fast unit tests on every push
Contract/integration tests on PRs or nightly
E2E/UI tests on staging or nightly
Performance & load tests on schedule or pre-release
Run fast unit tests on every push and deeper integration/contract tests on PRs or nightly. E2E and performance tests are typically staged or scheduled to balance speed and depth.

## Slide 30
Automated Testing & CI/CD Pipeline
Observability in Pipelines
Logs, metrics, traces for builds/tests
Flaky test tracking & quarantine lists
Trend charts (build time, pass rate)
Collect logs, metrics, and traces for builds and tests to spot trends. Track flaky tests, build times, and pass rates to prioritize improvements.

## Slide 31
Automated Testing & CI/CD Pipeline
Deployment Strategies
Blue/green: instant switch, easy rollback
Canary: gradual rollout, metrics-driven
Rolling: batch updates with health checks
Feature flags: decouple deploy from release
Blue/green enables instant switch and easy rollback; canary rolls out gradually based on metrics. Rolling updates change instances in batches, while feature flags decouple deploy from release.

## Slide 32
Automated Testing & CI/CD Pipeline
Securing the Pipeline
Least-privilege tokens & short-lived creds
Protected branches/tags
Review & sign pipelines and artifacts
Secrets scanning in repo & images
Use least-privilege tokens, protected branches, and short-lived credentials. Scan repos and images for secrets and vulnerabilities, and sign artifacts.

## Slide 33
Automated Testing & CI/CD Pipeline
Common CI/CD Pitfalls
Slow pipelines (no caching/parallelism)
Flaky tests blocking merges
“Everything E2E” bottlenecks
Drift between dev/staging/prod
Slow, monolithic pipelines and lack of caching frustrate teams. Flaky tests and over-reliance on E2E create bottlenecks and merge delays.

## Slide 34
Automated Testing & CI/CD Pipeline
Example Workflow (Conceptual)
On pull request: lint → unit tests → SAST → build → integration tests → publish preview
On main: build → unit+integration → package → push image → deploy to staging → smoke → gate → prod

## Slide 35
Automated Testing & CI/CD Pipeline
Tooling Landscape (Pick What Fits)
CI: GitHub Actions, GitLab CI, Jenkins, Azure DevOps, CircleCI
Test: xUnit/NUnit/JUnit/pytest; mocking libs (Moq/Mockito)
Coverage: Coverlet/JaCoCo/pytest-cov
Security: CodeQL/Dependabot/Trivy
Popular CI tools include GitHub Actions, GitLab CI, Jenkins, and Azure DevOps. Pair them with your language’s test/mocking and coverage tools, plus security scanners.

## Slide 36
Automated Testing & CI/CD Pipeline
Best Practices for Teams
Keep pipelines under ~10 min for PRs
Fail fast; clear messages; actionable logs
Make tests deterministic; seed randomness
Document pipeline in repo (README + YAML)
Target ~10-minute PR pipelines with clear, fail-fast errors. Seed randomness, document your YAML, and keep tests deterministic for reliable results.
