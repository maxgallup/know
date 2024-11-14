# Basics of Communication Networks

* End-to-end performance measurements
* Business relevance for high performant networks
* Page load times
* Circuit switching - Once a set path is set, all packets of the message are routed through the same path
* Packet switching - packets are sent out over different paths, received and correctly ordered at dest
* Statistical Time Division Multiplexing - "best-effort" approach
* Application view - point to point communicaiton
* Bandwidth - theoretical maximum data transmission rate
* Throughput - bandwidth achieved in practice
* latency - signal propogation delay + queueing
* transmission time - msg size / bandwidth
* Payload Sizes:
    * Large payloads - bandwidth bound (elephants)
    * Small payloads - delay bound (mice)
* Bandwidth Delay Product - product of data link's capacity (bits/second) * RTT
* Maximum throughput of a TCP connection - max window size / RTT
* Optimizing bandwidth
    * data compression
    * send less data
    * caching
* Last Mile latency
* Human Perception of delay - E model standardized Mean opinion scores
* latency is issue for websites


* Probability Distribution
    * Continuous random variables
    * Discrete random vriables
* Uniform Distribution
* Exponential Distribution
    * Probability Density Function (PDF)
    * Cumulative Density Function
* Poisson Distribution
* Poission Process
    * Superposition propoerty (additive)
    * thinning-out propoerty (removal)
* Equilibrium distributions
* Planning Problem
* continuous time markov chain
* Erlang B model




### Exponential Distribution
* Probablility Density Function (PDF)
    * provides a complete description of the probability distribution of a continuous random variable
    * used to calculate probabilities of intervals of values
    * area under the curve is 1
* Cumulative Density Function (CDF)
    * gives the probability that a random variables takes a value less than or equal to a given point
* Memoryless property
    * describes situations where time spent waiting for an event does not affect how much longer it will take
    * `P(X > s + t | X > s) = P(X > t)`

### Poisson Distribution
* Assume that events occur independently and the probability that an event occurs in a given length of time does not change.
* There is an expected mean of `lambda` events occuring in a given interval, then the probability of k events in the same interval is:
```
(lambda ^k) e^-lambda / k!
```



<!-- ## Discrete and Continous Probability Distributions



## Exponential Distribution and Memoryless Property
## Poisson Processes, Superposition and Thinning Properties
## Poisson Arrivals See Time Averages (PASTA)
## Poisson distribution and relation
## Markov Chains & Equilibrium Distribution
## Erlang-B Model -->

