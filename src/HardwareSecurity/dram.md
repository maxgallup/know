# DRAM

* Dynamic Random Access Memory
* Organized in memory cells with 1-bit data
* Charge/Discharge capacitor requires refresh due to charge leak
* DRAM organization (aka "geometry"):
    * Index - lowest 3 bits access which byte within the 8 byte channel to target
    * Channel - Some bits address which channel, each channel has a memory bus (data/control are separated) offers bus-level parallelism (128 bits per transfer)
    * DIMM - Some bits address which DIMM 
    * Rank - Which *"side"* of the DIMM, can work independently, at any time only one rank can be active, over the bus requests are sent/seen by all ranks and only selected rank will react to request
    * Chips - all chips on a rank are active during memory request "8x" Chips require 8 chips, since each does 8 bits for a 64 bit total.
    * Banks - Spans all chips - addressed by some bits
    * Rows - Rows in each bank - addressed by some bits
    * Columns - addressed by some bits
* Capacity = rows x columns x bytesPerColumn x banks x chips x ranks x DIMMs
* RowSize = columns x bytesPerColumn x Chips

## Read
1. RowBuffer = logically spans all chips data from row gets "moved destructively" from row into rowBuffer
2. 8 requests to read one cache line - read rowBuffer byte-by-byte
3. Write rowBuffer back into row
    * When does rowBuffer get written back into row?
    * Open-row policy: *MC expects more hits on the same row*
        * row kept open, optimizing for access locally
        * we expect cheap row buffer hits
        * but misses are more costly (need precharge)
    * Close-row policy: *MC expects requests for different rows*
        * precharge after access, optimizing for little locality
        * we expect misses, eliminate precharge latency
    * MCs use proprietary policies, along with undocumented policies
        * (want to improve bank-level parallelism)

## Address Mapping
* physical address space != dram address space
* MC decides the mapping between physical addresses to dram addresses
* complex xor functions on all recent CPUs
* Mapping has an impact on performance *trade secret!*
* Knowing mapping has security applications *dram side side channels!*

## Proprietary Knowledge:
* MC
    * policies: precharge, refresh, scheduling
    * data encoding on the bus (ECC bits)
    * physical -> dram address mapping
* DRAM might internally change row address mapping
    * improve routing on the board
    * blacklist bad rows
    * figuring this out is an open problem

## Side Channel with RowBuffers
* Reading data from non-activated rows will be slow
* Can find whether row was active or not based on this side channel

## Timing Attacks
* Pros
    * not labour intensive
    * special equipment not necessary
    * can be done remotely
* Cons
    * cannot look at data its
    * cannot easily reconstruct address selection functions precisely
* spy on victim core (repeated check for bank conflicts to detect victim accesses to that bank)

## Bus Probing
* Pros:
    * precise
    * analyze one bit at a time with different addresses
    * can look at both address and data bits
* Cons:
    * labour-intensive
    * expensive equipment

# Rowhammer
Found in 2014, still present in DDR2, DDR3 and DDR4. Modern defect, in all DRAM modules. All an attacker has to do, is make precise access patterns to flip a row in the RAM module. First, must know the physical -> dram mapping. (Double sided row-hammer)
1. Activate Row 0
2. Activate Row 2

Result: Cells in Row 1 will bitflip because of leaked charge, before dram gets to refresh the charge.

* Can lead to privilege escalation

### Rowhammer Mitigations
* ECC memory
* Target Row Refresh, Make the DRAM module refresh the capacitors faster than rowhammer can leak charges.
* Disable software features that make it easier
    * disable pagemap for unprivileged users
    * disable specific DMA allocators (uncached memory), (ION allocator in android) memory deduplication
* Software mitigations
    * ZebRAM (OSDI 18), Throwhammer (ATC 18)
    * Drammer (CCS 16)
    * Hammertime (RAID 18)

### Knowing the data encoding
* ECC Memory, uses 72 lines instead of 64
* ECC Function that maps data to which is secret (security by obscurity)
* Inject errors with a needle to shortcircuit a bit
* Data patterns reconstruct the 

### ECCploit
* After 1 year, over different memroy there is a fraction that canbe exploited on ECC Memory, after knowing the mapping it is still possible to recreate all exploits on ECC

### TRRespass
* Target row refresh is sampled, all practical implementations are limited. 
* known as "Many Sided Rowhammer", overwhelm sampler to bypass TRR
    * SMASH applies this technique even from JS in the browser
* Other Flavors:
    * Blacksmith (non-uniform patterns to break TRR solutions)
    * Half Double (exploits TRR) uses far agressor rows to trigger hammer itself
* Rowhammer as a sidechannel
    * RAMBLEED observe bit flips to leak victim data
    * HammerScope observe flips to leak DRAM power usage
    * SpyHammer observe flips to leak DRAM temperature

# Cold Boot Attack
* Threa model: stolen laptop
* DRAM holds secrets
* DRAM keeps charge for a while even is they are not refreshed, Longer if cold!
1. Cool DIMMS with a spray
2. shut the laptop down
3. usb-boot into a malicious OS or move DIMM
4. read any sensitive data
* Mitigations:
    * data scrambling, (however weak encryption, still broken) Paper: *Cold boot attacks are stil hot*

# DRAM Address Translation
* MMU: maps virtual to physical memory
    * virtualize physical memory
    * flexible memory management
    * isolation and protection
* MMU uses caching to make performance acceptable



# Questions
* Why is there a distinction between chips and banks (chips aren't addressed in the physical address)?
    * Since chips are accessed all at once, banks are a slice into all chips.
* Are there any relations to CPU optimizations to memory access patterns in DIM?

* Channel addresses are low, because implementing channel-level parallelism is implemented this way.
* Why are column addresses low?
    * Due to locality there will be similar local rows in the same column which maximize row buffer hit rate
* typically switch dimm and rank address to spread out address targeting to maximize bank level optimization



