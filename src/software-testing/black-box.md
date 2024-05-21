# Black Box Testing

Testing when the source code is not available.


# Techniques

### BVA - Boundary Value Analysis
For mechanisms that have input ranges, apply test cases that position themselves at the boundaries of those ranges. For each of the following test just above and just below:
* min
* nominal
* max

### EP - Equivalence Partitioning
If the program creates classes from the input, make sure all classes are represented. Can be done by finding representative values in the input domain or the output domain. If there are multiple input variables there are the following:
* Unidimensional partition - only focus on one variable at a time and ignore the others.
* Multidimensional partition - test all variables in all possible combinations

### MBT - Model Based Testing
A model is made from requirements and generates test cases. Use different notations such as pre/post conditions.
* Input domain models: Combinatorial Design
    * assist the design of the test cases and offer a significant reduction in the number of test cases
* Input domain models: Syntax Testing
    * used to verify that a module that accepts input from another module does not fail when presented ill-formed input
    * The syntax is the model of the input, Inputs are specified in SRS using a grammar or a context-free language
    * used to test compilers!

* Behavior Models:
    * Test the use cases, capture system's functional requirements from user's perspective
    * Decision Tables - used to concisely and completely show complex rules and their resulting actions: test cases can be 
        * at least one test case for each rule
        * if the rule is a range of values combine DT and BVA
    * Cause-effect graphs / dependency modeling - design test cases for functions that depend on a combination of more input items
    * State Machines - test cases should:
        * visit all states
        * trigger all events at least once
        * exercise all transitions
        * execute all paths at least once
    

