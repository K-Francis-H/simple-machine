function Assembler(assemblyCode){

	var specialChars = {
		LINE_END : ";",
		COMMENT  : "#",
		WHITE_SPACE : " "
	};

	var comm = {
	      LOD : 0x10,    //RXY -> load bits in memory cell XY into register R
	      SET : 0x20,    //RXY -> set bits in register R to bits XY
	      STO : 0x30,    //RXY -> store bits in register R to mem cell XY
	      MOV : 0x40,    //DRS -> move bits in register R to register S, D is ignored
	      ADI : 0x50,    //RST -> add bits in register S and T as 2's complement then store in register R
	      ADF : 0x60,    //RST -> add bits in register S and T as floating point and store in register R
	      OR  : 0x70,    //RST -> OR bits in registers S and T then store in R
	      AND : 0x80,    //RST -> AND bits in registers S and T then store in R 
	      XOR : 0x90,    //RST -> XOR bits in registers S and T then store in R
	      ROT : 0xa0,    //R0X -> rotate the bits in register R to the right X times
	      JMP : 0xb0,    //RXY -> jump to instruciton at mem cell XY if value in register R == value in register 0
	      HLT : 0xc0,    //000 -> halt program execution 
	};

	var machineCode;
	var assemblyCode = assemblyCode;

	this.assemble = function(callback){

		var machineCode = [];
		var index = 0;

		var lines = assemblyCode.replace(/\n|\r/g, "")
		                        .split(specialChars.LINE_END);

		console.log(lines);		

		for(var i=0; i < lines.length; i++){
			console.log(lines[i]);
			var tokens = lines[i].split(specialChars.WHITE_SPACE);
			//enter the command
			console.log(tokens);
			var command = comm[tokens[0]];
			switch(comm[tokens[0]]){ //turn the text into the actual byte command
				case comm.LOD :
				case comm.SET :
				case comm.STO :
				case comm.ROT :
				case comm.JMP :
						var register = new Number(tokens[1]);
						console.log(command);
						console.log(register);
						machineCode[index++] = command | register;
						machineCode[index++] = new Number(tokens[2]);
						break;
				case comm.MOV :
						machineCode[index++] = comm.MOV;
						machineCode[index++] = new Number(tokens[1]);
						break;
				case comm.ADI :
				case comm.ADF :
				case comm.OR  :
				case comm.AND :
				case comm.XOR :
						var register = new Number(tokens[1]);
						machineCode[index++] = command | register;
						var s = new Number(tokens[2]);
						var t = new Number(tokens[3]);
						machineCode[index++] = s | t;
						break;
				case comm.HLT :
						machineCode[index++] = comm.HLT;
						machineCode[index++] = 0x00;
						break;
				default :
					//TODO throw an error


			}

			//shift these all together into fixed command size
		}

		//TODO assemble the codez
		return machineCode;	

		//callback(error, result);
	}

	

}
