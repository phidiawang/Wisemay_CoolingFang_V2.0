/******************************************************************************
*
* Copyright 2006-2015 Freescale Semiconductor, Inc.
* Copyright 2016-2017 NXP
*
******************************************************************************/
/*!
*
* @file      motor_structure.h
*
* @date      May-11-2017
* 
* @brief     Header file for FOC Drive
*
*******************************************************************************
*
******************************************************************************/

#ifndef _MOTOR_STRUCTURE_H
#define _MOTOR_STRUCTURE_H

/******************************************************************************
* Includes
******************************************************************************/

#include "gflib.h"
#include "gmclib.h"
#include "gdflib.h"
#include "amclib.h"

/******************************************************************************
| Defines and macros            (scope: module-local)
-----------------------------------------------------------------------------*/


/******************************************************************************
| Typedefs and structures       (scope: module-local)
-----------------------------------------------------------------------------*/


/*------------------------------------------------------------------------*//*!
@brief  Structure containing position/speed module variables
*//*-------------------------------------------------------------------------*/
typedef struct
{
    tFrac16                 thRotEl;		// El. position entering to the control loop
    tFrac16                 wRotEl;			// El. speed entering to the control loop
    tFrac16                 wRotElFilt;		// Filtered El. speed entering to the control loop
    GDFLIB_FILTER_MA_T      wRotFilter;     // Speed filtering filter settings
    tFrac16                 wRotElReq;		// Required el. speed
    tFrac16                 wRotElReqRamp;	// Required el. speed converted to the ramp shape
    tFrac16                 wRotElErr;		// Error of the el. speed entering to speed controller
    tS16					speedLoopCntr;	// rate between speed and current loop
} pospeControl_t;


typedef struct
{
	tFrac16					thRotEl;
	tFrac16					wRotEl;
	GFLIB_INTEGRATOR_TR_T 	integ;
	tFrac16					iQUpperLimit;
	tFrac16					iQLowerLimit;
	tFrac16					thDifOpenLEstim;
}openLoopPospe_t;

typedef struct
{
	tFrac16					thRotEl;
	tFrac16					wRotEl;
	tFrac16 				wRotElMatch_1;
	tFrac16 				wRotElMatch_2;
	tFrac16				    DQtoGaDeError;
	AMCLIB_BEMF_OBSRV_DQ_T_F16   bEMFObs;
	AMCLIB_TRACK_OBSRV_T_F16     TrackObsrv;
	GDFLIB_FILTER_MA_T_F16	filterMA;
	tFrac16					iQUpperLimit;
	tFrac16					iQLowerLimit;
}sensorLessPospe_t;

typedef struct
{
	tFrac16					UmReq;				// Required magnitude of supply voltage for scalar control
	tFrac16					VHzRatioReq;		// V/f ratio - gain
	tS16					VHzRatioReq_Shift;	// V/f ratio - shift
}scalarControl_t;

/*! @brief mcs AvIpeak structure */
typedef struct{
    SWLIBS_3Syst_F16            sIABCpeak;// Three phases peak current
    GDFLIB_FILTER_MA_T          uAvIpeakFilter;     // AvIpeak filter settings
    tFrac16                     f16RtIpeak;// AvIpeak 
    tFrac16                     f16AvIpeakFilt;//Filtered AvIpeak 

} AvIpeak_t;  

/*! General stucture for PMSM motor */
typedef struct{
	tU16        		            alignCntr;		// Alignment counter
	tU16							alignCntrInit;	// Alignment duration
	tU16        		            alignVoltage;	// Alignment voltage
    tU16		                    svmSector;      // Space Vector Modulation sector
    SWLIBS_2Syst_F16                iDQFbck;        // dq - axis current feedback
    SWLIBS_2Syst_F16                iAlBeFbck;      // Alpha/Beta - axis current feedback
    SWLIBS_2Syst_F16                iDQReq;         // dq - axis required currents, given by speed PI
    SWLIBS_2Syst_F16                uDQReq;         // dq - axis required voltages given by current PIs
    SWLIBS_2Syst_F16                iDQReqZC;       // Transfer function zeros cancellation in current branch
    SWLIBS_2Syst_F16                iDQErr;         // Error between the reference and feedback signal
    SWLIBS_2Syst_F16                uAlBeReq;       // Alpha/Beta required voltages
    SWLIBS_2Syst_F16                uAlBeReqDCB;    // Alpha/Beta required voltages after DC Bus ripple elimination
    SWLIBS_2Syst_F16                thTransform;    // Transformation angle - enters to Park transformation
    SWLIBS_3Syst_F16                iAbcFbck;       // Three phases current feedback
    SWLIBS_3Syst_F16                pwm16;          // Three phase 16bit Duty-Cycles estimated from uAlBeReqDCB
    GFLIB_LIMIT_T_F16				iCLoop_Limit;	// Current loop limit
    GMCLIB_ELIMDCBUSRIP_T           elimDcbRip;     // Predefined structure related to DC Bus voltage ripple elimination
    GFLIB_CONTROLLER_PIAW_R_T       dAxisPI;        // Predefined structure related to d-axis current PI controller
    GFLIB_CONTROLLER_PIAW_R_T       qAxisPI;        // Predefined structure related to q-axis current PI controller
    GFLIB_CONTROLLER_PIAW_P_T       speedPI;        // Predefined structure related to Speed PI controller
    GFLIB_RAMP_T_F32                speedRampPos;   // Reference speed ramp generation for positive speeds
    GFLIB_RAMP_T_F32                speedRampNeg;   // Reference speed ramp generation for negative speeds
    GDFLIB_FILTER_IIR1_T_F16        uDcbFilter;     // DC bus voltage filter settings
    tFrac16							f16Udcb;		// DC bus voltage
    openLoopPospe_t					pospeOpenLoop;	// Open Loop Position generator
    sensorLessPospe_t				pospeSensorless;// Sensorless position and speed including open loop matching
    pospeControl_t                  pospeControl;   // Position/Speed variables needed for control
    scalarControl_t					scalarControl;  // Scalar Control variables for MCAT purpose
}pmsmDrive_t;


