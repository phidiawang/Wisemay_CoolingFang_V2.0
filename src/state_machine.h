/******************************************************************************
*
* Copyright 2006-2015 Freescale Semiconductor, Inc.
* Copyright 2016-2017 NXP
*
***************************************************************************/
/*!
*
* @file      state_machine.h
*
* @date      May-11-2017
* 
* @brief     Header file for StateMachineFrame "c" project
*
*******************************************************************************
*
******************************************************************************/

#ifndef _STATE_MACHINE_FRAME_H
#define _STATE_MACHINE_FRAME_H

/******************************************************************************
* Includes
******************************************************************************/


/******************************************************************************
* Constants
******************************************************************************/
#define	TURNED_ON	0x1
#define	TURNED_OFF	0x0

#ifndef true
#define true  ((tBool)1)
#endif

#ifndef false
#define false ((tBool)0)
#endif


typedef enum {
    init            = 0,
    fault           = 1,
    ready           = 2,
    calib           = 3,
    align           = 4,
    run             = 5,
    reset			= 6,
    checkrun		= 7,
    brake			= 8    
}AppStates;         /* Application state identification user type*/

typedef enum {
    e_fault         = 0,
    e_fault_clear   = 1,
    e_init			= 2,
    e_init_done     = 3,
    e_ready         = 4,
    e_app_on        = 5,
    e_calib         = 6,
    e_calib_done    = 7,
    e_align         = 8,
    e_align_done    = 9,
    e_run           = 10,
    e_app_off       = 11,
    e_reset			= 12,
    e_reset_done    = 13,
    e_checkrun	    = 14,   
    e_checkrun_done	= 15, 
    e_brake		    = 16,   
    e_brake_done	= 17    
}AppEvents;         /* Application event identification user type*/

typedef void (*PFCN_VOID_STATES)(); /* pointer to function */
typedef void (*PFCN_VOID_LED)(); /* pointer to function*/

extern PFCN_VOID_STATES state_table[18][9];

extern void stateFault();
extern void stateInit();
extern void stateReady();
extern void stateCalib();
extern void stateAlign();
extern void stateRun();
extern void stateReset();

extern PFCN_VOID_LED state_LED[7];

/* LED application control*/
extern void stateLedOFF();
extern void stateLedON();
extern void stateLedFLASHING_SLOW();
extern void stateLedFLASHING_FASTER();
extern void stateLedFLASHING_FAST();

#endif //_STATE_MACHINE_FRAME_H
