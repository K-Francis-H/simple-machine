# simple-machine
A really simple machine simulator, with assembly language, compiler and execution viewer

Instruction 	Description 	Hex Value
LOD R XY 	Load register R with the contents of memory cell XY 	0x1
SET R XY 	Set the contents of register R equal to bit pattern XY 	0x2
STO R XY 	Store bit pattern in register R to memory cell XY 	0x3
MOV D R S 	Move (copy) contents of register R to register S, D is ignored 	0x4
ADI R S T 	Add values in register S and T as 2's complement then store result in register R 	0x5
ADF R S T 	Add values in registers S and T as floating point* then store result in register R 	0x6
OR R S T 	Bitwise or values in registers S and T then store result in regster R 	0x7
AND R S T 	Bitwise and values in registers S and T then store result in register R 	0x8
XOR R S T 	Bitwise xor values in register S and T then store result in register R 	0x9
ROT R D X 	Rotate the value in register R to the right X times, D is ignored 	0xA
JMP R XY 	Jump to the instruction in memory cell XY if the bit pattern in register R equals that in register 0 	0xB
HLT 	Halt program execution 	0xC
