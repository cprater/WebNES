"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = executeCpuInstructionSwitch;
function executeCpuInstructionSwitch(opcode, cpu, memory) {
	switch (opcode) {

		case 0:
			{
				// BRK NONE
				var cyclesTaken = 7;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				// dummy read of opcode after brk
				memory.read8(cpu.getPC());
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				memory.write8(0x100 + cpu.regS, cpu.getPC() >> 8 & 0xFF);
				if (cpu.regS === 0) {
					cpu.regS = 0xFF;
				} else {
					cpu.regS--;
				}
				cpu.incrementSubcycle();
				memory.write8(0x100 + cpu.regS, cpu.programCounter & 0xFF);
				if (cpu.regS === 0) {
					cpu.regS = 0xFF;
				} else {
					cpu.regS--;
				}
				cpu.incrementSubcycle();
				memory.write8(0x100 + cpu.regS, (cpu.statusRegToByte() | 0x30) & 0xFF);
				if (cpu.regS === 0) {
					cpu.regS = 0xFF;
				} else {
					cpu.regS--;
				}
				cpu.setPC(cpu.read16FromMemNoWrap(CPU_IRQ_ADDRESS));
				cpu.setInterrupt(true);
				return cyclesTaken;
			};
			break;
		case 1:
			{
				// ORA INDIRECTX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				address = address + cpu.regX & 0xFF;
				var readInValue = cpu.read16FromMemWithWrap(address);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA |= operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 2:
			{
				// HLT NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				var result = 0;
				console.log("illegal instruction HLT not implemented");
				return cyclesTaken;
			};
			break;
		case 3:
			{
				// ASO INDIRECTX
				var cyclesTaken = 8;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				address = address + cpu.regX & 0xFF;
				var readInValue = cpu.read16FromMemWithWrap(address);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x80) > 0);
				var result = operationModeData << 1 & 0xFF;
				cpu.regA |= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 4:
			{
				// SKB ZEROPAGE
				var cyclesTaken = 3;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				return cyclesTaken;
			};
			break;
		case 5:
			{
				// ORA ZEROPAGE
				var cyclesTaken = 3;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA |= operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 6:
			{
				// ASL ZEROPAGE
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x80) > 0);
				var result = (operationModeData & 0xFF) << 1 & 0xFF;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 7:
			{
				// ASO ZEROPAGE
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x80) > 0);
				var result = operationModeData << 1 & 0xFF;
				cpu.regA |= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 8:
			{
				// PHP NONE
				var cyclesTaken = 3;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				memory.write8(0x100 + cpu.regS, (cpu.statusRegToByte() | 0x10) & 0xFF);
				if (cpu.regS === 0) {
					cpu.regS = 0xFF;
				} else {
					cpu.regS--;
				}
				return cyclesTaken;
			};
			break;
		case 9:
			{
				// ORA IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.regA |= readInValue & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 10:
			{
				// ASL ACCUMULATOR
				var cyclesTaken = 2;
				var readInValue = cpu.regA;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				cpu.setCarry((readInValue & 0x80) > 0);
				var result = (readInValue & 0xFF) << 1 & 0xFF;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.regA = result & 0xFF;
				return cyclesTaken;
			};
			break;
		case 11:
			{
				// ANC IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.regA &= readInValue;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.setCarry(cpu.getSign());
				return cyclesTaken;
			};
			break;
		case 12:
			{
				// SKW ABSOLUTE
				var cyclesTaken = 4;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				return cyclesTaken;
			};
			break;
		case 13:
			{
				// ORA ABSOLUTE
				var cyclesTaken = 4;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA |= operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 14:
			{
				// ASL ABSOLUTE
				var cyclesTaken = 6;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x80) > 0);
				var result = (operationModeData & 0xFF) << 1 & 0xFF;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 15:
			{
				// ASO ABSOLUTE
				var cyclesTaken = 6;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x80) > 0);
				var result = operationModeData << 1 & 0xFF;
				cpu.regA |= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 16:
			{
				// BPL RELATIVE
				var cyclesTaken = 2;
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
				var branchTaken = !cpu.getSign();
				if (branchTaken) {
					cpu.incrementSubcycle();
					if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
						cyclesTaken += 1;
						cpu.incrementSubcycle();
					}
					cyclesTaken += 1;
					cpu.incrementSubcycle();
					cpu.setPC(readInValue + 2 & 0xFFFF);
				} else {
					cpu.incrementSubcycle();
					memory.read8(cpu.getPC() + 1 & 0xFFFF);
					cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				}
				return cyclesTaken;
			};
			break;
		case 17:
			{
				// ORA INDIRECTY
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				address = cpu.read16FromMemWithWrap(address);
				var readInValue = address + cpu.regY & 0xFFFF;
				if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA |= operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 18:
			{
				// HLT NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				var result = 0;
				console.log("illegal instruction HLT not implemented");
				return cyclesTaken;
			};
			break;
		case 19:
			{
				// ASO INDIRECTY
				var cyclesTaken = 8;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				address = cpu.read16FromMemWithWrap(address);
				var readInValue = address + cpu.regY & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x80) > 0);
				var result = operationModeData << 1 & 0xFF;
				cpu.regA |= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 20:
			{
				// SKB ZEROPAGEX
				var cyclesTaken = 4;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				return cyclesTaken;
			};
			break;
		case 21:
			{
				// ORA ZEROPAGEX
				var cyclesTaken = 4;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA |= operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 22:
			{
				// ASL ZEROPAGEX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x80) > 0);
				var result = (operationModeData & 0xFF) << 1 & 0xFF;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 23:
			{
				// ASO ZEROPAGEX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x80) > 0);
				var result = operationModeData << 1 & 0xFF;
				cpu.regA |= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 24:
			{
				// CLC NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				cpu.setCarry(false);
				return cyclesTaken;
			};
			break;
		case 25:
			{
				// ORA ABSOLUTEY
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFFFF;
				if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA |= operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 26:
			{
				// NOP NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				return cyclesTaken;
			};
			break;
		case 27:
			{
				// ASO ABSOLUTEY
				var cyclesTaken = 7;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x80) > 0);
				var result = operationModeData << 1 & 0xFF;
				cpu.regA |= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 28:
			{
				// SKW ABSOLUTEX
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				return cyclesTaken;
			};
			break;
		case 29:
			{
				// ORA ABSOLUTEX
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA |= operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 30:
			{
				// ASL ABSOLUTEX
				var cyclesTaken = 7;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x80) > 0);
				var result = (operationModeData & 0xFF) << 1 & 0xFF;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 31:
			{
				// ASO ABSOLUTEX
				var cyclesTaken = 7;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x80) > 0);
				var result = operationModeData << 1 & 0xFF;
				cpu.regA |= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 32:
			{
				// JSR IMMEDIATE16
				var cyclesTaken = 6;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				var result = cpu.getPC() - 1;
				if (result < 0) result = 0xFFFF;
				cpu.incrementSubcycle();
				memory.write8(0x100 + cpu.regS, result >> 8 & 0xFF);
				if (cpu.regS === 0) {
					cpu.regS = 0xFF;
				} else {
					cpu.regS--;
				}
				cpu.incrementSubcycle();
				memory.write8(0x100 + cpu.regS, result & 0xFF);
				if (cpu.regS === 0) {
					cpu.regS = 0xFF;
				} else {
					cpu.regS--;
				}
				cpu.incrementSubcycle();
				cpu.setPC(readInValue & 0xFFFF);
				return cyclesTaken;
			};
			break;
		case 33:
			{
				// AND INDIRECTX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				address = address + cpu.regX & 0xFF;
				var readInValue = cpu.read16FromMemWithWrap(address);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA &= operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 34:
			{
				// HLT NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				var result = 0;
				console.log("illegal instruction HLT not implemented");
				return cyclesTaken;
			};
			break;
		case 35:
			{
				// RLA INDIRECTX
				var cyclesTaken = 8;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				address = address + cpu.regX & 0xFF;
				var readInValue = cpu.read16FromMemWithWrap(address);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(result > 0xFF);
				result &= 0xff;
				cpu.regA &= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 36:
			{
				// BIT ZEROPAGE
				var cyclesTaken = 3;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				if ((readInValue & 0xE007) === 0x2002) {
					cpu.mainboard.ppu.bitOperationHappening();
				} // BIT 2002 optimisation
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.setSign((operationModeData & 0xFF & 0x80) > 0);
				cpu.setZero((cpu.regA & (operationModeData & 0xFF) & 0xFF) === 0);
				cpu.setOverflow((operationModeData & 0x40) > 0); // Copy bit 6 to OVERFLOW flag.
				return cyclesTaken;
			};
			break;
		case 37:
			{
				// AND ZEROPAGE
				var cyclesTaken = 3;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA &= operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 38:
			{
				// ROL ZEROPAGE
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = (operationModeData & 0xFF) << 1 | (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(result > 0xFF);
				result &= 0xff;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 39:
			{
				// RLA ZEROPAGE
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(result > 0xFF);
				result &= 0xff;
				cpu.regA &= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 40:
			{
				// PLP NONE
				var cyclesTaken = 4;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.waitOneInstructionAfterCli = cpu.getInterrupt() === true;
				cpu.incrementSubcycle();
				memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				if (cpu.regS === 0xFF) {
					cpu.regS = 0;
				} else {
					cpu.regS++;
				}
				cpu.incrementSubcycle();
				var temp = memory.read8(0x100 + cpu.regS);
				cpu.statusRegFromByte(temp);
				cpu.setBreak(true); // TODO: this was true before in original port, put it back for some reason?
				cpu.setUnused(true);
				if (cpu.waitOneInstructionAfterCli) cpu.waitOneInstructionAfterCli = cpu.getInterrupt() === false;
				return cyclesTaken;
			};
			break;
		case 41:
			{
				// AND IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.regA &= readInValue & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 42:
			{
				// ROL ACCUMULATOR
				var cyclesTaken = 2;
				var readInValue = cpu.regA;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				var result = (readInValue & 0xFF) << 1 | (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(result > 0xFF);
				result &= 0xff;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.regA = result & 0xFF;
				return cyclesTaken;
			};
			break;
		case 43:
			{
				// ANC IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.regA &= readInValue;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.setCarry(cpu.getSign());
				return cyclesTaken;
			};
			break;
		case 44:
			{
				// BIT ABSOLUTE
				var cyclesTaken = 4;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				if ((readInValue & 0xE007) === 0x2002) {
					cpu.mainboard.ppu.bitOperationHappening();
				} // BIT 2002 optimisation
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.setSign((operationModeData & 0xFF & 0x80) > 0);
				cpu.setZero((cpu.regA & (operationModeData & 0xFF) & 0xFF) === 0);
				cpu.setOverflow((operationModeData & 0x40) > 0); // Copy bit 6 to OVERFLOW flag.
				return cyclesTaken;
			};
			break;
		case 45:
			{
				// AND ABSOLUTE
				var cyclesTaken = 4;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA &= operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 46:
			{
				// ROL ABSOLUTE
				var cyclesTaken = 6;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = (operationModeData & 0xFF) << 1 | (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(result > 0xFF);
				result &= 0xff;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 47:
			{
				// RLA ABSOLUTE
				var cyclesTaken = 6;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(result > 0xFF);
				result &= 0xff;
				cpu.regA &= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 48:
			{
				// BMI RELATIVE
				var cyclesTaken = 2;
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
				var branchTaken = cpu.getSign();
				if (branchTaken) {
					cpu.incrementSubcycle();
					if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
						cyclesTaken += 1;
						cpu.incrementSubcycle();
					}
					cyclesTaken += 1;
					cpu.incrementSubcycle();
					cpu.setPC(readInValue + 2 & 0xFFFF);
				} else {
					cpu.incrementSubcycle();
					memory.read8(cpu.getPC() + 1 & 0xFFFF);
					cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				}
				return cyclesTaken;
			};
			break;
		case 49:
			{
				// AND INDIRECTY
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				address = cpu.read16FromMemWithWrap(address);
				var readInValue = address + cpu.regY & 0xFFFF;
				if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA &= operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 50:
			{
				// HLT NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				var result = 0;
				console.log("illegal instruction HLT not implemented");
				return cyclesTaken;
			};
			break;
		case 51:
			{
				// RLA INDIRECTY
				var cyclesTaken = 8;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				address = cpu.read16FromMemWithWrap(address);
				var readInValue = address + cpu.regY & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(result > 0xFF);
				result &= 0xff;
				cpu.regA &= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 52:
			{
				// SKB ZEROPAGEX
				var cyclesTaken = 4;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				return cyclesTaken;
			};
			break;
		case 53:
			{
				// AND ZEROPAGEX
				var cyclesTaken = 4;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA &= operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 54:
			{
				// ROL ZEROPAGEX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = (operationModeData & 0xFF) << 1 | (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(result > 0xFF);
				result &= 0xff;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 55:
			{
				// RLA ZEROPAGEX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(result > 0xFF);
				result &= 0xff;
				cpu.regA &= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 56:
			{
				// SEC NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				cpu.setCarry(true);
				return cyclesTaken;
			};
			break;
		case 57:
			{
				// AND ABSOLUTEY
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFFFF;
				if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA &= operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 58:
			{
				// NOP NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				return cyclesTaken;
			};
			break;
		case 59:
			{
				// RLA ABSOLUTEY
				var cyclesTaken = 7;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(result > 0xFF);
				result &= 0xff;
				cpu.regA &= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 60:
			{
				// SKW ABSOLUTEX
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				return cyclesTaken;
			};
			break;
		case 61:
			{
				// AND ABSOLUTEX
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA &= operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 62:
			{
				// ROL ABSOLUTEX
				var cyclesTaken = 7;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = (operationModeData & 0xFF) << 1 | (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(result > 0xFF);
				result &= 0xff;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 63:
			{
				// RLA ABSOLUTEX
				var cyclesTaken = 7;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(result > 0xFF);
				result &= 0xff;
				cpu.regA &= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 64:
			{
				// RTI NONE
				var cyclesTaken = 6;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				// dummy read
				cpu.incrementSubcycle();
				memory.read8(cpu.getPC());
				cpu.incrementSubcycle();
				if (cpu.regS === 0xFF) {
					cpu.regS = 0;
				} else {
					cpu.regS++;
				}
				cpu.incrementSubcycle();
				var temp = memory.read8(0x100 + cpu.regS);
				cpu.statusRegFromByte(temp);
				if (cpu.regS === 0xFF) {
					cpu.regS = 0;
				} else {
					cpu.regS++;
				}
				cpu.incrementSubcycle();
				cpu.programCounter = memory.read8(0x100 + cpu.regS);
				if (cpu.regS === 0xFF) {
					cpu.regS = 0;
				} else {
					cpu.regS++;
				}
				cpu.incrementSubcycle();
				temp = memory.read8(0x100 + cpu.regS);
				cpu.programCounter |= (temp & 0xFF) << 8;
				cpu.setBreak(true);
				cpu.setUnused(true);
				return cyclesTaken;
			};
			break;
		case 65:
			{
				// EOR INDIRECTX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				address = address + cpu.regX & 0xFF;
				var readInValue = cpu.read16FromMemWithWrap(address);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 66:
			{
				// HLT NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				var result = 0;
				console.log("illegal instruction HLT not implemented");
				return cyclesTaken;
			};
			break;
		case 67:
			{
				// LSE INDIRECTX
				var cyclesTaken = 8;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				address = address + cpu.regX & 0xFF;
				var readInValue = cpu.read16FromMemWithWrap(address);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x01) > 0);
				var result = operationModeData >> 1 & 0xFF;
				cpu.regA ^= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 68:
			{
				// SKB ZEROPAGE
				var cyclesTaken = 3;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				return cyclesTaken;
			};
			break;
		case 69:
			{
				// EOR ZEROPAGE
				var cyclesTaken = 3;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 70:
			{
				// LSR ZEROPAGE
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x01) > 0);
				var result = (operationModeData & 0xFF) >> 1;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 71:
			{
				// LSE ZEROPAGE
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x01) > 0);
				var result = operationModeData >> 1 & 0xFF;
				cpu.regA ^= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 72:
			{
				// PHA NONE
				var cyclesTaken = 3;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				memory.write8(0x100 + cpu.regS, cpu.regA & 0xFF);
				if (cpu.regS === 0) {
					cpu.regS = 0xFF;
				} else {
					cpu.regS--;
				}
				return cyclesTaken;
			};
			break;
		case 73:
			{
				// EOR IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.regA = (cpu.regA ^ readInValue & 0xFF) & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 74:
			{
				// LSR ACCUMULATOR
				var cyclesTaken = 2;
				var readInValue = cpu.regA;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				cpu.setCarry((readInValue & 0x01) > 0);
				var result = (readInValue & 0xFF) >> 1;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.regA = result & 0xFF;
				return cyclesTaken;
			};
			break;
		case 75:
			{
				// ALR IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.regA &= readInValue;
				cpu.setCarry((cpu.regA & 0x01) > 0);
				cpu.regA = cpu.regA >> 1 & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 76:
			{
				// JMP IMMEDIATE16
				var cyclesTaken = 3;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.setPC(readInValue & 0xFFFF);
				return cyclesTaken;
			};
			break;
		case 77:
			{
				// EOR ABSOLUTE
				var cyclesTaken = 4;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 78:
			{
				// LSR ABSOLUTE
				var cyclesTaken = 6;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x01) > 0);
				var result = (operationModeData & 0xFF) >> 1;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 79:
			{
				// LSE ABSOLUTE
				var cyclesTaken = 6;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x01) > 0);
				var result = operationModeData >> 1 & 0xFF;
				cpu.regA ^= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 80:
			{
				// BVC RELATIVE
				var cyclesTaken = 2;
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
				var branchTaken = !cpu.getOverflow();
				if (branchTaken) {
					cpu.incrementSubcycle();
					if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
						cyclesTaken += 1;
						cpu.incrementSubcycle();
					}
					cyclesTaken += 1;
					cpu.incrementSubcycle();
					cpu.setPC(readInValue + 2 & 0xFFFF);
				} else {
					cpu.incrementSubcycle();
					memory.read8(cpu.getPC() + 1 & 0xFFFF);
					cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				}
				return cyclesTaken;
			};
			break;
		case 81:
			{
				// EOR INDIRECTY
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				address = cpu.read16FromMemWithWrap(address);
				var readInValue = address + cpu.regY & 0xFFFF;
				if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 82:
			{
				// HLT NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				var result = 0;
				console.log("illegal instruction HLT not implemented");
				return cyclesTaken;
			};
			break;
		case 83:
			{
				// LSE INDIRECTY
				var cyclesTaken = 8;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				address = cpu.read16FromMemWithWrap(address);
				var readInValue = address + cpu.regY & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x01) > 0);
				var result = operationModeData >> 1 & 0xFF;
				cpu.regA ^= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 84:
			{
				// SKB ZEROPAGEX
				var cyclesTaken = 4;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				return cyclesTaken;
			};
			break;
		case 85:
			{
				// EOR ZEROPAGEX
				var cyclesTaken = 4;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 86:
			{
				// LSR ZEROPAGEX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x01) > 0);
				var result = (operationModeData & 0xFF) >> 1;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 87:
			{
				// LSE ZEROPAGEX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x01) > 0);
				var result = operationModeData >> 1 & 0xFF;
				cpu.regA ^= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 88:
			{
				// CLI NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				cpu.waitOneInstructionAfterCli = cpu.getInterrupt() === true;
				cpu.setInterrupt(false);
				return cyclesTaken;
			};
			break;
		case 89:
			{
				// EOR ABSOLUTEY
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFFFF;
				if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 90:
			{
				// NOP NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				return cyclesTaken;
			};
			break;
		case 91:
			{
				// LSE ABSOLUTEY
				var cyclesTaken = 7;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x01) > 0);
				var result = operationModeData >> 1 & 0xFF;
				cpu.regA ^= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 92:
			{
				// SKW ABSOLUTEX
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				return cyclesTaken;
			};
			break;
		case 93:
			{
				// EOR ABSOLUTEX
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 94:
			{
				// LSR ABSOLUTEX
				var cyclesTaken = 7;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x01) > 0);
				var result = (operationModeData & 0xFF) >> 1;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 95:
			{
				// LSE ABSOLUTEX
				var cyclesTaken = 7;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				cpu.setCarry((operationModeData & 0x01) > 0);
				var result = operationModeData >> 1 & 0xFF;
				cpu.regA ^= result;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 96:
			{
				// RTS NONE
				var cyclesTaken = 6;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				// dummy read
				cpu.incrementSubcycle();
				memory.read8(cpu.getPC());
				cpu.incrementSubcycle();
				if (cpu.regS === 0xFF) {
					cpu.regS = 0;
				} else {
					cpu.regS++;
				}
				cpu.incrementSubcycle();
				cpu.programCounter = memory.read8(0x100 + cpu.regS);
				if (cpu.regS === 0xFF) {
					cpu.regS = 0;
				} else {
					cpu.regS++;
				}
				cpu.incrementSubcycle();
				var temp = memory.read8(0x100 + cpu.regS);
				cpu.programCounter |= (temp & 0xFF) << 8;
				cpu.incrementSubcycle();
				cpu.programCounter = cpu.getPC() + 1 & 0xFFFF;
				return cyclesTaken;
			};
			break;
		case 97:
			{
				// ADC INDIRECTX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				address = address + cpu.regX & 0xFF;
				var readInValue = cpu.read16FromMemWithWrap(address);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(temp > 0xFF);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
				cpu.regA = temp & 0xFF;
				return cyclesTaken;
			};
			break;
		case 98:
			{
				// HLT NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				var result = 0;
				console.log("illegal instruction HLT not implemented");
				return cyclesTaken;
			};
			break;
		case 99:
			{
				// RRA INDIRECTX
				var cyclesTaken = 8;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				address = address + cpu.regX & 0xFF;
				var readInValue = cpu.read16FromMemWithWrap(address);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
				cpu.setCarry((operationModeData & 0x1) > 0);
				var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(temp > 0xFF);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
				cpu.regA = temp & 0xFF;
				result &= 0xFF;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 100:
			{
				// SKB ZEROPAGE
				var cyclesTaken = 3;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				return cyclesTaken;
			};
			break;
		case 101:
			{
				// ADC ZEROPAGE
				var cyclesTaken = 3;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(temp > 0xFF);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
				cpu.regA = temp & 0xFF;
				return cyclesTaken;
			};
			break;
		case 102:
			{
				// ROR ZEROPAGE
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = (operationModeData & 0xFF) >> 1 | (cpu.getCarry() ? 0x80 : 0);
				cpu.setCarry(operationModeData & 0x1);
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 103:
			{
				// RRA ZEROPAGE
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
				cpu.setCarry((operationModeData & 0x1) > 0);
				var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(temp > 0xFF);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
				cpu.regA = temp & 0xFF;
				result &= 0xFF;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 104:
			{
				// PLA NONE
				var cyclesTaken = 4;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				if (cpu.regS === 0xFF) {
					cpu.regS = 0;
				} else {
					cpu.regS++;
				}
				cpu.incrementSubcycle();
				cpu.regA = memory.read8(0x100 + cpu.regS);
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 105:
			{
				// ADC IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				var temp = (readInValue & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(temp > 0xFF);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (readInValue ^ 0xFF)) & 0x80);
				cpu.regA = temp & 0xFF;
				return cyclesTaken;
			};
			break;
		case 106:
			{
				// ROR ACCUMULATOR
				var cyclesTaken = 2;
				var readInValue = cpu.regA;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				var result = (readInValue & 0xFF) >> 1 | (cpu.getCarry() ? 0x80 : 0);
				cpu.setCarry(readInValue & 0x1);
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.regA = result & 0xFF;
				return cyclesTaken;
			};
			break;
		case 107:
			{
				// ARR IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.regA &= readInValue & 0xFF;
				cpu.regA = cpu.regA >> 1 & 0xFF | (cpu.getCarry() ? 0x80 : 0);
				cpu.setCarry((cpu.regA & 0x1) > 0);
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				cpu.setOverflow(false);
				cpu.setCarry(false);
				switch (cpu.regA & 0x60) {
					case 0x20:
						cpu.setOverflow(true);break;
					case 0x40:
						cpu.setOverflow(true);
						cpu.setCarry(true);break;
					case 0x60:
						cpu.setCarry(true);break;
				}
				return cyclesTaken;
			};
			break;
		case 108:
			{
				// JMP INDIRECT
				var cyclesTaken = 5;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = cpu.read16FromMemWithWrap(address);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.setPC(readInValue & 0xFFFF);
				return cyclesTaken;
			};
			break;
		case 109:
			{
				// ADC ABSOLUTE
				var cyclesTaken = 4;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(temp > 0xFF);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
				cpu.regA = temp & 0xFF;
				return cyclesTaken;
			};
			break;
		case 110:
			{
				// ROR ABSOLUTE
				var cyclesTaken = 6;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = (operationModeData & 0xFF) >> 1 | (cpu.getCarry() ? 0x80 : 0);
				cpu.setCarry(operationModeData & 0x1);
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 111:
			{
				// RRA ABSOLUTE
				var cyclesTaken = 6;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
				cpu.setCarry((operationModeData & 0x1) > 0);
				var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(temp > 0xFF);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
				cpu.regA = temp & 0xFF;
				result &= 0xFF;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 112:
			{
				// BVS RELATIVE
				var cyclesTaken = 2;
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
				var branchTaken = cpu.getOverflow();
				if (branchTaken) {
					cpu.incrementSubcycle();
					if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
						cyclesTaken += 1;
						cpu.incrementSubcycle();
					}
					cyclesTaken += 1;
					cpu.incrementSubcycle();
					cpu.setPC(readInValue + 2 & 0xFFFF);
				} else {
					cpu.incrementSubcycle();
					memory.read8(cpu.getPC() + 1 & 0xFFFF);
					cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				}
				return cyclesTaken;
			};
			break;
		case 113:
			{
				// ADC INDIRECTY
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				address = cpu.read16FromMemWithWrap(address);
				var readInValue = address + cpu.regY & 0xFFFF;
				if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(temp > 0xFF);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
				cpu.regA = temp & 0xFF;
				return cyclesTaken;
			};
			break;
		case 114:
			{
				// HLT NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				var result = 0;
				console.log("illegal instruction HLT not implemented");
				return cyclesTaken;
			};
			break;
		case 115:
			{
				// RRA INDIRECTY
				var cyclesTaken = 8;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				address = cpu.read16FromMemWithWrap(address);
				var readInValue = address + cpu.regY & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
				cpu.setCarry((operationModeData & 0x1) > 0);
				var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(temp > 0xFF);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
				cpu.regA = temp & 0xFF;
				result &= 0xFF;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 116:
			{
				// SKB ZEROPAGEX
				var cyclesTaken = 4;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				return cyclesTaken;
			};
			break;
		case 117:
			{
				// ADC ZEROPAGEX
				var cyclesTaken = 4;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(temp > 0xFF);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
				cpu.regA = temp & 0xFF;
				return cyclesTaken;
			};
			break;
		case 118:
			{
				// ROR ZEROPAGEX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = (operationModeData & 0xFF) >> 1 | (cpu.getCarry() ? 0x80 : 0);
				cpu.setCarry(operationModeData & 0x1);
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 119:
			{
				// RRA ZEROPAGEX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
				cpu.setCarry((operationModeData & 0x1) > 0);
				var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(temp > 0xFF);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
				cpu.regA = temp & 0xFF;
				result &= 0xFF;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 120:
			{
				// SEI NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				cpu.setInterrupt(true);
				return cyclesTaken;
			};
			break;
		case 121:
			{
				// ADC ABSOLUTEY
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFFFF;
				if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(temp > 0xFF);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
				cpu.regA = temp & 0xFF;
				return cyclesTaken;
			};
			break;
		case 122:
			{
				// NOP NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				return cyclesTaken;
			};
			break;
		case 123:
			{
				// RRA ABSOLUTEY
				var cyclesTaken = 7;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
				cpu.setCarry((operationModeData & 0x1) > 0);
				var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(temp > 0xFF);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
				cpu.regA = temp & 0xFF;
				result &= 0xFF;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 124:
			{
				// SKW ABSOLUTEX
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				return cyclesTaken;
			};
			break;
		case 125:
			{
				// ADC ABSOLUTEX
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(temp > 0xFF);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
				cpu.regA = temp & 0xFF;
				return cyclesTaken;
			};
			break;
		case 126:
			{
				// ROR ABSOLUTEX
				var cyclesTaken = 7;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = (operationModeData & 0xFF) >> 1 | (cpu.getCarry() ? 0x80 : 0);
				cpu.setCarry(operationModeData & 0x1);
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 127:
			{
				// RRA ABSOLUTEX
				var cyclesTaken = 7;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
				cpu.setCarry((operationModeData & 0x1) > 0);
				var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
				cpu.setCarry(temp > 0xFF);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
				cpu.regA = temp & 0xFF;
				result &= 0xFF;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 128:
			{
				// SKB IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				return cyclesTaken;
			};
			break;
		case 129:
			{
				// STA INDIRECTX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				address = address + cpu.regX & 0xFF;
				var readInValue = cpu.read16FromMemWithWrap(address);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				var result = cpu.regA;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result);
				return cyclesTaken;
			};
			break;
		case 130:
			{
				// SKB IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				return cyclesTaken;
			};
			break;
		case 131:
			{
				// AXS INDIRECTX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				address = address + cpu.regX & 0xFF;
				var readInValue = cpu.read16FromMemWithWrap(address);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				var result = cpu.regA & cpu.regX;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result);
				return cyclesTaken;
			};
			break;
		case 132:
			{
				// STY ZEROPAGE
				var cyclesTaken = 3;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				var result = cpu.regY;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result);
				return cyclesTaken;
			};
			break;
		case 133:
			{
				// STA ZEROPAGE
				var cyclesTaken = 3;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				var result = cpu.regA;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result);
				return cyclesTaken;
			};
			break;
		case 134:
			{
				// STX ZEROPAGE
				var cyclesTaken = 3;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				var result = cpu.regX;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result);
				return cyclesTaken;
			};
			break;
		case 135:
			{
				// AXS ZEROPAGE
				var cyclesTaken = 3;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				var result = cpu.regA & cpu.regX;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result);
				return cyclesTaken;
			};
			break;
		case 136:
			{
				// DEY NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				cpu.regY--;
				if (cpu.regY < 0) cpu.regY = 0xFF;
				cpu.setSign((cpu.regY & 0x80) > 0);
				cpu.setZero((cpu.regY & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 137:
			{
				// SKB IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				return cyclesTaken;
			};
			break;
		case 138:
			{
				// TXA NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				cpu.regA = cpu.regX;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 139:
			{
				// XAA IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.regA = cpu.regX & readInValue;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 140:
			{
				// STY ABSOLUTE
				var cyclesTaken = 4;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				var result = cpu.regY;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result);
				return cyclesTaken;
			};
			break;
		case 141:
			{
				// STA ABSOLUTE
				var cyclesTaken = 4;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				var result = cpu.regA;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result);
				return cyclesTaken;
			};
			break;
		case 142:
			{
				// STX ABSOLUTE
				var cyclesTaken = 4;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				var result = cpu.regX;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result);
				return cyclesTaken;
			};
			break;
		case 143:
			{
				// AXS ABSOLUTE
				var cyclesTaken = 4;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				var result = cpu.regA & cpu.regX;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result);
				return cyclesTaken;
			};
			break;
		case 144:
			{
				// BCC RELATIVE
				var cyclesTaken = 2;
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
				var branchTaken = !cpu.getCarry();
				if (branchTaken) {
					cpu.incrementSubcycle();
					if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
						cyclesTaken += 1;
						cpu.incrementSubcycle();
					}
					cyclesTaken += 1;
					cpu.incrementSubcycle();
					cpu.setPC(readInValue + 2 & 0xFFFF);
				} else {
					cpu.incrementSubcycle();
					memory.read8(cpu.getPC() + 1 & 0xFFFF);
					cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				}
				return cyclesTaken;
			};
			break;
		case 145:
			{
				// STA INDIRECTY
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				address = cpu.read16FromMemWithWrap(address);
				var readInValue = address + cpu.regY & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				var result = cpu.regA;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result);
				return cyclesTaken;
			};
			break;
		case 146:
			{
				// HLT NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				var result = 0;
				console.log("illegal instruction HLT not implemented");
				return cyclesTaken;
			};
			break;
		case 147:
			{
				// AXA INDIRECTY
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				address = cpu.read16FromMemWithWrap(address);
				var readInValue = address + cpu.regY & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				var result = cpu.regX & cpu.regA & 0x7;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result);
				return cyclesTaken;
			};
			break;
		case 148:
			{
				// STY ZEROPAGEX
				var cyclesTaken = 4;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				var result = cpu.regY;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result);
				return cyclesTaken;
			};
			break;
		case 149:
			{
				// STA ZEROPAGEX
				var cyclesTaken = 4;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				var result = cpu.regA;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result);
				return cyclesTaken;
			};
			break;
		case 150:
			{
				// STX ZEROPAGEY
				var cyclesTaken = 4;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				var result = cpu.regX;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result);
				return cyclesTaken;
			};
			break;
		case 151:
			{
				// AXS ZEROPAGEY
				var cyclesTaken = 4;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				var result = cpu.regA & cpu.regX;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result);
				return cyclesTaken;
			};
			break;
		case 152:
			{
				// TYA NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				cpu.regA = cpu.regY;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 153:
			{
				// STA ABSOLUTEY
				var cyclesTaken = 5;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				var result = cpu.regA;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result);
				return cyclesTaken;
			};
			break;
		case 154:
			{
				// TXS NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				cpu.regS = cpu.regX;
				return cyclesTaken;
			};
			break;
		case 155:
			{
				// TAS ABSOLUTEY
				var cyclesTaken = 5;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.regS = cpu.regX & cpu.regA;
				return cyclesTaken;
			};
			break;
		case 156:
			{
				// SAY SAY
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.SAYHighByte = memory.read8(cpu.getPC() + 2 & 0xFFFF);
				address |= cpu.SAYHighByte << 8;
				var readInValue = address + cpu.regX & 0xFFFF; // SAY writes to absolute X but needs the high byte of the address to operate on
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = cpu.regY & (cpu.SAYHighByte + 1 & 0xFF);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 157:
			{
				// STA ABSOLUTEX
				var cyclesTaken = 5;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				var result = cpu.regA;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result);
				return cyclesTaken;
			};
			break;
		case 158:
			{
				// XAS ABSOLUTEY
				var cyclesTaken = 5;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				var result = 0;
				console.log("illegal instruction XAS not implemented");
				cpu.incrementSubcycle();
				memory.write8(readInValue, result);
				return cyclesTaken;
			};
			break;
		case 159:
			{
				// AXA ABSOLUTEY
				var cyclesTaken = 5;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = cpu.regX & cpu.regA & 0x7;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 160:
			{
				// LDY IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.regY = readInValue & 0xFF;
				cpu.setSign((cpu.regY & 0x80) > 0);
				cpu.setZero((cpu.regY & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 161:
			{
				// LDA INDIRECTX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				address = address + cpu.regX & 0xFF;
				var readInValue = cpu.read16FromMemWithWrap(address);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA = operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 162:
			{
				// LDX IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.regX = readInValue & 0xFF;
				cpu.setSign((cpu.regX & 0x80) > 0);
				cpu.setZero((cpu.regX & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 163:
			{
				// LAX INDIRECTX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				address = address + cpu.regX & 0xFF;
				var readInValue = cpu.read16FromMemWithWrap(address);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA = operationModeData;
				cpu.regX = operationModeData;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 164:
			{
				// LDY ZEROPAGE
				var cyclesTaken = 3;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regY = operationModeData & 0xFF;
				cpu.setSign((cpu.regY & 0x80) > 0);
				cpu.setZero((cpu.regY & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 165:
			{
				// LDA ZEROPAGE
				var cyclesTaken = 3;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA = operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 166:
			{
				// LDX ZEROPAGE
				var cyclesTaken = 3;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regX = operationModeData & 0xFF;
				cpu.setSign((cpu.regX & 0x80) > 0);
				cpu.setZero((cpu.regX & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 167:
			{
				// LAX ZEROPAGE
				var cyclesTaken = 3;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA = operationModeData;
				cpu.regX = operationModeData;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 168:
			{
				// TAY NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				cpu.regY = cpu.regA;
				cpu.setSign((cpu.regY & 0x80) > 0);
				cpu.setZero((cpu.regY & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 169:
			{
				// LDA IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.regA = readInValue & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 170:
			{
				// TAX NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				cpu.regX = cpu.regA;
				cpu.setSign((cpu.regX & 0x80) > 0);
				cpu.setZero((cpu.regX & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 171:
			{
				// OAL IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.regX = cpu.regA = readInValue & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 172:
			{
				// LDY ABSOLUTE
				var cyclesTaken = 4;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regY = operationModeData & 0xFF;
				cpu.setSign((cpu.regY & 0x80) > 0);
				cpu.setZero((cpu.regY & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 173:
			{
				// LDA ABSOLUTE
				var cyclesTaken = 4;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA = operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 174:
			{
				// LDX ABSOLUTE
				var cyclesTaken = 4;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regX = operationModeData & 0xFF;
				cpu.setSign((cpu.regX & 0x80) > 0);
				cpu.setZero((cpu.regX & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 175:
			{
				// LAX ABSOLUTE
				var cyclesTaken = 4;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA = operationModeData;
				cpu.regX = operationModeData;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 176:
			{
				// BCS RELATIVE
				var cyclesTaken = 2;
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
				var branchTaken = cpu.getCarry();
				if (branchTaken) {
					cpu.incrementSubcycle();
					if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
						cyclesTaken += 1;
						cpu.incrementSubcycle();
					}
					cyclesTaken += 1;
					cpu.incrementSubcycle();
					cpu.setPC(readInValue + 2 & 0xFFFF);
				} else {
					cpu.incrementSubcycle();
					memory.read8(cpu.getPC() + 1 & 0xFFFF);
					cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				}
				return cyclesTaken;
			};
			break;
		case 177:
			{
				// LDA INDIRECTY
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				address = cpu.read16FromMemWithWrap(address);
				var readInValue = address + cpu.regY & 0xFFFF;
				if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA = operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 178:
			{
				// HLT NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				var result = 0;
				console.log("illegal instruction HLT not implemented");
				return cyclesTaken;
			};
			break;
		case 179:
			{
				// LAX INDIRECTY
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				address = cpu.read16FromMemWithWrap(address);
				var readInValue = address + cpu.regY & 0xFFFF;
				if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA = operationModeData;
				cpu.regX = operationModeData;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 180:
			{
				// LDY ZEROPAGEX
				var cyclesTaken = 4;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regY = operationModeData & 0xFF;
				cpu.setSign((cpu.regY & 0x80) > 0);
				cpu.setZero((cpu.regY & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 181:
			{
				// LDA ZEROPAGEX
				var cyclesTaken = 4;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA = operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 182:
			{
				// LDX ZEROPAGEY
				var cyclesTaken = 4;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regX = operationModeData & 0xFF;
				cpu.setSign((cpu.regX & 0x80) > 0);
				cpu.setZero((cpu.regX & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 183:
			{
				// LAX ZEROPAGEY
				var cyclesTaken = 4;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA = operationModeData;
				cpu.regX = operationModeData;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 184:
			{
				// CLV NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				cpu.setOverflow(false);
				return cyclesTaken;
			};
			break;
		case 185:
			{
				// LDA ABSOLUTEY
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFFFF;
				if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA = operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 186:
			{
				// TSX NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				cpu.regX = cpu.regS & 0xFF;
				cpu.setSign((cpu.regX & 0x80) > 0);
				cpu.setZero((cpu.regX & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 187:
			{
				// LAS ABSOLUTEY
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFFFF;
				if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var result = 0;
				console.log("illegal instruction LAS not implemented");
				return cyclesTaken;
			};
			break;
		case 188:
			{
				// LDY ABSOLUTEX
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regY = operationModeData & 0xFF;
				cpu.setSign((cpu.regY & 0x80) > 0);
				cpu.setZero((cpu.regY & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 189:
			{
				// LDA ABSOLUTEX
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA = operationModeData & 0xFF;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 190:
			{
				// LDX ABSOLUTEY
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFFFF;
				if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regX = operationModeData & 0xFF;
				cpu.setSign((cpu.regX & 0x80) > 0);
				cpu.setZero((cpu.regX & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 191:
			{
				// LAX ABSOLUTEY
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFFFF;
				if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.regA = operationModeData;
				cpu.regX = operationModeData;
				cpu.setSign((cpu.regA & 0x80) > 0);
				cpu.setZero((cpu.regA & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 192:
			{
				// CPY IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				var temp = cpu.regY - readInValue; // purposely not wrapped
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 193:
			{
				// CMP INDIRECTX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				address = address + cpu.regX & 0xFF;
				var readInValue = cpu.read16FromMemWithWrap(address);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = cpu.regA - operationModeData;
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 194:
			{
				// SKB IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				return cyclesTaken;
			};
			break;
		case 195:
			{
				// DCM INDIRECTX
				var cyclesTaken = 8;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				address = address + cpu.regX & 0xFF;
				var readInValue = cpu.read16FromMemWithWrap(address);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData - 1;
				if (result < 0) result = 0xFF;
				var temp = cpu.regA - result;
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 196:
			{
				// CPY ZEROPAGE
				var cyclesTaken = 3;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = cpu.regY - operationModeData; // purposely not wrapped
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 197:
			{
				// CMP ZEROPAGE
				var cyclesTaken = 3;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = cpu.regA - operationModeData;
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 198:
			{
				// DEC ZEROPAGE
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData - 1;
				if (result < 0) result = 0xFF;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 199:
			{
				// DCM ZEROPAGE
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData - 1;
				if (result < 0) result = 0xFF;
				var temp = cpu.regA - result;
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 200:
			{
				// INY NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				cpu.regY++;
				if (cpu.regY > 0xFF) cpu.regY = 0;
				cpu.setSign((cpu.regY & 0x80) > 0);
				cpu.setZero((cpu.regY & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 201:
			{
				// CMP IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				var temp = cpu.regA - readInValue;
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 202:
			{
				// DEX NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				cpu.regX--;
				if (cpu.regX < 0) cpu.regX = 0xFF;
				cpu.setSign((cpu.regX & 0x80) > 0);
				cpu.setZero((cpu.regX & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 203:
			{
				// SAX IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				var temp = (cpu.regA & cpu.regX) - readInValue;
				cpu.regX = temp & 0xFF;
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 204:
			{
				// CPY ABSOLUTE
				var cyclesTaken = 4;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = cpu.regY - operationModeData; // purposely not wrapped
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 205:
			{
				// CMP ABSOLUTE
				var cyclesTaken = 4;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = cpu.regA - operationModeData;
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 206:
			{
				// DEC ABSOLUTE
				var cyclesTaken = 6;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData - 1;
				if (result < 0) result = 0xFF;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 207:
			{
				// DCM ABSOLUTE
				var cyclesTaken = 6;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData - 1;
				if (result < 0) result = 0xFF;
				var temp = cpu.regA - result;
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 208:
			{
				// BNE RELATIVE
				var cyclesTaken = 2;
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
				var branchTaken = !cpu.getZero();
				if (branchTaken) {
					cpu.incrementSubcycle();
					if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
						cyclesTaken += 1;
						cpu.incrementSubcycle();
					}
					cyclesTaken += 1;
					cpu.incrementSubcycle();
					cpu.setPC(readInValue + 2 & 0xFFFF);
				} else {
					cpu.incrementSubcycle();
					memory.read8(cpu.getPC() + 1 & 0xFFFF);
					cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				}
				return cyclesTaken;
			};
			break;
		case 209:
			{
				// CMP INDIRECTY
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				address = cpu.read16FromMemWithWrap(address);
				var readInValue = address + cpu.regY & 0xFFFF;
				if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = cpu.regA - operationModeData;
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 210:
			{
				// HLT NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				var result = 0;
				console.log("illegal instruction HLT not implemented");
				return cyclesTaken;
			};
			break;
		case 211:
			{
				// DCM INDIRECTY
				var cyclesTaken = 8;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				address = cpu.read16FromMemWithWrap(address);
				var readInValue = address + cpu.regY & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData - 1;
				if (result < 0) result = 0xFF;
				var temp = cpu.regA - result;
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 212:
			{
				// SKB ZEROPAGEX
				var cyclesTaken = 4;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				return cyclesTaken;
			};
			break;
		case 213:
			{
				// CMP ZEROPAGEX
				var cyclesTaken = 4;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = cpu.regA - operationModeData;
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 214:
			{
				// DEC ZEROPAGEX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData - 1;
				if (result < 0) result = 0xFF;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 215:
			{
				// DCM ZEROPAGEX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData - 1;
				if (result < 0) result = 0xFF;
				var temp = cpu.regA - result;
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 216:
			{
				// CLD NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				cpu.setDecimal(false);
				return cyclesTaken;
			};
			break;
		case 217:
			{
				// CMP ABSOLUTEY
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFFFF;
				if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = cpu.regA - operationModeData;
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 218:
			{
				// NOP NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				return cyclesTaken;
			};
			break;
		case 219:
			{
				// DCM ABSOLUTEY
				var cyclesTaken = 7;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData - 1;
				if (result < 0) result = 0xFF;
				var temp = cpu.regA - result;
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 220:
			{
				// SKW ABSOLUTEX
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				return cyclesTaken;
			};
			break;
		case 221:
			{
				// CMP ABSOLUTEX
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = cpu.regA - operationModeData;
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 222:
			{
				// DEC ABSOLUTEX
				var cyclesTaken = 7;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData - 1;
				if (result < 0) result = 0xFF;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 223:
			{
				// DCM ABSOLUTEX
				var cyclesTaken = 7;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData - 1;
				if (result < 0) result = 0xFF;
				var temp = cpu.regA - result;
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 224:
			{
				// CPX IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				var temp = cpu.regX - readInValue; // purposely not wrapped
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 225:
			{
				// SBC INDIRECTX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				address = address + cpu.regX & 0xFF;
				var readInValue = cpu.read16FromMemWithWrap(address);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.regA = temp & 0xFF;
				return cyclesTaken;
			};
			break;
		case 226:
			{
				// SKB IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				return cyclesTaken;
			};
			break;
		case 227:
			{
				// INS INDIRECTX
				var cyclesTaken = 8;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				address = address + cpu.regX & 0xFF;
				var readInValue = cpu.read16FromMemWithWrap(address);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData + 1;
				if (result > 0xFF) result = 0;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.regA = temp & 0xFF;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 228:
			{
				// CPX ZEROPAGE
				var cyclesTaken = 3;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = cpu.regX - operationModeData; // purposely not wrapped
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 229:
			{
				// SBC ZEROPAGE
				var cyclesTaken = 3;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.regA = temp & 0xFF;
				return cyclesTaken;
			};
			break;
		case 230:
			{
				// INC ZEROPAGE
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData + 1;
				if (result > 0xFF) result = 0;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 231:
			{
				// INS ZEROPAGE
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData + 1;
				if (result > 0xFF) result = 0;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.regA = temp & 0xFF;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 232:
			{
				// INX NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				cpu.regX++;
				if (cpu.regX > 0xFF) cpu.regX = 0;
				cpu.setSign((cpu.regX & 0x80) > 0);
				cpu.setZero((cpu.regX & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 233:
			{
				// SBC IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				var temp = cpu.regA - readInValue - (cpu.getCarry() ? 0 : 1);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ readInValue) & 0x80);
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.regA = temp & 0xFF;
				return cyclesTaken;
			};
			break;
		case 234:
			{
				// NOP NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				return cyclesTaken;
			};
			break;
		case 235:
			{
				// SBC IMMEDIATE
				var cyclesTaken = 2;
				cpu.incrementSubcycle();
				var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				var temp = cpu.regA - readInValue - (cpu.getCarry() ? 0 : 1);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ readInValue) & 0x80);
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.regA = temp & 0xFF;
				return cyclesTaken;
			};
			break;
		case 236:
			{
				// CPX ABSOLUTE
				var cyclesTaken = 4;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = cpu.regX - operationModeData; // purposely not wrapped
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				return cyclesTaken;
			};
			break;
		case 237:
			{
				// SBC ABSOLUTE
				var cyclesTaken = 4;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.regA = temp & 0xFF;
				return cyclesTaken;
			};
			break;
		case 238:
			{
				// INC ABSOLUTE
				var cyclesTaken = 6;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData + 1;
				if (result > 0xFF) result = 0;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 239:
			{
				// INS ABSOLUTE
				var cyclesTaken = 6;
				var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData + 1;
				if (result > 0xFF) result = 0;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.regA = temp & 0xFF;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 240:
			{
				// BEQ RELATIVE
				var cyclesTaken = 2;
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
				var branchTaken = cpu.getZero();
				if (branchTaken) {
					cpu.incrementSubcycle();
					if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
						cyclesTaken += 1;
						cpu.incrementSubcycle();
					}
					cyclesTaken += 1;
					cpu.incrementSubcycle();
					cpu.setPC(readInValue + 2 & 0xFFFF);
				} else {
					cpu.incrementSubcycle();
					memory.read8(cpu.getPC() + 1 & 0xFFFF);
					cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				}
				return cyclesTaken;
			};
			break;
		case 241:
			{
				// SBC INDIRECTY
				var cyclesTaken = 5;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				address = cpu.read16FromMemWithWrap(address);
				var readInValue = address + cpu.regY & 0xFFFF;
				if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.regA = temp & 0xFF;
				return cyclesTaken;
			};
			break;
		case 242:
			{
				// HLT NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				var result = 0;
				console.log("illegal instruction HLT not implemented");
				return cyclesTaken;
			};
			break;
		case 243:
			{
				// INS INDIRECTY
				var cyclesTaken = 8;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				address = cpu.read16FromMemWithWrap(address);
				var readInValue = address + cpu.regY & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData + 1;
				if (result > 0xFF) result = 0;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.regA = temp & 0xFF;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 244:
			{
				// SKB ZEROPAGEX
				var cyclesTaken = 4;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				return cyclesTaken;
			};
			break;
		case 245:
			{
				// SBC ZEROPAGEX
				var cyclesTaken = 4;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.regA = temp & 0xFF;
				return cyclesTaken;
			};
			break;
		case 246:
			{
				// INC ZEROPAGEX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData + 1;
				if (result > 0xFF) result = 0;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 247:
			{
				// INS ZEROPAGEX
				var cyclesTaken = 6;
				cpu.incrementSubcycle();
				var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData + 1;
				if (result > 0xFF) result = 0;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.regA = temp & 0xFF;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 248:
			{
				// SED NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				cpu.setDecimal(true);
				return cyclesTaken;
			};
			break;
		case 249:
			{
				// SBC ABSOLUTEY
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFFFF;
				if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.regA = temp & 0xFF;
				return cyclesTaken;
			};
			break;
		case 250:
			{
				// NOP NONE
				var cyclesTaken = 2;
				cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
				cpu.incrementSubcycle();
				return cyclesTaken;
			};
			break;
		case 251:
			{
				// INS ABSOLUTEY
				var cyclesTaken = 7;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regY & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData + 1;
				if (result > 0xFF) result = 0;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.regA = temp & 0xFF;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 252:
			{
				// SKW ABSOLUTEX
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				return cyclesTaken;
			};
			break;
		case 253:
			{
				// SBC ABSOLUTEX
				var cyclesTaken = 4;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
					// Only do dummy read if page boundary crossed
					cyclesTaken++;
					cpu.incrementSubcycle();
					memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				}
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.regA = temp & 0xFF;
				return cyclesTaken;
			};
			break;
		case 254:
			{
				// INC ABSOLUTEX
				var cyclesTaken = 7;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData + 1;
				if (result > 0xFF) result = 0;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
		case 255:
			{
				// INS ABSOLUTEX
				var cyclesTaken = 7;
				var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
				var readInValue = address + cpu.regX & 0xFFFF;
				cpu.incrementSubcycle();
				memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
				cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
				cpu.incrementSubcycle();
				var operationModeData = memory.read8(readInValue);
				cpu.incrementSubcycle();
				memory.write8(readInValue, operationModeData);
				var result = operationModeData + 1;
				if (result > 0xFF) result = 0;
				cpu.setSign((result & 0x80) > 0);
				cpu.setZero((result & 0xFF) === 0);
				var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
				cpu.setSign((temp & 0x80) > 0);
				cpu.setZero((temp & 0xFF) === 0);
				cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
				cpu.setCarry(temp >= 0 && temp < 0x100);
				cpu.regA = temp & 0xFF;
				cpu.incrementSubcycle();
				memory.write8(readInValue, result & 0xFF);
				return cyclesTaken;
			};
			break;
	};
}