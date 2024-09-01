# Advanced Operating Systems

An operating system is comprised of many layers of abstraction where each layer generally takes on a different responsibility. At the lowest level is the __kernel__ which interacts directly with the hardware and runs with the highest level of privilege. Then the kernel is wrapped in a _"shell"_ of __system software__. These are user space programs that interact with the kernel and provide critical functionality. Lastly, there is an optional __desktop environment__ that provides a graphical user interface, if the OS is being used directly by end users.


```
     +--------------------------+
     |   Desktop Environment    |
     |  +--------------------+  |
     |  |  System Software   |  |
     |  |  +--------------+  |  |
     |  |  |    Kernel    |  |  |
     |  |  | +----------+ |  |  |
     |  |  | | Hardware | |  |  |
     +--------------------------+
```

