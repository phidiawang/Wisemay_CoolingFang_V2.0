/******************************************************************************
*
* Copyright 2006-2015 Freescale Semiconductor, Inc.
* Copyright 2016-2017 NXP
*
******************************************************************************/
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

/******************************************************************************
* Includes
******************************************************************************/
#include "state_machine.h"

/******************************************************************************
| External declarations
-----------------------------------------------------------------------------*/

/******************************************************************************
| Defines and macros            (scope: module-local)
-----------------------------------------------------------------------------*/

/******************************************************************************
| Typedefs and structures       (scope: module-local)
-----------------------------------------------------------------------------*/

/******************************************************************************
| Global variable definitions   (scope: module-exported)
-----------------------------------------------------------------------------*/

/******************************************************************************
| Global variable definitions   (scope: module-local)
-----------------------------------------------------------------------------*/

/******************************************************************************
| Function prototypes           (scope: module-local)
-----------------------------------------------------------------------------*/


/******************************************************************************
| Function implementations      (scope: module-local)
-----------------------------------------------------------------------------*/

/******************************************************************************
| Function implementations      (scope: module-exported)
-----------------------------------------------------------------------------*/


//extern PFCN_VOID_STATES state_table[14][7]={
//    /* Actual state ->         'Init'           'Fault'         'Ready'         'Calib'         'Align'         'Run'		'Reset' */
//    /* e_fault          */ { stateFault,     stateFault,     stateFault,     stateFault,     stateFault,     stateFault,	stateFault},
//    /* e_fault_clear    */ { stateFault,     stateInit,      stateFault,     stateFault,     stateFault,     stateFault,	stateFault},
//    /* e_init          	*/ { stateInit,      stateFault,     stateFault,     stateFault,     stateFault,     stateFault,	stateFault},
//    /* e_init_done      */ { stateReady,     stateFault,     stateFault,     stateFault,     stateFault,     stateFault,	stateFault},
//    /* e_ready          */ { stateFault,     stateFault,     stateReady,     stateFault,     stateFault,     stateFault,	stateFault},
//    /* e_app_on         */ { stateFault,     stateFault,     stateCalib,     stateFault,     stateFault,     stateFault,	stateFault},
//    /* e_calib          */ { stateFault,     stateFault,     stateFault,     stateCalib,     stateFault,     stateFault,	stateFault},
//    /* e_calib_done     */ { stateFault,     stateFault,     stateFault,     stateAlign,     stateFault,     stateFault,	stateFault},
//    /* e_align          */ { stateFault,     stateFault,     stateFault,     stateFault,     stateAlign,     stateFault,	stateFault},
//    /* e_align_done     */ { stateFault,     stateFault,     stateFault,     stateFault,     stateRun,       stateFault,	stateFault},
//    /* e_run            */ { stateFault,     stateFault,     stateFault,     stateFault,     stateFault,     stateRun,		stateFault},
//    /* e_app_off        */ { stateFault,     stateFault,     stateReady,     stateInit,      stateInit,      stateInit,		stateFault},
//    /* e_reset          */ { stateFault,     stateFault,     stateReset,     stateFault,     stateFault,     stateFault,	stateReset},
//    /* e_reset_done     */ { stateFault,     stateFault,     stateFault,     stateFault,     stateFault,     stateFault,	stateInit}
//};




/* Actual state ->         				'Init'			'Fault'			   'Ready'         'Calib'					'Align'	         'Run'			'Reset'		*/
extern PFCN_VOID_LED state_LED[7] = {stateLedOFF, stateLedFLASHING_FAST, stateLedOFF, stateLedFLASHING_SLOW, stateLedFLASHING_FASTER,	stateLedON, stateLedOFF};

extern PFCN_VOID_STATES state_table[18][9]={
    /* Actual state ->         'Init'           'Fault'         'Ready'         'Calib'        'check'        'brake'        'Align'         'Run'		    'Reset' */
    /* e_fault          */ { stateFault,     stateFault,     stateFault,     stateFault,     stateFault,    stateFault,     stateFault,     stateFault,	    stateFault},
    /* e_fault_clear    */ { stateFault,     stateInit,      stateFault,     stateFault,     stateFault,    stateFault,     stateFault,     stateFault,	    stateFault},
    /* e_init          	*/ { stateInit,      stateFault,     stateFault,     stateFault,     stateFault,    stateFault,     stateFault,     stateFault,	    stateFault},
    /* e_init_done      */ { stateReady,     stateFault,     stateFault,     stateFault,     stateFault,    stateFault,     stateFault,     stateFault,	    stateFault},
    /* e_ready          */ { stateFault,     stateFault,     stateReady,     stateFault,     stateFault,    stateFault,     stateFault,     stateFault,	    stateFault},
    /* e_app_on         */ { stateFault,     stateFault,     stateCalib,     stateFault,     stateFault,    stateFault,     stateFault,     stateFault,	    stateFault},
    /* e_calib          */ { stateFault,     stateFault,     stateFault,     stateCalib,     stateFault,    stateFault,     stateFault,     stateFault,	    stateFault},
    /* e_calib_done     */ { stateFault,     stateFault,     stateFault,     stateAlign,   stateFault,    stateFault,     stateFault,     stateFault,    stateFault},
    /* e_align          */ { stateFault,     stateFault,     stateFault,     stateFault,     stateFault,    stateFault,     stateAlign,     stateFault,	    stateFault},
    /* e_align_done     */ { stateFault,     stateFault,     stateFault,     stateFault,     stateFault,    stateFault,     stateRun,       stateFault,	    stateFault},
    /* e_run            */ { stateFault,     stateFault,     stateFault,     stateFault,     stateFault,    stateFault,     stateFault,     stateRun,		stateFault},
    /* e_app_off        */ { stateFault,     stateFault,     stateReady,     stateFault,     stateInit,     stateInit,      stateInit,      stateInit,		stateFault},
    /* e_reset          */ { stateFault,     stateFault,     stateReset,     stateFault,     stateFault,    stateFault,     stateFault,     stateFault,	    stateReset},
    /* e_reset_done     */ { stateFault,     stateFault,     stateFault,     stateFault,     stateFault,    stateFault,     stateFault,     stateFault,	    stateInit},
    /* e_check          */ { stateFault,     stateFault,     stateFault,     stateFault,     stateCheckM,   stateFault,     stateFault,     stateFault,     stateFault},
    /* e_check_done     */ { stateFault,     stateFault,     stateFault,     stateFault,     stateCheckM,   stateFault,     stateFault,     stateFault,     stateFault},  
    /* e_brake          */ { stateFault,     stateFault,     stateFault,     stateFault,     stateFault,    stateBrake,     stateFault,     stateFault,	    stateFault},
    /* e_brake_done     */ { stateFault,     stateFault,     stateFault,     stateFault,     stateFault,    stateAlign,     stateFault,     stateFault,	    stateFault},       
};
