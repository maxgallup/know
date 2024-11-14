# ARM

## Family types
* Coretx-A/R/M series

## Thumb Instruction Set
* introduces 16-bit encoding for improved code density


## ARM ABI
* argument & result registers
* Special registers like Link Register and intra-procedure call scratch register


## Protected Memory System
* MPU - separates flat address space into regions



## Instructions
### Arithmetic instructions
* MNEMONIC{s} r0, r1, rm
* MNEMONIC{s} r0, r1, immediate
* `ADD r0, r1, r2` - store the result of `r1 + r2` in `r0`
* other arithmetic instructions require suffix {s} to upadte condition flags
    * `EORS r4, r1, r0` xor r1 with r2 and store in r4
    * `SUBS r0, r4, #8` 8 - r4 stored in r0

### MOV
* more restrained than x86
* can only mov to a register from another register or immediate

### Push/Pop
* PUSH: can only push registers or link-registers
* POP: can only pop registers, pc or link-registers

### Load/Store
* MENMONIX Rt, [Rn, #offset]
* MENMONIX Rt, [Rn, RM]

```
LDR r0, [pc, #16] // loads pc + 16 into r0
STR r0, [r4, #0]  // stores value from memory at r4 + 0
```


## Branch
* some instructions include branch and exchange where you change the instructions set to 'thumb mode'