typedef struct
{
    tFrac32 K1;
    tFrac32 out_last;
}rlInvParamFilter1ord;

typedef enum
{
	force	 = 0,
	tracking = 1,
 	linkup  = 2,   
	sensorless1 = 3 	
}tPos_mode;

typedef enum CONTORL_MODE_e
{
	manual,
	automatic
}controlMode_t;

typedef enum
{
	scalarControl	=0,
	voltageControl	=1,
	currentControl	=2,	
	speedControl	=3
}controlStructMode_t;

typedef struct
{
	tU32			ledCounter;
	tU32			ledFlashing;
    controlMode_t   controlMode;			// Handles whether the drive is in openLoop, sensorLess, resolver mode
    controlStructMode_t FOCcontrolMode;     // defines the cascade control mode: range(0-SC, 1-UC, 2-IC, 3-SC)
    tU8   			btSpeedUp;				// Variable to increase the speed command by given step 
    tU8  			btSpeedDown;			// Variable to lower the speed command by given step
    tU8    			btFlipFlop, btFlipFlopTemp;	// Enable/Disable Control
    tBool           switchAppOnOff;         /*! raw value */
    tBool           switchAppOnOffState;    /*! raw value */
    tBool           switchFaultClear;       /*! raw value */
    tBool           switchAppReset;         /*! raw value */
    tBool           readFault;				// Read fault status
}userControl_t;

typedef struct
{
    AppStates       state;                  /*! raw value */
    AppEvents       event;                  /*! raw value */
    userControl_t   usrControl;				/* user action required */
}driveStates_t;

typedef union
{
    tU16 R;
    struct
    {
        tU16 PTU_Error              : 1;   /* Error in PTU hw initialization*/
        tU16 ADC_Error              : 1;   /* Error in ADC hw initialization*/
        tU16 PWM_Error              : 1;   /* Error in PWM hw initialization */
        tU16 GDU_Error              : 1;   /* Error in GDU hw initialization */
        tU16 : 12;                         /* RESERVED */
    }B;
}mcuFaultStatus_t;

typedef union
{
    tU16 R;
    struct
    {
        tU16 InitError              : 1;   /* Error during app initialization */
        tU16 CalibError             : 1;   /* Error during calibration */
        tU16 AlignError             : 1;   /* Error during alignment */
        tU16 RunError             	: 1;   /* Error during run state */
        tU16 FOCError				: 1;	/* Error during FOC calculation */ 
        tU16 : 11;                         /* RESERVED */
    }B;
}stMachineFaultStatus_t;


typedef union
{
    tU16 R;
    struct
    {
    	tU16 OffCancError           : 1;   /* Offset Cancellation Error flag */
    	tU16 OverPhaseCCurrent      : 1;   /* OverCurrent fault flag */
    	tU16 OverPhaseBCurrent      : 1;   /* OverCurrent fault flag */
    	tU16 OverPhaseACurrent      : 1;   /* OverCurrent fault flag */
    	tU16 OverHeating            : 1;   /* Overheating fault flag */
    	tU16 MainsFault             : 1;   /* Mains out of range */
    	tU16 OverLoad               : 1;   /* Overload Flag */
    	tU16 OverDCBusCurrent       : 1;   /* OverCurrent fault flag */
    	tU16 UnderDCBusVoltage      : 1;   /* Undervoltage fault flag */
    	tU16 OverDCBusVoltage       : 1;   /* Overvoltage fault flag */
    	tU16 FaultStall             : 1;   /* FaultStall fault flag */
    	tU16 FaultStart             : 1;   /* FaultStart fault flag */
    	tU16 FaultLossPhase         : 1;   /* FaultLossPhase fault flag */
    	tU16 FaultEmptyRun          : 1;   /* FaultEmptyRun fault flag */
    	tU16 FaultChkMotor          : 1;   /* FaultEmptyRun fault flag */    	
    	tU16 : 1;                          /* RESERVED */
    }B;
}motorFaultStatus_t;

typedef struct
{
	tU32 current;
	tU32 voltage;
	tU32 dcb_voltage;
	tU32 speed_w_e;
	tU32 speed_n_m;
	tU32 speed_ramp;
	tU32 position;
}fm_scale_t;

/*! Application fault status user type */
typedef struct
{
	mcuFaultStatus_t 		mcu;
	stMachineFaultStatus_t	stateMachine;
	motorFaultStatus_t 		motor;
}appFaultStatus_t;    /* Application fault status user type*/


#endif /* _MOTOR_STRUCTURE */
