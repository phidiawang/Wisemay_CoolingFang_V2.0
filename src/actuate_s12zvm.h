/******************************************************************************
*
* Copyright 2006-2015 Freescale Semiconductor, Inc.
* Copyright 2016-2017 NXP
*
******************************************************************************/
/*!
*
* @file     actuate_s12zvm.h
*
* @date     Nov-15-2013
*
* @brief    Header file for actuator module
*
*******************************************************************************
*
*
******************************************************************************/
#ifndef _ACTUATE_S12ZVM_H_
#define _ACTUATE_S12ZVM_H_

#include "mc9s12zvml32.h"
#include "gflib.h"
#include "gmclib.h"
#include "gdflib.h"

/******************************************************************************
| Defines and macros            (scope: module-local)
-----------------------------------------------------------------------------*/

/******************************************************************************
| Typedefs and structures       (scope: module-local)
-----------------------------------------------------------------------------*/

/******************************************************************************
| Exported Variables
-----------------------------------------------------------------------------*/

/******************************************************************************
| Exported function prototypes
-----------------------------------------------------------------------------*/
extern void 	EnableOutput(void);
extern void 	DisableOutput(void);
extern void 	SetDutycycle(SWLIBS_3Syst_F16 *f16pwm, tU16 sector);
unsigned short 	GetDriverError(void);
tBool 			ClearDriverError(void);

/******************************************************************************
| Inline functions
-----------------------------------------------------------------------------*/

#endif /* _ACTUATES_S12ZVM_H_ */
