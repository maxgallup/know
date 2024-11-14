# Embedded Systems
 Typically, embedded systems are characterized as systems with the following traits:
    * contain computational devices
    * specialized
    * tight constraints
    * All have been hacked
* Specialized system hardware/physical environment with specific constraints

### Memory Subsystem
* Masked ROM
* Erasable Programmable ROM
* Electrically Erasable PROM
* NAND/NOR FLash

### Memory (volatile)
* DRAM - cheap, scalable single transistor + capacitor
* SRAM - small, fast, no refresh, expnsive, typical 6 transistors (no capacitor)

### Processing Units
* Microprocessor (CPUs with disjoint memory)
* Microcontroller (added peripherals and embeddded memory)
* system-on-chip

### Peripherals
* On chip vs Off-Chip

### Problems with protocol coms
1. speed
2. Synchronization
    * synchronous - shared clock, defines speed & start/stop
    * asynschronous - preefined baudrate, start/stop events
3. Bus arbitration