# System Calls
Interrupts raised by software, a demand by a process requesting the kernel to do something.
Originally, it was just `int 0x80`, nowadays there are more optimized `syscall` instructions. User and Kernel code abide by calling convention to put the syscall number into %rax, and arguments are specified into specific registers (`rdi, %rsi, %rdx, %r10, %r8, %r9`). Kernel places return value into `%rax`.

### Performance of Syscalls
* IDT entry cached in CPU register to avoid cache misses.

# Questions
Why exactly is there a pipeline performance issue?
