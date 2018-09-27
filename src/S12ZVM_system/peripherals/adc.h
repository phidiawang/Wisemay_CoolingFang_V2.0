/******************************************************************************
*
* Copyright 2006-2015 Freescale Semiconductor, Inc.
* Copyright 2016-2017 NXP
*
******************************************************************************/
/*!
*
* @file     adc.h
*
* @date     JUL-10-2012
*
* @brief    adc - ADC peripheral of S12ZVM
*
*******************************************************************************
*
* This file includes initial setting and MACRO definitions of S12ZVM adc
* peripheral module.
*
******************************************************************************/

#ifndef ADC_H_
#define ADC_H_

#include "mc9s12zvml32.h"
#include "S12ZVM_devconfig.h"

/******************************************************************************
* adc MACRO definitions
******************************************************************************/
#define COMMAND_NO 			8
#define COMMAND_LENGTH		4
#define RESULT_NO			8

/******************************************************************************
* Global adc variables definition
******************************************************************************/
PR_SECTION(adcLists)
extern volatile char ADC0CommandList[COMMAND_NO][COMMAND_LENGTH];
extern volatile char ADC1CommandList[COMMAND_NO][COMMAND_LENGTH];

extern volatile unsigned short ADC0ResultList[2][RESULT_NO];
extern volatile unsigned short ADC1ResultList[2][RESULT_NO];
PR_SECTION(DEFAULT_SEC)

/******************************************************************************
* adc registers bit definition
******************************************************************************/


/******************************************************************************
* Exported functions
*******************************************************************************/
extern void adc0_init(void);
extern void adc1_init(void);
#endif /* ADC_H_ */
