# Multicore

* Dennard's Scaling - `P = NCFV^2 + VL`
* Power decides what you can do in your chip
* Moore's law would lower the size of C, so you could increase the frequency or have more transistors
* Post-Dennard Era (2005-Now)
* Do not increase frequency
* More hardware features - GPU/NIC/FPGA
* Instruction set extensions


### Multicores
* Explicit parallel execution
* Cores share resources:
    * caches
    * memory
    * IO
    * System Interconnect

### Turning on X86 Cores
* one bootstrapping processor
* bios sets it up in a predefined memory region
* used to discover and configure carious hradware components
* locate the right data
* PICs aren't used anymore, (local) APIC replaced
    * localapic is in same memory for each processor since it's local

### Starting APs (Application Processors)
* Send init Inter Processor Interrupt
* send start-up IPI
* manage per-core kernel stack

### End of multicore
* End of multicore scaling also due to a heat problem where switching cores
* solution is to turn of lots of cores 
* specialized cores
* Turn cores on/off cores quickly


### Dealing with Concurrency
* Each core has its own kernel
* data structures need to be shared and in a consistent state
* Solutions:
    * lock the state (performance problems)
        * spinlocks
        * mutexes
        * Read-copy-update (RCU)
            * use replication to make locks scalable
            * contention on a single pointer and if there is write, expensive copy
    * partition the state (underutilization)
    * replicate it (stale state)
* start with locking, if performance becomes unbearable, try a different way

### BKL
* simple and minimally complex
* cons: kernel execution becomes serialized

### Fine-grained locking
* start with BKL and make locks smaller and smaller
* lock only each subsystem
* keep making locks finer and finer such that locks don't take up too much CPU

### Multicore Parallelism
* needs multiple threads of execution
* user-mode applications can spawn threads
    * kernel schedules user-mode threads on top of idle core
* parallelism for kernel tasks
    * post-interrupt work
    * background maintenance
    * filling up per-CPU frame caches
    * writing dirty data to disk
    * RCU garbage collection
* Interrupt handlers do as little as possible *"top half"*
* Deferred handling in interrupt execution context
    * no active process, no sleeping just spinlocks
* Process execution context
    * workqueues / kernel threads
    * active process
    * sleep allowed, mutex possible

### Bottom Halves
* enqueue interrupt handling
* execute before returning to user mode
* only on BH at a time
* inefficient due to lack of parallelism
    * now obsolete
    * replaced by softIRQs and tasklets

### SoftIRQ vs Tasklets - modern approach to Bottom Halves
* SoftIRQs
    * multiple instances of softirq run concurrently
    * very efficient hard to program
    * limited number available (32)
    * High priority work (separated by priority)
    * run concurrently on multiple CPUs
    * Per-CPU bitmask of softirqs needing work
* Tasklets
    * multiple tasklets run concurrently, but just one instance of each
    * less concurrency, easier to program
    * implemented on top of softirqs
    * can dynamically register more
* Linux Workqueues
    * softirqs and tasklets run in interrupt execution context
    * `ps aux | grep kworkers`
* Linux Kernel Threads
    * Unit of parallelism in the kernel
    * use the wait-queue mechanism to get notified of jobs



# Questions
* How do you decide whether to turn a core off?
    * which core? - thermals of neighbors
    * 
* How do you decide whether to turn a core back on?
    * if number of tasks increases / load increases 
* Which multicore performance enhancements interfere?
    * replication of data structures
    * requires a global view and migration

* what can be done when there is heavy contention on a VMA for user allocation
    * partition part of the memory to use core-local data structures for memory allocaitons

* For what kind of systems are these most suitable
    * explicit sharing
    * barrelfish - heterogeneous CPUs

    * Many core, NUMA/non cache coherent

        

