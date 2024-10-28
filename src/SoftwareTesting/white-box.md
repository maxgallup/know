# White-Box Testing

Performing tests on software with the source code available. Generally, one should follow the following methodology:

1. Make a prioritized list of your "nightmares".
2. Which bugs can lead to the nightmares?
3. Apply testing techniques that are best suited for detecting these bugs.
4. Gather enough evidence to that there the likelihood of a nightmare scenario is negligible, at which point stop testing.

Static Analysis is one of the most powerful tools, leveraging compilers and linting is a must.

### Control-Flow Testing

Testing coverage is a measure of completeness of the set of test cases and shows how much code has been exercised during testing.

* **Level 1 Statement Coverage** - Weakest criteria, ensures that every statement in code has been executed at least once.

* **Level 2 Decision Coverage** - Ensures that the decision of all branches has been taken at least once. Includes statement coverage.

* **Level 3 Condition Coverage** - Ensures that every "simple" condition has been evaluated with both true and false. This doesn't mean that all "composite" conditions have been extensively evaluated.

* **Level 4 Decision/Condition Coverage** - All conditions and decisions is evaluated with both values. In this case decisions can be the composition of multiple conditions.

* **Level 5 Multiple Condition Coverage** - Requires that all combinations of "simple" conditions are covered.

* **Level 6 Modified Condition/Decision Coverage** - Requires that all decisions have been covered, that all simple conditions have been evaluated with both true and false, and that each simple condition within all compound conditions has been shown to independently effect outcome of the compound condition.

* **Level 7 Full Path Coverage** - Fully exhaustive white box testing, but tends to be infeasible.


### Data-Flow Testing

The aim is to trim the set of test cases that we are interested in. Increases the chance of spending more time looking at paths that include potential software faults.

* All *Def-Use* Paths: test cases must exercise all paths that involve a definition and use of variables of interest.


### Test Adequacy

When has a program been sufficiently tested? A test adequacy criterion such as Mutant Score, reveals how well our test cases are performing.

> **Definition:** 
> A code mutant is a version of the software under test that underwent some form of mutation, for example, arithmetic operators have been replaced.

Mutants can survive if their output is correct for any given test case. Survivors are analyzed to improve test cases. However, some (equivalent) mutants might never be killed. Mutant Score is defined as `#killed_mutants / #total_mutants`.


### Unit Testing
Testing an individual module / component of a system. In practice, this is testing of a single method or class. [(wiki)](https://en.wikipedia.org/wiki/Unit_testing)

### Integration Testing
Testing the multiple parts of the system as a group. Typically it follows after modules have been unit tested. [(wiki)](https://en.wikipedia.org/wiki/Integration_testing)

* *big-bang* - modules are coupled together to form a complete system that is tested
* *top-down* - start with highest level module and then test step by step down incrementally
* *bottom-up* - start with the lowest level module, test your way up by integrating


