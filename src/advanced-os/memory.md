# Physical Memory
The memory controller communicates on the BUS over different channels (usually 1 / 2), but only one __channel__ can be active at a time. For each channel there are physical memory modules ([DIMMs](https://en.wikipedia.org/wiki/DIMM)). One side of the __DIMM__ is a __rank__, typically 1/2 ranks per DIMM. Each rank has a __chip__, with a number of __rows and columns__.


Linux organizes memory into consecutive page frames and grouped together in the following way:
* Nodes - [NUMA](https://en.wikipedia.org/wiki/Non-uniform_memory_access) abstraction for N "banks"
* Zones - tagged regions within each node
* Pages - Physical page frames from each zone

Linux Zone ranges:
* ZONE_DMA: 0 - 16MB _for legacy hardware_
* ZONE_DMA32: 16MB - 4GB _for legacy hardware_
* ZONE_NORMAL: 16MB - 896MB _for kernel_
* ZONE_HIGHMEM: 896MB - END _used for kmap, on demand memory mapping x86_

Zones are managed independently, however boundaries become blurry when under pressure. Kernel daemon kswapd will reclaim memory when certain thresholds are crossed. Virtual memory mapping on x86-32 starts ZONE_DMA and ZONE_NORMAL directly after the PAGE_OFFSET and ZONE_HIGHMEM is mapped on demand. The PAGE_OFFSET is where the user space processes start. However, for x86-64 there are 47 bits of memory address space available, so it can simply map all zones into one continuous region.


## Pages
* 4KB of physical memory
* `linux/mmzone.h` has mem_map array which holds page objects


# Allocators
Linux has one main page allocator (Buddy allocator) which allocates contiguous areas of physical memory. All allocators custom to the kernel from different subsystems interact with it. The Memblock allocator is an early boot-time allocator, discarded after initialization and contains two simple data structures: all present memory and allocated memory regions. Memblock has the following procedures:

Setup: add all available physical memory regions, add reserved to reserved list, sort by base address
Allocation: first fit memory, add to reserved list and merge neighbors if possible
De-allocation: scans reserved list, split up regions if necessary


## Buddy Allocator
Power of two allocator with free coalescing. During allocation, requested size will go into a block that satisfies the size, unused remainders are inevitable. During de-allocation, neighboring buddy block is checked and coalesced if it is free (recursively). MAX_ORDER in linux specifies a power of two coefficient for the maximum number of orders (levels). Works at a per-zone separation.

### Fragmentation
* __External fragmentation__ When a request for a large amount of memory comes in, although there might be enough memory for it, it is unable to be allocated due to many disjoint holes of unallocated space.
    * Solved by the `vmalloc` allocator which sits on top of buddy allocator for large allocations, uses first-fit technique and maps page frames in virtually continuous buffer to scattered pages across physical memory. Allocates a single page from the buddy allocator at a time.
* __Internal fragmentation__ Allocations smaller than 4Kb will always have wasted space, as well as when requests are just above the closest power of two.
    * Addressed with the `slab` allocator which also sits on top of buddy allocator. For small allocations, continuous in virtual memory as well as physical memory

### Sanity Checks during development
* `CONFIG_DEBUG_PAGEALLOC`
    1. Out of bounds detection, adds page guards before and after page which limits how far out of bounds accesses can go. Page canaries will be changed if magic value is changed are also possible.
    1. Use after free detection (`kernel_map_pages`) simply unmaps virtual memory interrupt handled by MMU, accept for when it is reused again. Can also use page poisoning which lets us lazily detect write-after-frees, however also after page is reused, no longer protected
    1. `kmemcheck` - traps at every read to check if data is initialized, very expensive
    1. `kmemleak` - periodic garbage collection, reports about unlinked objects, false positives can happen
    1. `kasan` - compiler instrumentation, adds combines canary and poison ideas

# Questions
* Holes in physical memory are either device mapped or reserved - might the BIOS reserve memory regions?
* Why does the kernel have to use virtual memory addresses in the first place can't it just map directly
* Padding added to zone struct caching?
* Why does memblock sort by base address?