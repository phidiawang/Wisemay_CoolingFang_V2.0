/******************************************************************************
*
* Copyright 2006-2015 Freescale Semiconductor, Inc.
* Copyright 2016-2017 NXP
*
******************************************************************************/
/*!
*
* @file     ptu.h
*
* @date     JUL-10-2012
*
* @brief    ptu - Programmable Trigger Unit of S12ZVM
*
*******************************************************************************
*
* This file includes initial setting and MACRO definitions of S12ZVM ptu
* peripheral module.
*
******************************************************************************/

#ifndef PTU_H_
#define PTU_H_

#include "mc9s12zvml32.h"
#include "S12ZVM_devconfig.h"

/******************************************************************************
* ptu MACRO definitions
******************************************************************************/

#define PTU_TRIGGERs_GEN_NO         2
#define PTU_LISTS_NO                2
#define PTU_COMMANDS				5

/******************************************************************************
* Global ptu variables definition
******************************************************************************/
PR_SECTION(ptuTrigE)
	extern volatile short ptuTriggerList0[PTU_LISTS_NO][PTU_COMMANDS];
  	extern volatile short ptuTriggerList1[PTU_LISTS_NO][PTU_COMMANDS];
PR_SECTION(DEFAULT_SEC)

/******************************************************************************
* ptu registers bit definition
******************************************************************************/


/******************************************************************************
* Exported functions
*******************************************************************************/
extern void ptu_init(void);
extern unsigned char GetPTU_Errors();
extern unsigned char ClearPTU_Errors();


#endif /* PTU_H_ */
