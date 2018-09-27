/******************************************************************************
*
* Copyright 2006-2015 Freescale Semiconductor, Inc.
* Copyright 2016-2017 NXP
*
******************************************************************************/
/*!
*
* @file     pmf.c
*
* @date     JUL-10-2012
*
* @brief    pmf - Pulse Width Modulator with Fault Protection of S12ZVM
*
*******************************************************************************
*
* This file includes initial setting and MACRO definitions of S12ZVM pmf
* peripheral module.
*
******************************************************************************/

#include "pmf.h"

/******************************************************************************
* Global pmf variables definition
******************************************************************************/



/******************************************************************************
* pmf MACRO definitions
******************************************************************************/


/******************************************************************************
* pmf registers bit definition
******************************************************************************/


/******************************************************************************
* Functions Definitions
*******************************************************************************/
/*void pmf_init(void)
{
	  PMFCFG2_REV0 = 1;   		// 01 PWM generator A generates reload event.
	  PMFCFG2_REV1 = 0;

	  PMFMODA = 2500; //2500      	// pwm frequency to be 20 kHz
	  PMFDTMA = 20;         	// dead time of pmf to be 0.20 us

	  PMFVAL0 = PMFMODA >> 1;	// set the output duty to be 50%
	  PMFVAL2 = PMFMODA >> 1;
	  PMFVAL4 = PMFMODA >> 1;

	  PMFENCA_LDOKA = 1;		// apply PMF Modulo value

	  PMFICCTL_PECx = 0x7;		// Enable Double Switching
	  PMFCINV		= 0x15;
	  
	  PMFCFG2_MSK  = 0x3F;		// Disable PWM at the output
	  
	  PMFENCA_PWMENA = 1;		// Enable PWM

	  PMFENCA_PWMRIEA = 1;		// Reload Interrupt - Used for sampling period generation

	  PMFENCA_GLDOKA = 1;       // 0 = Local LDOKA controls buffered registers / 1 = external Load OK controls buffered registers
	  PMFFQCA_LDFQA = 1;        // Reload every PWM, fcore / 1
}*/
void pmf_init(void)
{
	  PMFCFG2_REV0 = 1;   		// 01 PWM generator A generates reload event.
	  PMFCFG2_REV1 = 0;

	  PMFMODA = 2500;       	// pwm frequency to be 20 kHz
	  PMFDTMA = 20;         	// dead time of pmf to be 0.20 us

	  PMFVAL0 = PMFMODA >> 1;	// set the output duty to be 50%
	  PMFVAL2 = PMFMODA >> 1;
	  PMFVAL4 = PMFMODA >> 1;

	  PMFENCA_LDOKA = 1;		// apply PMF Modulo value

	  PMFICCTL_PECx = 0x7;		// Enable Double Switching
	  PMFCINV		= 0x15;
	  
	  PMFCFG2_MSK  = 0x3F;		// Disable PWM at the output
	  
	  PMFENCA_PWMENA = 1;		// Enable PWM

	  PMFENCA_PWMRIEA = 1;		// Reload Interrupt - Used for sampling period generation

	  PMFENCA_GLDOKA = 1;       // 0 = Local LDOKA controls buffered registers / 1 = external Load OK controls buffered registers
	  PMFFQCA_LDFQA = 1;        // Reload every PWM, fcore / 1
}
unsigned char GetPMF_Faults()
{
	return PMFFIF;
}

unsigned char ClearPMF_Faults()
{
	unsigned char retVal = 1;
	PMFFIF = PMFFIF;
	if(PMFFIF != 0)
		retVal = 0;
		
	return(retVal);
}


