/******************************************************************************
*
* Copyright 2006-2015 Freescale Semiconductor, Inc.
* Copyright 2016-2017 NXP
*
******************************************************************************/
/*!
*
* @file     ptu.c
*
* @date     JUL-10-2012
*
* @brief    ptu - Programmable trigger unit of S12ZVM
*
*******************************************************************************
*
* This file includes initial setting and MACRO definitions of S12ZVM ptu
* peripheral module.
*
******************************************************************************/
#include "ptu.h"

/******************************************************************************
* Global ptu variables definition
******************************************************************************/
/****************************************************************************
 *  Trigger event list
 *
 *  +-------------------+ - (int)PTUTriggerEventList)
 *  +===================+ - Trigger 0 space
 *  +*******************+ - List 0 Offset from PTUTriggerEventList = 0 = (int)&PTUTriggerEventList[0][0][0] - (int)PTUTriggerEventList
 *  | DelayT0           |
 *  +-------------------+
 *  | DelayT1           |
 *  +-------------------+
 *  | 0x0000            | - End of delay List 0
 *  +*******************+ - List 1 Offset from PTUTriggerEventList = 3 = (int)&PTUTriggerEventList[0][1][0] - (int)PTUTriggerEventList
 *  | DelayT0           |
 *  +-------------------+
 *  | DelayT1           |
 *  +-------------------+
 *  | DelayT2           |
 *  +-------------------+
 *  | 0x0000            | - End of delay List 1
 *  +===================+ - Trigger 1 space
 *  +*******************+ - List 0 Offset from PTUTriggerEventList = 8 = (int)&PTUTriggerEventList[1][0][0] - (int)PTUTriggerEventList
 *  | DelayT0           |
 *  +-------------------+
 *  | DelayT1           |
 *  +-------------------+
 *  | 0x0000            | - End of delay List 0
 *  +*******************+ - List 1 Offset from PTUTriggerEventList = 12 = (int)&PTUTriggerEventList[1][1][0] - (int)PTUTriggerEventList
 *  | DelayT0           |
 *  +-------------------+
 *  | DelayT1           |
 *  +-------------------+
 *  | DelayT2           |
 *  +-------------------+
 *  | 0x0000            | - End of delay List 1
 *  +===================+
 *
 *
 ***************************************************************************/

PR_SECTION(ptuTrigE)
volatile short ptuTriggerList0[PTU_LISTS_NO][PTU_COMMANDS] =  {{125,250,375,500,0x0000},{200,400,600,800,0x0000}}; // !_! for 50 MHz bus clock
volatile short ptuTriggerList1[PTU_LISTS_NO][PTU_COMMANDS] =  {{150,300,500,0x0000,0x0000},{150,300,500,0x0000,0x0000}};
 PR_SECTION(DEFAULT_SEC)
/******************************************************************************
* ptu MACRO definitions
******************************************************************************/


/******************************************************************************
* ptu registers bit definition
******************************************************************************/


/******************************************************************************
* Functions Definitions
*******************************************************************************/
void ptu_init()
{
	PTUPTR = ptuTriggerList0;
	
	TG0L1IDX = (unsigned char)(((long)&ptuTriggerList0[1][0] - (long)ptuTriggerList0) >> 1);
	TG1L0IDX = (unsigned char)(((long)&ptuTriggerList1[0][0] - (long)ptuTriggerList0) >> 1);
	TG1L1IDX = (unsigned char)(((long)&ptuTriggerList1[0][0] - (long)ptuTriggerList0) >> 1); // same as TG1L0IDX

	PTUE_TG0EN = 1;       // Enable Trigger Generation 0
	PTUE_TG1EN = 1;       // Enable Trigger Generation 1
	PTUDEBUG_PTUREPE = 1; // Enable Reload generation to PIN
	PTUDEBUG_PTUT0PE = 1; // Enable T0 trigger to PIN
	PTUDEBUG_PTUT1PE = 1; // Enable T0 trigger to PIN
	PTUC_PTULDOK = 1;     // Switch list when next reload event
}
 
unsigned char GetPTU_Errors()
{
	return(PTUIFL & 0b11101110);
}

unsigned char ClearPTU_Errors()
{
	unsigned char retVal = 1;
	PTUIFL = PTUIFL;
	
	if(PTUIFL != 0)
		retVal = 0;
		
	return(retVal);
}
