# Firmware

Somewhere between hardware and software, very heterogeneous.
* Classification: **OS-Centric**
    * Type 1 - General purpose OS
        * Example: Linux on a router
        * typically no dynamically loadable modules
    * Type 2 - embedded OS
        * Example: RTOS
        * has real-time constraints
        * typically reduced functionality compared to traditional OS
        * much stricter
    * Type 3 - bare metal
        * Might include "OS-library"
        * No user/kernel separation
        * Libraries: HAL hardware abstraction layers

## Common Programming Patterns for Embedded
* State Machines
    * exactly one state at a time
* Super Loop
    * all functionality is run in a loop
    * problems: asynchronous events and starvation (events coming in at race condition)
    * each task depends on a previous - fully blocking
* Event-driven:
    * state-machines react to events
    * events grouped by topic
    * every component subscribes to a topic
    * decoupling (no direct function calls)
    * implemented with non-blocking event queues
* RTOS
    * multiple 

## Hardware Interaction
* ARM contains different families
    * Cortex-A - high performance, suitable for high complexity, general purpose
    * Cortex-R - good for hard real-time OSes
    * Cortex-M - smallest/lowest power best for bare-metal
* Hardware has different Advanced Microcontroller Bus
    * Timer peripherals
    * communication peripherals
    * GPIO peripherals
    * ARM has separate data/code buses

## Memory-Mapped IO
* Type 1/2 firmware has no virtual address
* Memory Map is part of data sheet that describes physical memory that is mapped to devices
* System Memory is READ-ONLY
* Peripherals section contains mappings for periphery
    * For example: GPIO
        * configuration of pins, pull up/down
        * CRL/CRH control registers
        * input / output data
        * One control registers are found, simply write data to address (HAL provides this)
    * Workflow
        * setup clocks
        * configure Control Registers
        * Interact with Data registers
* Data Movement
    * Polling - software initiates read
        * busy loop, software based, might be missed
    * Interrupts - hardware event is generated
        * async events which trigger an interrupt handler
        * advantage: is can't miss an event
        * on ARM: Nested Vector Controller
            * Higher priority IRQs may interrupt lower-priority ones
    * DMA - peripheral writes to memory

## Firmware Extraction
* rarely documented, usually closed source
* usually just get big binary blob
* unpacking tools like `binwalk`
* analyzers like `ghidra`
* Challenges
    * custom formats
    * i/o connections not available 
    * secure boot
    * encrypted images

* Extracting Techniques (least invasive to most invasive)
    * Updates
        * updates might be sniffable
    * on-device dump
        * some devices might have debug/boot shell (`u-boot`)
        * exploitation of application software
        * once in the shell, dump through common tools
    * boot loaders
        * bootloader is special code that
            * may run before everything else on the system
            * may allow to re-flash firmware
            * may allow to read firmware
    * debug interfaces
        * sometimes debug ports are not remove/obfuscated, can simply plug-in
        * read-out protections can be bypassed
    * flash dumping
        * hardware tools by removing chips or de-soldering
    * fault injection
        * exploit electrical properties to glitch in order to gain insights



