# CPU

* Memory speed did not follow the perforamnce increase seen by CPUs
* To account for Memory slowdown Caches play huge role in keeping performance high
* "fast-path" optimization
* caches shared accross programs, just like memory
* great for performance, bad for security
    * cache timing side-channel attacks

### (dated) compute side-channels
* When there is a difference in the amount of compute based on an information secret, trivial timing side channel
* Mitigation, have functions be computed in constant time

#### RELOAD Attack
* different constant time functions are loaded into cache which let the attacker probe for which function of shared library is loaded 

## Cache Size
* L1 and L2 are CPU local, L3 is shared by all cores
* L1 < L2 < L3
* Intel Comet Lake:
    * L1 (32KB)
    * L2 (256KB)
    * L3 (20 MB)
* Cache line: 64 bytes

* Inclusive Caches
    * A line in level X is also in X + 1
    * Easier coherence, e.g. L3 miss
    * Data duplication in hierarchy
* Exclusive Caches
    * A line in level X cannot be in X +/- k
    * opposite tradeoff
* Non-inclusive/exclusive caches (no guarantees)
    * simple design 

* L3 inclusivity:
    * ARM (usually non-inclusive)
    * AMD (depends)
    * Intel (usually inclusive)
        * servers going non-inclusive

## Cache addressing
* Caches are divide into sets, each address can go to its own set
* 20MB L3 on recent INtels has 20480 sets
* Each set has (20MB / 64) / 20480 = 16 lines
    * 16-way set-associative cache



## Replacement Policy
* Generally use LRU derivatives (secret)
* [uops](uops.info)

## Indexing and tagging
* Indexing - policy for how to select a cache set by index
* Tagging - policy for how to select cache line physically tagget line (unique id)
* most implementation are physically tagged
* Virtually tagged schemes have problems - incoherence, ambiuity and need cache flushing
    * N V address -> 1 P address
    * 1 V address -> N P addresses
    * when V addresses change, expensive

### L1 Addressing
* Virtual Indexing Physical tagging - bits 6 - 11 decide the set (within page)
* 64 sets (8 ways)
* L1 set indexing can be done in parallel amortize latency by tag lookup to increase performance

### L2 Addressing
* Physical Indexing Physical Tagging - bits 6 - 15
* can only be accessed after translation

### L2 Addressing
* *Sliced* Physical Indexing Physical Tagging - bits 6 - 16
* 2048 sets / core
* can only be accessed after translation

### L3 Slicing
* For many physical address accesses, we can 

## Cache Attacks
* PROBLEM: conditional execution that is secret dependent
* Microarchitectural attacks: timing attacks on data cache lines
### Terminology
* `Constant time` terminology of the past (no longer worth talkting about)
    * today it includes constant microarchitectural state 
* `Side Channel Resistant` - Which side channels?

### Flush and Reload
* attacker probes for shared code with the victim (i.e. shared crypto libr)
* runs long lived loop where address of interest is flushed and then probed through reloading

### Meltdown
* secret dependent accesses

### Meltdown Tips
* index by PAGE_SIZE to prevent prefetcher optimization
* prevent further prefetcher optimizations by doing random walk



# Transient Execution
* Microarchitecture implements the ASI
* Contract between software and hardware
* Scalar CPU Example
    * single cycle (fetch, decode, execute, commit)
    * in-order
    * simple, slow, expensive
* Pipelined CPU Example
    * Multicycle
    * modern CPUs have deep pipelines 20+
    * huge performance improvements
    * Exceptions:
        * pipeline must be cleared
        * transient Execution: instructions that entered the pipeline but haven't committed results
        * All younger instructions must commit their results
        * only generate pipeline clear after valid lectures
### Pipeline Clears:
    * microarchitectural state includes caches for each stage
    * hardware designer decides whether to clear or not

### Pipeline Dependencies:
    * when one instruciton depends on the value being commited by a previous instruction
    * solutions:
        * naively add a pipeline stall
        * forwarding if possible (bypassing), getting data directly
        * branch instruction introduce massive pipeline stalls

### Branch Prediction
* aims to solve branch-pipeline-dependency-problem
* predict the instruction type (non-branch, call, jmp...)
* predict whether or not to take the branch
* predict where the branch points to
* if misprediction: clear pipeline (depsite transiently executing incorrect instructions)

### Multi-cycle pipelines
* some stages take much longer than others
* varies time cycles per stage

### Out of Order Execution
* Reorded buffer is a stage that reorders instructions 
* Out of order dispatch stage schedules instructions
    * maximizes use of resources for instructions in the pipeline
    * ensures dependencies are met

