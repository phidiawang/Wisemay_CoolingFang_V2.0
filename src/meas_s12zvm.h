/******************************************************************************
*
* Copyright 2006-2015 Freescale Semiconductor, Inc.
* Copyright 2016-2017 NXP
*
******************************************************************************/
/*!
*
* @file     meas_s12zvm.h
*
* @date     May-11-2017
*
* @brief    Header file for measurement module
*
*******************************************************************************
*
*
******************************************************************************/
#ifndef _MEAS_S12ZVM_H_
#define _MEAS_S12ZVM_H_

#include "mc9s12zvml32.h"
#include "SWLIBS_Typedefs.h"
#include "gflib.h"
#include "gmclib.h"
#include "gdflib.h"

/******************************************************************************
| Defines and macros            (scope: module-local)
-----------------------------------------------------------------------------*/


/******************************************************************************
| Typedefs and structures       (scope: module-local)
-----------------------------------------------------------------------------*/

typedef struct
{
    tFrac16    raw;   /*! raw value */
    tFrac16    filt;  /*! filtered value */
}meas_t;

/*------------------------------------------------------------------------*//*!
@brief  Structure containing measured raw values
*//*-------------------------------------------------------------------------*/
typedef struct
{
	meas_t    f16PhA;     // DC offset measured on phase A current
	meas_t    f16PhB;     // DC offset measured on phase B current
	meas_t    f16PhC;     // DC offset measured on phase C current
	meas_t    f16Idcb;    // DC offset measured on DC bus current
	meas_t    f16Udcb;    // DC offset measured on DC bus voltage
	meas_t    f16Temp;    // DC offset measured on temperature
}measResult_t;

typedef struct
{
    tFrac16    				    f16Offset;   /*! raw value */
    GDFLIB_FILTER_MA_T_F16		filtParam;	 /*! filter parameters */
}offsetBasic_t;


/*------------------------------------------------------------------------*//*!
@brief  Structure containing variables for software DC offset calibration.
*//*-------------------------------------------------------------------------*/
typedef struct
{
    offsetBasic_t    f16PhA;         // DC offset measured on phase A current
    offsetBasic_t    f16PhB;         // DC offset measured on phase B current
    offsetBasic_t    f16PhC;         // DC offset measured on phase C current
    offsetBasic_t    f16Idcb;        // DC offset measured on DC bus current
    offsetBasic_t    f16Udcb;        // DC offset measured on DC bus voltage
    offsetBasic_t    f16Temp;        // DC offset measured on temperature
}offset_t;


/*------------------------------------------------------------------------*//*!
@brief  Structure containing variables to configure Calibration on the application
        level.
*//*-------------------------------------------------------------------------*/
typedef struct
{
    tU16     u16CalibSamples; // Number of samples taken for calibration
}calibParam_t;

/*------------------------------------------------------------------------*//*!
@brief  Union containing module operation flags.
*//*-------------------------------------------------------------------------*/
typedef union
{
    tU16 R;
    struct {
        tU16               :14;// RESERVED
        tU16 calibDone     :1; // DC offset calibration done
        tU16 calibInitDone :1; // initial setup for DC offset calibration done
    } B;
}calibFlags_t;

/*------------------------------------------------------------------------*//*!
@brief  Module structure containing measurement related variables.
*//*-------------------------------------------------------------------------*/
typedef struct
{
    measResult_t  		measured;
    offset_t     		offset;
    calibParam_t      	param;
    calibFlags_t      	flag;
	tU16 				calibCntr;
}measModule_t;

/******************************************************************************
| Exported Variables
-----------------------------------------------------------------------------*/

/******************************************************************************
| Exported function prototypes
-----------------------------------------------------------------------------*/
extern tBool Meas_Clear(measModule_t *ptr);
extern tBool Meas_CalibCurrentSense(measModule_t *ptr, tU16 svmSector);
extern tBool Meas_Get3PhCurrent(measModule_t *ptr, SWLIBS_3Syst_F16 *i, tU16 svmSector);
extern tBool Meas_GetUdcVoltage(measModule_t *ptr, GDFLIB_FILTER_IIR1_T_F16 *uDcbFilter);
extern tBool Meas_GetTemperature(measModule_t *ptr);

/******************************************************************************
| Inline functions
-----------------------------------------------------------------------------*/

#endif /* _MEAS_S12ZVM_H_ */
