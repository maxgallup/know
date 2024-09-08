# Page Tables
OS provides virtual memory addresses to processes. Page tables store the translation from virtual addresses to physical addresses and OS gets to decide on this mapping. Virtual addresses are the index to a page table entry in the page table where physical addresses of underlying data are stored. A special register `cr3` contains physical pointer to first page table. Each page defines an address space which is useful for separating memory for separate processes.

### Address spaces
* Virtualize physical memory can be reused every time
* Flexible memory management for continuous memory for example
* Provides isolation and separation for separate processes.
    * Shared memory can include same virtual memory for multiple process
    * threads use shared memory
    * 1 process per 1 page table is typical
    * Many processes per 1 page table is shared memory
    * Dynamically linked libraries are loaded into phys mem once

### Linear page table
* Simple and old design
* first 4 bits of Virtual address are index to array of physical offsets
* remaining 12 bits are offset within page
* 1 bit for whether the memory is present or not

### Hierarchical page table
* first 10 bits are index to level 1 page table containing address of 2nd physical page table
* second 10 bits are index to level 2 page table
* remaining 12 bits are offset within page

### Inverted Page tables
* IA64 (itanic)
* using a hash of the virtual memory to store physical address, scales well

### Four-level Page Table
* cr3 contains pointer to PML4 table which is highest level table
* Highest bytes on intel aren't used by default Memory Tagging possible, set by sign extended
* Virtual address contains:
    * First 16 bits are sign extend or MT Tagging
    * First 9 bits: PML4 offset
    * Second 9 bits: Page Directory-Pointer Offset
    * Third 9 bits: Page Directory Offset
    * Fourth 9 bits: Page Table Offset
    * Last 12 bits: Physical Page Offset

## Page Table Entries
* 64 bits, contain bits for if present, writable, supervisor mode, etc...
* 48bit virtual address and physical address space
* Address of large pages:
    * first level PTE doesn't support (512GB) pages
    * second level PTE supports 1GB Pages
    * third level PTE supports 2MB Pages
    * 4th PTE only 4K Pages

## On Boot
* asm code loads addresses of the 4 levels depending on how much static memory kernel requires
* only static

## Post Boot
* Dynamic, allows page table mappings to change during runtime
* Map more pages if more memory is needed
* Unmap pages if memory is not needed
* What should virtual address space look like in terms of policies?
* How are they enforced?

## Virtual address space of process P
* How can we ensure address space of P and P+1 are separate -> page tables

## Meltdown
* Kernel is mapped into higher regions of address space for P, how to make sure P can't access/modify Kernel data?
    * User supervisor bit can be set in PTE, process can't access kernel data despite it being mapped in
    * Post 2018 Meltdown was able to read kernel data, kernel no longer mapped in address space
        * Kernel now has own page table
        * on every syscall or Process switch, page tables must be changed, performance impact

## Foreshadow Attack
* bypasses the present bit of a PTE, could read pages even if not present
* Now we must clear page frame address when un-mapping

## RIDL
* bypass the address bits - able to read other data
* must flush CPU registers to solve

# Page Table Walk
* Dynamically update page tables for each address space
* If a process maps/un-maps in memory, it must be added/removed to address space
* MMU uses updated page tables
* find page table entry (assume x86_64, 48bit virt addr, page table mapped into virtual memory)
1. locate top-level PT (read cr3 register or process struct)
2. Locate 2nd level PT
    * get virtual pointer to top-level page
    * use bits 39-47 of virtual address as index
    * Is the page table entry present? if no, then abort
3. Locate 3rd level PT
    * get virtual pointer to 2nd level page
    * use bits 30-38 of virtual address as index
    * is page table entry present? if no, then abort
4. ...
5. Last page table entry has physical address of page

## Page Table Mapping
* Input is Virtual address where mapping will take place, do the page table walk to find locate the page table entry
* If entry not present at any level, allocate new page, store its physical address in non-present entry, continue with next level
* Finally store physical address of page to be mapped in final PTE

## Page Table Unmapping
* Locate PTE from virt addr to be unmapped with page table walk
* zero out final table entry (Because of Foreshadow attack)
* Free the page table (optional)
* free the page

## Permission bits
* P: page faults (0) or present (1)
* R/W: read-only (0) or writable (1)
* U/S: Supervisor-only (0) or user-accessible (1)
    * SMAP protection: 1 becomes user-only (follow POLP)
* XD: execute allowed (0) or disabled (1)



# Questions
* What is in the address field of a PTE?
    * there is a fraction of a physical address along with the page table offset
* How much memory can be mapped in x86_64?
    * 48 bits to store physical address = 2^40 * 2^8 = 256 Tb
* How much memory does a Page in the Page table map?
    * depends whether it is used for large pages, huge or normal pages, but each PTP is 4KB and each PTE is 8 bytes 4096/8 = 512 or 2^12 / 2^3 = 2^9
* How to find page table pages?
    * Go through levels of page tables to find entry we want to change.


