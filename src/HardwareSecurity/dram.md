# DRAM

* Dynamic Random Access Memory
* Organized in memory cells with 1-bit data
* Charge/Discharge capacitor requires refresh due to charge leak
* DRAM organization (aka "geometry"):
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


# Questions
* Why is there a distinction between chips and banks (chips aren't addressed in the physical address)?
* Are there any relations to CPU optimizations to memory access patterns in DIM?

