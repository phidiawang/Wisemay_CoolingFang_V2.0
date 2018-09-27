/******************************************************************************
*
* Copyright 2006-2015 Freescale Semiconductor, Inc.
* Copyright 2016-2017 NXP
*
******************************************************************************/
/*!
*
* @file     gdu.c
*
* @date     JUL-10-2012
*
* @brief    gdu - GDU peripheral of S12ZVM
*
*******************************************************************************
*
* This file includes initial setting and MACRO definitions of S12ZVM gdu
* peripheral module.
*
******************************************************************************/

#include "gdu.h"
/******************************************************************************
* Global gdu variables definition
******************************************************************************/


/******************************************************************************
* gdu MACRO definitions
******************************************************************************/


/******************************************************************************
* gdu registers bit definition
******************************************************************************/


/******************************************************************************
* Functions Definitions
*******************************************************************************/

/*void gdu_init(void)
{
	//  GDUE_EPRES = 1; // enable preserve functionality ??
	  GDUE_GCPE = 1; // charge pump

	  GDUE_GCSE0 = 1; // enable Current Sense Amplifier 0
	  GDUE_GCSE1 = 1; // enable Current Sense Amplifier 1

	  GDUF = 0xff;	// Flag Register - clear High & Low Voltage Supply flags

	  GDUCLK2_GCPCD = 4;  // Fbus / 64 !_! for bus clock 50Mhz

	  GDUCTR = 0x13;	// blanking time ! ! 0x0f
	  GDUCTR_GHHDLVL = 1; // 26 V overvoltage
	  
	  GDUDSLVL = 0x77;	// desat. level !-! previous 0x44

	  GDUDSE = 0x77;	// Clear Desaturation Error Flags
}*/


 void gdu_init(void)
{
	//  GDUE_EPRES = 1; // enable preserve functionality ??
	  GDUE_GCPE = 1; // charge pump

	  GDUE_GCSE0 = 1; // enable Current Sense Amplifier 0
	  GDUE_GCSE1 = 1; // enable Current Sense Amplifier 1
	  
	  GDUOC0_GOCA0 = 1; // switch off all MOSFETs on overcurrent
	  GDUOC0_GOCE0 = 1;	// Overcurrent comparator enabled
	  GDUOC0_GOCT0 = 12; // Overcurrent threshold = ((48 + 0) / 64) * VDDA = 3.75 V
	  // 3.75 V represents 

	  GDUF = 0xff;	// Flag Register - clear High & Low Voltage Supply flags

	  GDUCLK2_GCPCD = 4;  // Fbus / 64 !_! for bus clock 50Mhz

	  GDUCTR = 0x13;	// blanking time ! ! 0x0f
	  GDUCTR_GHHDLVL = 1; // 26 V overvoltage
	  
	  GDUDSLVL = 0xFF;//0x77;	// desat. level !-! previous 0x44

	  GDUDSE = 0x77;	// Clear Desaturation Error Flags
}


