/******************************************************************************
*
* Copyright 2006-2015 Freescale Semiconductor, Inc.
* Copyright 2016-2017 NXP
*
******************************************************************************/
/*!
*
* @file     cpmu.c
*
* @date     JUL-10-2012
*
* @brief    cpmu - Clock, Reset and Power Management Unit of S12ZVM
*
*******************************************************************************
*
* This file includes initial setting and MACRO definitions of S12ZVM cpmu
* peripheral module.
*
******************************************************************************/

#include "cpmu.h"

/******************************************************************************
* Global cpmu variables definition
******************************************************************************/


/******************************************************************************
* cpmu MACRO definitions
******************************************************************************/
 #define _INTERNAL_CLOCK						// 1 MHz internal clock is used
// Internal clock 1MHz, 100/50 MHz CPU/Bus clock, 8.33 MHz ADC clock
 #define	CPMU_REFDIV		0
 #define	CPMU_SYNDIV		49
 #define	CPMU_POSTDIV	0
 #define	CPMU_REFFRQ		0
 #define	CPMU_VCOFRQ		3
// Internal clock 1MHz, 25/12.5 MHz CPU/Bus clock, 6.25 MHz ADC clock
//#define	CPMU_REFDIV		0
//#define	CPMU_SYNDIV		24
//#define	CPMU_POSTDIV	1
//#define	CPMU_REFFRQ		0
//#define	CPMU_VCOFRQ		1
/******************************************************************************
* cpmu registers bit definition
******************************************************************************/


/******************************************************************************
* Functions Definitions
*******************************************************************************/
void cpmu_init(void)
{
	// Wait for stable supply after power up
	while (GDUF_GLVLSF)
		GDUF_GLVLSF = 1;

	CPMUREFDIV_REFDIV = CPMU_REFDIV;
	CPMUREFDIV_REFFRQ = CPMU_REFFRQ;
	CPMUSYNR_SYNDIV = CPMU_SYNDIV;
	CPMUSYNR_VCOFRQ = CPMU_VCOFRQ;
	CPMUPOSTDIV_POSTDIV = CPMU_POSTDIV;

//#ifdef _EXTERNAL_CLOCK
	//CPMUOSC_OSCE = 1;
	//while (CPMUIFLG_UPOSC == 0) {}; // Wait for oscillator to start up (UPOSC=1) and PLL to lock (LOCK=1)
//#endif

	while (CPMUIFLG_LOCK == 0) {};
	CPMURFLG = 0x60; 	//Clear PORF and LVRF
}
