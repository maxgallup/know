# Multiprocessing

### Fork
* creates a new child process by duplicating calling process
* built on top of clone() syscall

* Copy most information, allocate and init new kernel stack and some others like:
    * copy_files
    * copy_fs
    * copy_sighand
    * copy_signal
    * copy_mm - dup_mm and dup_mmap, which will copy vma information and page tables (requires fixing)
        * for pages that are R/W, kernel implements Copy on Write (COW) which sets one read-only page frame for both processes and on every page write, the PF handler copies the new page

### Exec
* executes the program pointed by a filename
* implementation:
    * input and permission
    * load binary headers in memory
    * find bin format - *there are other formats that linux supports other than ELF...*
    * flush old resources
* Load binary
* Page tables initially empty

#### Copy On Write Applications
* file pages
    * deduplicate binary pages for unrelated processes
    * many pages (text) pages are never written to COWed
* anon forked pages
    * deduplicate pages within process hierarchy
    * many (fork+exec) never COWed
    * typically fork + exec are called right after, with COW fork doesn't duplicate all page frames in address space which would be wasted on exec call
* anon zero pages
    * deduplicates zero pages for unrelated processes
    * at first read PF, map single read-only (global) zero page
    * COW at first write PF
        * if processes read anon pages only, this is a win
        * if processes write, this is a loss (2 page faults instead of one)


## Scheduling
* simple version: preemptive round robin schedule with no priorities, simply schedule all available processes and use a queue (FIFO)

### Time Management
* Clock circuits:
    * expose counters incremented at given frequency
    * can be used for precise time measurements
* Timer circuits:
    * issue periodic interrupts at given frequency
    * can be used for scheduling
* RTC - real time clock
    * second granularity, but battery powered

#### Clock event devices
* programmed to issue interrupts at CONFIG_HZ frequency, timer interrupts aka. ticks
* Both user and kernel preemption are possible
* choosing frequency is a balance between smooth operation for user and too much overhead for each interrupt
* interrupts are useful to interrupt software, and they "preempt software"
    * from the kernel's perspective you want to preempt the user
    * can also preempt kernel - preemptive kernel

#### At each tick:
``` c
jiffies_64++; // update ticks since startup
update_wall_time(); // update current date/time
update_process_times(); // accounting
profile_tick(); 

while (time_after_eq(jiffies, base->clk))
    expire_times(base, ... ) // expired timers

schedule(); // invoke the scheduler
```

# Scheduling:
* State: associated to a given task `RUNNING, RUNNABLE, SLEEPING`
* Quantum / time slice
    * max number of jiffies a task can run on a CPU
    * initialized with a task-specific formula
    * Decremented at every tick, task is done at 0
    * sufficient to ensure fairness for CPU-intensive tasks
    * *fairness* - each process gets the same CPU time (not the case for I/O intensive tasks)
* Priority
    * initialized with static (predetermined) priority
    * possibly adjusted periodically (based on behavior of task)
* Scheduling policy
    * NORMAL, BATCH, IDLE -> completely fair scheduler


### Tickless Kernel
* ticked kernel has issue of balance between (+responsive, -overhead) finding a sweet spot is hard
* tickless design uses a sw timer for the "end of quantum event"
* reprogram hardware at every tick to tick next when the next timer expires (non-constant duration between ticks)
* NO_HZ_IDLE tickless when idle
* FULL go tickless when 1 task is running

### Linux O(1) Scheduler
* preemptive (will preempt user execution) round-robin (queues) priority scheduler
* Maintains N run queues (1 per priority level)
    * find highest priority queue with runnable task
    * find the task on that queue and deq it
    * calc its time slice based  on prio. and `run`
    * when its time is up, enqueue it and repeat
* improving fairness
    * priorities are adjusted based on sleep time
    * I/O bound processes tend to have higher priority, since the will give up CPU for I/O and thus get less actual CPU time, typically they are user-facing
* Why O(1) - bc all operations are constant time, no loop across tasks, scales well
    * finds first bit set in bit map

### Linux CFS Schedule
* O(1) used hard-to-maintain hacks for fairness - code got unmaintainable, too hacky
* CFS: Tasks get a "completely fair" CPU share
    * record how much CPU time each task has been given
    * schedule task with biggest delta to tot_
    * virtual runtime to deal with priorities
    * increase virtual runtime faster for lower-priority tasks
* no heuristics to distinguish tasks
* no run queues, uses red-black tree


# Inter Process Communication (IPC)
* System V vs POSIX differences
    * System V original UNIX implementation +compatibility
    * POSIX was standardized later +user-friendly +features

### Shared Memory (SysV)
* irrelevant which processes are using shared memory, don't have to be part of same process hierarchy
* all processes should share them same page frames
* int shmget(key, size, shmflag)
* attach / detach segment shmid

### Message Queues (SysV)
* Wants to reliably send message to another process
* Sending task will copy message to message queue's memory area
* Receiving task will copy message from queue into its own memory area
* all are done through blocking system calls
* queue is size limited by construction, so send/recv calls will block
* properties: not stream oriented, supports random queue access, bidirectional, always named

### POSIX IPC: difference
* uses names not keys
* uses reference counting easier to deallocate
* provides thread safety
* shared memory is file oriented


# tmpfs

 
# Questions
* What routines should preempt the kernel?
* In what cases does a "preemptive" kernel make sense?
* What about "real-time" kernels?


