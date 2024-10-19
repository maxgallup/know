# Software Correctness
The following is an enumeration of several methods in which one can assert correctness properties of software.

## Writing Documentation
The first step in removing bugs is documenting the code itself. Using tools like `rustdoc` will run code that is part of the documentation as test. Handy for testing the public API.

## Unit & Integration Testing
Traditional testing places lots of the work and pressure on the programmer themselves to make sure they cover all test cases. For test driven development, this is very useful and should generally always be used a starting point to ensure basic working functionality. Using native tooling such as `cargo test` allows for easy integration with existing code. Creating unit tests helps with checking basic correctness at a function-level granularity. Then, integration tests can be used once modules are combined together and tested in conjunction. Typically, integration tests target the API surface. Test coverage can be used as a metric to see how much of the code was tested (`cargo-llvm-cov`). These are the *bare* minimum.

## Mutation Testing
Given an existing test suite, the mutation of the source code should prevent the tests from passing. If the tests continue to pass despite the source code being mutated, there are either not enough tests, they are incorrect or there is a bug. Tools for this include `cargo mutants` and `mutagen`.

## Fuzz Testing
Fuzzing stress tests the program crafting many randomly generated inputs. Typically, fuzzers are setup such that they track which parts of the program they have reached, and can then try to favor inputs that get reach new code. Coverage is a commonly used metric to navigate the fuzzer, however this is a field under active research. If this technique can be easily adapted by frameworks like `cargo-fuzz` and `libAfl` it can be an incredibly effective method of discovering less obvious bugs.

## Property Testing
Property testing generates random inputs based on predefined properties or constraints. It is up to the tester to implement the properties and constraints correctly. Property testing is probabilistic and doesn't test the entire input space. It applies shrinking on the input which involves searching the input space of combinations for a smallest possible example of a failing test case. Commonly used frameworks for protesting are `proptest` and `quickcheck`.

## Model Checking
*todo*

## Deductive Verification
*todo*
