# week08

## Slide 1
CEN315
Introduction to Test Engineering
Mastering Performance and Reliability in Test Engineering
Week 8

## Slide 2
Reading:
https://microsoft.github.io/code-with-engineering-playbook/automated-testing/performance-testing/
https://microsoft.github.io/code-with-engineering-playbook/automated-testing/performance-testing/iterative-perf-test-template/
https://microsoft.github.io/code-with-engineering-playbook/automated-testing/performance-testing/load-testing/

## Slide 3
The Dual Mandate of Modern Engineering
Modern systems must deliver on two critical fronts:
Performance Excellence: Fast, responsive, and efficient under load
- Meeting immediate user and operational demands
- Focus on behavior now
Reliability Assurance: Operation without failure over entire lifecycle
- Enduring the stresses of time and use
- Focus on endurance over time

## Slide 4
Pillar I: Performance: The Science of System Behavior
Performance Testing evaluates how a system performs in terms of:
- Responsiveness
- Stability
- Resource usage under workload
Key Questions:
• How fast does the system respond?
• How many concurrent users can it handle?
• What is the breaking point under peak load?
• How does it recover from failure?

## Slide 5
A Taxonomy of Performance Tests
Load Testing: Simulates expected user load
Stress Testing: Pushes system beyond normal capacity
Endurance (Soak) Testing: Sustained load for extended period
Spike Testing: Sudden dramatic increases in load
Volume Testing: Large amounts of data
Scalability Testing: Ability to scale up or out

## Slide 6
The Language of Performance
Response Time: Time between request and response
- Measured in Avg, Peak, Percentiles (95th, 99th)
Throughput: Transactions per unit time (TPS/RPS)
Resource Utilization: CPU, Memory, Disk I/O
- CPU target: <80%
Error Rate: Percentage of failed requests
- Target: <1% for production

## Slide 7
Pillar II: Reliability – The Science of Endurance
Reliability: Probability that a system performs its required function
under stated conditions for a specified period
Reliability Function: R(t) = P(T > t)
- Probability of survival beyond time t
Unreliability: F(t) = 1 − R(t)
- Probability of failure by time t
Failure Rate: λ(t) = f(t) / R(t)
- Instantaneous rate of failure at time t

## Slide 8  [images: 1]
(no text)
Slide images (read these for content): img/week08/slide08-1.png

## Slide 9
The Bathtub Curve
Phase 1 - Infant Mortality (Decreasing Failure Rate):
- Cause: Manufacturing defects, design flaws
- Early failures are weeded out
Phase 2 - Useful Life (Constant Failure Rate):
- Cause: Random external events
- Modeled by Exponential distribution
Phase 3 - Wear-Out (Increasing Failure Rate):
- Cause: Age-related deterioration
- Components fail due to age

## Slide 10  [images: 1]
(no text)
Slide images (read these for content): img/week08/slide10-1.png

## Slide 11
Modeling Failure Distributions
Exponential Distribution:
- Models Useful Life phase (constant failure rate)
- Memoryless property
Weibull Distribution:
- The 'Swiss Army Knife' of reliability
- Shape parameter β determines phase:
β < 1: Infant Mortality
β = 1: Useful Life
β > 1: Wear-Out
Normal Distribution: Models wear-out failures

## Slide 12  [images: 1]
(no text)
Slide images (read these for content): img/week08/slide12-1.png

## Slide 13
Key Reliability Metrics
MTTF (Mean Time To Failure):
- Expected time until first failure
- For non-repairable systems
MTBF (Mean Time Between Failures):
- Average time between consecutive failures
- For repairable systems
- MTBF = MTTF + MTTR
Availability: A = MTBF / (MTBF + MTTR)
- 99.9% = 'Three Nines' = 8.76 hours downtime/year
- 99.999% = 'Five Nines' = 5.26 minutes downtime/year

## Slide 14  [images: 1]
(no text)
Slide images (read these for content): img/week08/slide14-1.png

## Slide 15
Architecting for Endurance
Series Systems ('The Weakest Link'):
- System fails if any single component fails
- R_system = R1 × R2 × R3
- Always less reliable than least reliable component
Parallel Systems ('Strength in Numbers'):
- System functions if at least one component functions
- R_system = 1 − (1 − R)^n
- Always more reliable than single component
- Provides redundancy

## Slide 16  [images: 1]
(no text)
Slide images (read these for content): img/week08/slide16-1.png

## Slide 17  [images: 1]
(no text)
Slide images (read these for content): img/week08/slide17-1.png

## Slide 18  [images: 1]
(no text)
Slide images (read these for content): img/week08/slide18-1.png

## Slide 19  [images: 1]
(no text)
Slide images (read these for content): img/week08/slide19-1.png

## Slide 20  [images: 1]
(no text)
Slide images (read these for content): img/week08/slide20-1.png

## Slide 21  [images: 1]
(no text)
Slide images (read these for content): img/week08/slide21-1.png
