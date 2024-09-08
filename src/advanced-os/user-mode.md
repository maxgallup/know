# User Mode
Any OS will make sure that sys resources can be multiplexed by competing applications. Should happen safely and efficiently. CPU provides support for privileged instructions

### Privilege Separation
* x86 has 4 rings of privilege
    * ring 0: runs kernel, most privileges
    * ring 1,2: unused
    * ring 3: user code
* Pointers can be associated either with:
    * Code segments (CS)
    * Data segments (DS) - heap pointer
    * Stack Segment (SS) - Local variable pointer
* CS:0x1000 can be different than DS:0x1000
* However, today all segments point to same memory
* low-order 2 bits of CS register determine current ring
* No instruction sets CS register directly
    * From user -> Kernel
        * interrupt CPU ("int" instruction)
        * CPU switches to interrupt handler in kernel (from interrupt table containing functions)
    * From kernel -> user mode
        * Kernel interrupt handler returns ("iret" instruction)
        * CPU restores user mode state, including CS

#### Global Descriptor Table
* specifies all the segments and different rings
* GDTR register points to the GDT
* DPL Field decides which ring can access memory

# Task struct (linux')
* contains pid, parent_pid, frame of registers and pointer to page_table
* contains a specific state, stack pointer, which cpu, memory management, credentials, open files that process can access

# Security
* Meltdown
    * speculative code reads data into cache
    * KPTI Kernel Page Table Isolation, performance hit
* Foreshadow
    * PTE address bits must also be cleared
* RIDL
    * bypasses the address bits
    * ver instruction flushes address

* Defending Kernel Attacks: prevent kernel vulnerabilities from directing control flow to user land code by enabling SMAP Supervisor Mode Access Protection
* ASLR: user process randomization
    * linux mmap provides 28 buts if entropy



# Questions
* Where is GDT stored and who is responsible for it?
* What is the minimum of kernel code needed to map into a process? interrupt handler and sys calls



