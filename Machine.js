function Machine(){

   //var commands = {
      //written with preceding zero because it is evaluated at the nybble level not byte level
      LOD = 0x1;    //RXY -> load bits in memory cell XY into register R
      SET = 0x2;    //RXY -> set bits in register R to bits XY
      STO = 0x3;    //RXY -> store bits in register R to mem cell XY
      MOV = 0x4;    //DRS -> move bits in register R to register S, D is ignored
      ADI = 0x5;    //RST -> add bits in register S and T as 2's complement then store in register R
      ADF = 0x6;    //RST -> add bits in register S and T as floating point and store in register R
      OR  = 0x7;   //RST -> OR bits in registers S and T then store in R
      AND = 0x8;   //RST -> AND bits in registers S and T then store in R 
      XOR = 0x9;   //RST -> XOR bits in registers S and T then store in R
      ROT = 0xa;   //R0X -> rotate the bits in register R to the right X times
      JMP = 0xb;   //RXY -> jump to instruciton at mem cell XY if value in register R == value in register 0
      HLT = 0xc;   //000 -> halt program execution 
   //};

  
   var register = new Uint8Array(16);
   var memory = new Uint8Array(256);

   var programCounter = 0x0; //new uint16
   var instructionRegister = new Uint16Array([0])[0]; //maybe it has to be an array

   var loadedPrograms = [];

   var haltFlag = false;
   var jumpFlag = false; //prevents program counter increment when jump is performed

   this.loadProgramText = function(program){
      //TODO
      //pick a random spot
      //var rawProgram = document.getElementById("program-input");
      //var s = "0123456789abcdef";
      var memIndex = 0;
      for(var i=0; i < program.length; i+=4){
         //console.log( ((strToHex(program[i]) << 4) + strToHex(program[i+1])).toString("hex") );// << 4));// + strToHex(rawProgram[i+1]));
         //console.log( ((strToHex(program[i+2]) << 4) + strToHex(program[i+3])).toString("hex") );
         memory[memIndex++] = new Number("0x"+program[i]+program[i+1]);//(strToHex(program[i]) << 4) + strToHex(program[i+1]);
         memory[memIndex++] = new Number("0x"+program[i+2]+program[i+3]);//(strToHex(program[i+2]) << 4) + strToHex(program[i+3]);
         console.log("program instruction "+(i/4)+": "+memory[memIndex-2]+","+memory[memIndex-1]);
      }

      printState();
   }

   this.loadProgramCode = function(program){

      //TODO determine where to load if needs be
      //for now its 0
      var memIndex = 0;

      for(var i=0; i < program.length; i++){
         memory[memIndex++] = program[i];
      }
      //memory = program;

      console.log(memory);

      printState();
   }

   function strToHex(str){
      switch(str){
         case "0":
            return 0;
         case "1":
            return 1;
         case "2":
            return 2;
         case "3":
            return 3;
         case "4":
            return 4;
         case "5":
            return 5;
         case "6":
            return 6;
         case "7":
            return 7;
         case "8":
            return 8;
         case "9":
            return 9;
         case "a":
         case "A":
            return 0xa;
         case "b":
         case "B":
            return 0xb;
         case "c":
         case "C":
            return 0xc;
         case "d":
         case "D":
            return 0xd;
         case "e":
         case "E":
            return 0xe;
         case "f":
         case "F":
            return 0xf;
      }
   }

   this.runProgram = function(){
      haltFlag = false;
      programCounter = 0;
      var intervalCtl = setInterval(function(){
         if(!haltFlag){
            fetch();
            decode();
            execute();
            printState();
            if(!jumpFlag){
               programCounter += 2;
            }
            else{
               jumpFlag = false;
            }
         }else{
            clearInterval(intervalCtl);
         }

      }, 1000);
   }


   function fetch(){
      instructionRegister = (memory[programCounter] << 8) + memory[programCounter+1];
      console.log(memory[programCounter]);
      console.log(memory[programCounter+1]);
      console.log("ins reg: "+instructionRegister.toString(16));
   }
   
   function decode(){
      var opcode, params;
      //isolate opcode
      console.log("ins reg2: "+instructionRegister);
      opcode = (instructionRegister & 0xF000) >> 12;
      console.log("op: "+(instructionRegister&0xF000));
      console.log("opcode: "+opcode);
      //parse params based on opcode value
      params = {};
      switch(opcode){
         case LOD:
         case SET:
         case STO:
            params.R = (instructionRegister & 0x0F00) >> 8;
            params.XY = (instructionRegister & 0x00FF);
            break;
         case MOV:
            params.R = (instructionRegister & 0x00F0) >> 4;
            params.S = (instructionRegister & 0x000F);
            break;
         case ADI:
         case ADF:
         case OR:
         case AND:
         case XOR:
            params.R = (instructionRegister & 0x0F00) >> 8;
            params.S = (instructionRegister & 0x00F0) >> 4;
            params.T = (instructionRegister & 0x000F);
            break;
         case ROT:
            params.R = (instructionRegister & 0x0F00) >> 8;
            params.X = (instructionRegister & 0x000F);
            break;
         case JMP:
            params.R = (instructionRegister & 0x0F00) >> 8;
            params.XY = (instructionRegister & 0x00FF);
            break;
         case HLT:
            //no params
            break;
         default:
            //TODO probably crash or something
            break;    
      }
      execute(opcode, params);
   }

   function execute(opcode, params){
      switch(opcode){
         case LOD:
            lod(params.R, params.XY);
            break;
         case SET:
            set(params.R, params.XY);
            break;
         case STO:
            sto(params.R, params.XY);
            break;
         case MOV:
            mov(params.R, params.S);
            break;
         case ADI:
            adi(params.R, params.S, params.T);
            break;
         case ADF:
            //TODO implement
            break;
         case OR:
            or(params.R, params.S, params.T);
            break;
         case AND:
            and(params.R, params.S, params.T);
            break;
         case XOR:
            xor(params.R, params.S, params.T);
            break;
         case ROT:
            rot(params.R, params.X);
            break;
         case JMP:
            jmp(params.R, params.XY);
            break;
         case HLT:
            hlt();

      }
   }

   function lod(R, XY){
      register[R] = memory[XY];
   }
   function set(R, XY){
      register[R] = XY;
   }
   function sto(R, XY){
      memory[XY] = register[R];
   }
   function mov(R, S){
      register[S] = register[R];
   }
   function adi(R, S, T){
      //maybe this is really this simple... thanks JS for once
      register[R] = register[S] + register[T];
   }
   function adf(R, S, T){
      //TODO 8 bit floating point
      var sSign = register[S] & 0x80;
      var sExp  = (register[S] & 0x70) - 4; //exp is on 3bit excess notation
      var sMant = register[S] & 0x0F;

      var tSign = register[T] & 0x80;
      var tExp  = (register[T] & 0x70) - 4; //exp is in excess notation
      var tMant = register[T] & 0x0F;

      //TODO have to shift the mantissas around line up on the radix, add in two's commplement then restore the value
   }
   function or(R, S, T){
      register[R] = register[S] | register[T];
   }
   function and(R, S, T){
      register[R] = register[S] & register[T];
   }
   function xor(R, S, T){
      register[R] = register[S] ^ register[T]; //TODO check what XOR is in JS
   }  
   function rot(R, X){
      for(var i=0; i < X; i++){
         setHighBit = (register[R] & 0x01) === 1;
         register[R] >> 1;
         if(setHighBit){
            register[R] += 0x80;
         }
      } 
   }
   function jmp(R, XY){
      if(register[0x0] === register[R]){
         console.log("jumping to instruction at mem cell: "+XY);
         jumpFlag = true;
         programCounter = XY;
         //instructionRegister = memory[XY]; //this wont do need to move program counter
      }
   }
   function hlt(){
      //TODO end and print results to screen
      haltFlag = true;
      

   }

   //TODO this is broken
   function printState(){
      var memoryCanvas = document.getElementById("memory");
      var ctxm = memoryCanvas.getContext("2d");

      var registerCanvas = document.getElementById("register");
      var ctxr = registerCanvas.getContext("2d");

      //set program counter
      document.getElementById("program-counter").innerHTML=programCounter/2;
      document.getElementById("instruction-register").innerHTML=instructionRegister.toString(16);

      for(var i=0; i < 16; i++){
         for(var j=0; j < 16; j++){
            var g = memory[i*16 + j];///255;
            //console.log("color for mem "+(i*16+j)+": "+ g)
            ctxm.fillStyle="rgb("+g+","+g+","+g+")";
            ctxm.fillRect(j*10,i*10,10,10);
         }
      }

      for(var i=0; i < 16; i++){
         var g = register[i];
         ctxr.fillStyle="rgb("+g+","+g+","+g+")";
         ctxr.fillRect(0,i*10,10,10);
      }
      
   }



}//end Machine.js def
