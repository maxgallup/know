# Genesis (x86-64)

After pressing the power on button:
1. CPU executes code in ROM.
1. Loads firmware BIOS, UEFI, Coreboot, OpenFirmware into memory
1. Initializes memory and other devices
1. Loads boot code into memory, traditionally first sector was boot code

Traditional __two-stage bootloader__ is there for historical reasons, since there were only 512bytes available for the first boot section. Thus, it must simply load the second stage boot code with more memory available.




# Questions
* When booting why is it required to go through all modes?
* How is ROM code updated on older hardware?
