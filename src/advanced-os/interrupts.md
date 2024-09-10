# Interrupts
An event that interrupts the execution flow of the kernel. It gets handled by the kernel before the program execution can continue. From the perspective of the CPU they can either be *external* - (key presses, network packets) or *internal* - (divide by zero, page fault).

### Terminology (Intel based)
* Interrupt (something needs handling)
    * External:
        * Hardware generated, a device triggers the interrupt through a pin on the CPU, masking allows to postpone consecutive interrupts (only kernel can set masks)
    * Internal - Software generated, software needs something form kernel - opening a file, allocating memory, any system call (`int n` defines the type of interrupt where n is 1 byte)
* Exception (something went wrong)
    * Fault - error condition (/0, page fault...) instruction can be retried
    * Trap - Typically for debugging (breakpoint, overflow) program can resume
    * Abort - serious error condition that is unrecoverable, process cannot continue (double fault or unrecoverable hardware error)
* Interrupt handling systems handles exceptions as well

* Asynchronous vs Synchronous interrupts
    * most software interrupts are synchronous - kernel can handle specific to the instruction
    * most hardware interrupts are asynchronous - can come at any time, masking must be done

### Privilege
* Interrupt handlers run at high privilege level, but are handled in ring 0

### Interrupt Procedure
1. CPU elevates privilege level and switches to kernel stack (unless already in kernel)
1. User context is saved so that program can resume again
1. The interrupt's service routine is called
1. CPU restores some of the user context and drops the privilege level

### IDT Interrupt Descriptor Table
* Max 256 entries
* first 32 entries reserved exceptions
* 16 external hardware interrupts can be remapped using APIC unit
* IDTR (R for register) contains IDT Base Address + IDT Limit
* Interrupt vector identifies type of interrupt
* look up interrupt gate in IDT using vector
* Jump to interrupt handler and ring 0
* Mask further instr
* Switch stack
* Store calling context


### Trap vs Interrupt
* Interrupt will mask further interrupts
* Trap (exception) will not mask

### Restoring the Kernel stack
* TSS Task State Segment
* TR Task Register
* TSS contains stack pointers for each ring

### Returning
* special `iret` returns all the state for the user process and makes sure the CS is set back to the right privilege

### Livelocks
* Too many interrupts will cause the CPU to deal with nothing else.
* should try do as little in the handling routine as possible
* reduce number of interrupts
* offload to hardware
* switch to polling vs handling
* hardware DMA, forego interrupts






# Questions
* Are software interrupts considered strictly internal interrupts?
* Where in memory is IDT?
* Who sets IDTR?
* Where is interrupt code in memory?