# Transient Execution Attacks
* Meltdown
* Spectre V1
    * mistrain branch predictor to get speculative execution
    * spectre disclosure gadget
    * Mitigations:
        * insert `lfence` to stop speculation (static analysis, but runtime costs)
        * masking the index (not always feasible)
        * process isolation
        * unmap secrets ASI (address space isolation)
        * hamper covert channel (disable high precision timers)
* Spectre V2 (branch target injection)
    * mistrain to jump to the wrong branch
    * mitigation:
        * turn all branches into returns to safe code
        * ibrs - kernel does not use user inserted branches
* Retbleed
    * Return Stack Buffer underfills and uses vulnreable BTB



* New attack surface with transient execution attacks

### TEA Context
* many attacks from 2018
* confusing terminology
* e2e attack vs attack vectors

### TEA Anatomy
1. Attacker sets up at architectural level
2. trigger instruction -> TE
3. Attacker does analysis

### Threat Models
* Intra domain (spectre - Javascript escapes browser sandbox)
* Domain bypass (meltdown - user vs kernel)
* Cross domain (spectre - user vs kernel) victim executes transiently (typically use gadgets)

### Covert Channels
* Timing
    * data cache
    * instruction cache
    * tlb 
    * branch predictor state
    * port contention
* Power
* Transactional memory state

### Mitigating TEAs
* Silicon - doesn't address existing hardware
* Microcode - (limited changes only)
* Software - "spot" mitigations, messy, crosses abstraction bounds
* so far, all mitigations worsen performance

# Spectre V1
* mistrains branch predictor
* whether or not the branch will be **taken**

# Spectre V2 - Branch target injection
* exploits where the branch points to
* indirect branch prediction
* Branch Target Buffer (BTB) - indexed by type
* BTB is not very large so aliasing of kernel / user addresses is possible
* Mitigations
    * partially flush BTB (too slow)
    * retpoline: compiler turns all indirect jmps/call into returns which are mispredicted to safe code
        * Retbleed: retpoline uses Return Stack Buffer, which uses BTB when it is full
    * IBRS: indirect branch restricted speculation (kernel does not use user-inserted BTB entries)
        * however, VUSec bypassed eIBRS since use is incontrol of Branch history buffer which can randomize where PC gets inserted, with luck it can still be exploited
* Phantom Attack: misprediction on type - jump away from xor, but transient windows are very short, but some may be long enough for exploitation
* Inception: use phantom to mistrain branches such that upon return, jump to spectre gadgets


# Advanced Cache Attacks
* platforms like JS or ARM, don't always have access to:
    * clflush
    * shared memory
    * precise timing

### Eviction Sets
* given a target cache set in L1-3 a set of memory addresses that if accessed will evict any other entry in the set.
* L1 - need 8 pages of contig memory to create eviction set
* L2 - need 64 pages contig mem
    * user space programs can check pagemap, brute force allocations until 64 pages contiguous
    * use huge pages
    * or use a timing side channel attack to color memory. cache misses will result in detecting pages with the same color
    * Algorithm:
        * Allocate a large pool of pages
        * pick a page P from the pool
        * check that accessing the first cache line of all other pages evicts the first cache line of P (already found eviction set, but too large)
        * pick a page Q from the pool and remove it, see if the new pool still evicts P. If so, pool is now smaller
        * keep removing until pool has exactly 4 members (this is an eviction set E for P)
        * try this again with a page that E does not evict it to find another eviction set
* L3 - same strategy as used in L2 will work

#### Prime + Probe
* threat model: attacker does not control the victim, victim and attack do not share code or data
* common for attacks from JS and across VMs
* assume inclusive Last level cache (LLC) for cross-core attacks (for non LLC more advanced eviction set building strategies)
1. bring eviction set into L3 (PRIME)
2. victim makes sensitive access
3. Attacker probes, and sees access to one of the sets in eviction set was slow and knows the victim accessed a 1 bit in the secret.
4. Attacker walks eviction set repeatedly to see what was accessed by victim
* Leaks fingerprint of victim

#### Evict + Reload
* Threat Model: attack controls victim's execution and victim and attacker do not share code or data
* less noisy than prime+reload when we can control the victim
* assume inclusive LLC
1. Evict - same as Prime but only for a single target cache set
2. Attacker times victim's access to secret and can infer whether secret was in cache or not
* can be used to break windows KASLR or ASLR from javascript
* target page tables and MMU
* VU AnC attack
* might need to use TLB Evictions

### More exotic cache attcks
* Can't time? - Prime + abort exploits tsx
    * uses intel tsx codes as a side channel
* Don't want to cause victim cache misses?
    * reload+ refresh (exploits cache replacement)
    * refresh: force target cache line to be LRU in set

# Questions
* leaking website information the only thing prime+probe can leak?


