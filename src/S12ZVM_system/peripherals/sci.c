/******************************************************************************
*
* Copyright 2006-2015 Freescale Semiconductor, Inc.
* Copyright 2016-2017 NXP
*
******************************************************************************/
/*!
*
* @file     sci.c
*
* @date     JUL-10-2012
*
* @brief    sci - Serial Communication Interface of S12ZVM
*
*******************************************************************************
*
* This file includes initial setting and MACRO definitions of S12ZVM sci
* peripheral module.
*
******************************************************************************/
#include "sci.h"

/******************************************************************************
* Global sci variables definition
******************************************************************************/


/******************************************************************************
* sci MACRO definitions
******************************************************************************/


/******************************************************************************
* sci registers bit definition
******************************************************************************/


/******************************************************************************
* Functions Definitions
*******************************************************************************/
void sci0_init(void)
{
  SCI0BD = 2604;
  SCI0CR2_TE = 1;
  SCI0CR2_RE = 1;
}

void sci1_init(void)
{
  SCI1BD = 2604;//2604
  SCI1CR2_TE = 1;
  SCI1CR2_RE = 1;
}
