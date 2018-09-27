/******************************************************************************
*
* NXP Semiconductors
* Copyright (c) 2016 NXP Semiconductors
* ALL RIGHTS RESERVED.
*
***************************************************************************/

/***************************************************************************
* Static initial Peripheral settings will go here
*
***************************************************************************/

//#define IRQ_OFF_1CC_FCN         TIMchan0_ISR
//#define IRQ_OFF_1C0_FCN         TIMchan3_ISR
//#define IRQ_OFF_CC_FCN          PMFreloadA_ISR

#define IRQ_OFF_18C_FCN         ADC0error_ISR
//#define IRQ_OFF_188_FCN         ADC0abort_ISR
#define IRQ_OFF_184_FCN         ADC0done_ISR

#define IRQ_OFF_11C_FCN         ADC1error_ISR			// not used
//#define IRQ_OFF_118_FCN         ADC1abort_ISR
#define IRQ_OFF_114_FCN         ADC1done_ISR

#define IRQ_OFF_D0_FCN          PMFreloadA_ISR			// not used
//#define IRQ_OFF_C4_FCN          PMFfault_ISR			// not used
//#define IRQ_OFF_C0_FCN          PMFreloadoverrun_ISR	// not used

//#define IRQ_OFF_19C_FCN         SCI0_INT            // LIN driver
//#define IRQ_OFF_19C_FCN         SCI0_ISR
//#define IRQ_OFF_198_FCN         SCI1_ISR

//#define IRQ_OFF_E4_FCN          PTUTrigger0Done_ISR		// not used
//#define IRQ_OFF_E0_FCN          PTUTrigger1Done_ISR		// not used


#define STRINGIFY(a) #a

#ifdef __CSMC__
	#define INTERRUPT @interrupt
	#define PR_SECTION(sec_name) \#pragma section {## sec_name}
	#define PR_CONST_SECTION(sec_name) \#pragma section const {## sec_name}
	#define DEFAULT_SEC

	#define EnableInterrupts   _asm("andcc #$EF")
	#define DisableInterrupts  _asm("orcc #$10")
	#define ASMNOP			   _asm(" nop ")
	#define STARTUP_FCN		   _stext
#elif __CWCC__
	#define INTERRUPT interrupt
	#define PR_SECTION(sec_name) Pragma__(STRINGIFY(DATA_SEG  sec_name##))
	#define PR_CONST_SECTION(sec_name) Pragma__(STRINGIFY(CONST_SEG  sec_name##))
	#define Pragma__(stringy) _Pragma(stringy)
	#define DEFAULT_SEC DEFAULT

	#define EnableInterrupts   {__asm(CLI);}
	#define DisableInterrupts  {__asm(SEI);}
	#define ASMNOP			   {__asm(NOP);}
	#define STARTUP_FCN		   _Startup
#else
	#error : Not Supported compiler
#endif
