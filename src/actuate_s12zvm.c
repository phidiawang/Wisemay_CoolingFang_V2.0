/******************************************************************************
*
* Copyright 2006-2015 Freescale Semiconductor, Inc.
* Copyright 2016-2017 NXP
*
******************************************************************************/
/*!
*
* @file     actuate_s12zvm.c
*
* @date     JUN-01-2015
*
* @brief    Header file for single shunt variant of actuator module
*
*******************************************************************************
*
*
******************************************************************************/

/******************************************************************************
| Includes
-----------------------------------------------------------------------------*/
#include "mc9s12zvml32.h"
#include "actuate_s12zvm.h"
#include "gflib.h"
#include "gmclib.h"
#include "gdflib.h"

#include "ptu.h"

/******************************************************************************
| External declarations
-----------------------------------------------------------------------------*/

/******************************************************************************
| Defines and macros            (scope: module-local)
-----------------------------------------------------------------------------*/

/******************************************************************************
| Typedefs and structures       (scope: module-local)
-----------------------------------------------------------------------------*/
typedef struct PMF_MODULATOR_EDGES_T
{
	tFrac16		firstEdge;
	tFrac16		secondEdge;
}PMF_MODULATOR_EDGES_T;

typedef struct PMF_TWO_MODULATORS_T
{
	PMF_MODULATOR_EDGES_T	modA;
	PMF_MODULATOR_EDGES_T	modB;
}PMF_TWO_MODULATORS_T;

typedef struct PMF_3PH_MODULATOR_T
{
	PMF_TWO_MODULATORS_T	phA;
	PMF_TWO_MODULATORS_T	phB;
	PMF_TWO_MODULATORS_T	phC;
}PMF_3PH_MODULATOR_T;

typedef struct PTU_TRIGGERS_T
{
	tU16	ph1Trg1;
    tU16	ph2Trg1;
    tU16	dcOffsetTrg;
    tU16	ph2Trg2;
    tU16	ph1Trg2;
}PTU_TRIGGERS_T;
/******************************************************************************
| Global variable definitions   (scope: module-exported)
-----------------------------------------------------------------------------*/

/******************************************************************************
| Global variable definitions   (scope: module-local)
-----------------------------------------------------------------------------*/

/******************************************************************************
| Function prototypes           (scope: module-local)
-----------------------------------------------------------------------------*/
void SetPmfValReg(PMF_3PH_MODULATOR_T *pwm3PhEdges);
void CalcEdges(PMF_3PH_MODULATOR_T *pwm3PhEdges, SWLIBS_3Syst_F16 *duty, SWLIBS_3Syst_F16 *pwmB);
void SetPtuTriggers(PTU_TRIGGERS_T	*trigs);
/******************************************************************************
| Function implementations      (scope: module-local)
-----------------------------------------------------------------------------*/

/******************************************************************************
| Function implementations      (scope: module-exported)
-----------------------------------------------------------------------------*/

/**************************************************************************//*!
@brief Unmask PWM output and set 50% dytucyle 

@param[in,out]  

@return
******************************************************************************/
void EnableOutput(void)
{
	SWLIBS_3Syst_F16 f16pwm;
	
	f16pwm.f16Arg1 = FRAC16(0.5);
	f16pwm.f16Arg2 = FRAC16(0.5);
	f16pwm.f16Arg3 = FRAC16(0.5);
	
	PMFCFG2_MSK  = 0x0;
	
	SetDutycycle(&f16pwm,2);
}


/**************************************************************************//*!
@brief Mask PWM output and set 50% dytucyle 

@param[in,out]  

@return
******************************************************************************/
void DisableOutput(void)
{
	SWLIBS_3Syst_F16 f16pwm;
		
	f16pwm.f16Arg1 = FRAC16(0.5);
	f16pwm.f16Arg2 = FRAC16(0.5);
	f16pwm.f16Arg3 = FRAC16(0.5);
	
	PMFCFG2_MSK  = 0x3F;
	
	SetDutycycle(&f16pwm,2);
}

// The variables minZeroPulse and minSampling pulse are defined for 20khz PWM
// and both are defined in percentage of PWM period. For S12ZVM ADC the sampling pulse must be
// 2.5us translating to 5% of 20KHz PWM period.
tFrac16				minZeroPulse 		= FRAC16(3.8/100.0);
tFrac16 			minSamplingPulse    = FRAC16(5.0/100.0);

/**************************************************************************//*!
@brief Set PWM dytucyle, the dutycycle will by update on next reload event 

@param[in,out]  SWLIBS_3Syst_F16 - dutycycle to be applied
				tU16 			 - sector of a voltage vector 

@return
******************************************************************************/
void SetDutycycle(SWLIBS_3Syst_F16 *f16pwm, tU16 sector)
{
	SWLIBS_3Syst_F16    pwmB;
	PMF_3PH_MODULATOR_T pwm3PhEdges;

	tFrac16             diffUV,diffVW,diffWU,temp;
	
	tFrac16      		trg[8];
	PTU_TRIGGERS_T		trigs;
	
	tFrac16 			minSamplingPulse_x2 = MLIB_ShLSat_F16(minSamplingPulse,1);
	tFrac16 			minSamplingPulse_d2 = MLIB_ShR_F16(minSamplingPulse,1);
	tFrac16				pulseSum            = MLIB_Add_F16(minSamplingPulse_x2, minZeroPulse);
	
	switch (sector) {
		case 1:
			diffUV   = MLIB_Sub_F16(f16pwm->f16Arg1,f16pwm->f16Arg2);
			diffVW   = MLIB_Sub_F16(f16pwm->f16Arg2,f16pwm->f16Arg3);

			pwmB.f16Arg3 = minZeroPulse;
			pwmB.f16Arg2 = ((diffVW)<minSamplingPulse_x2)?MLIB_SubSat_F16(pulseSum,diffVW):minZeroPulse;
			temp         = MLIB_AddSat_F16(pwmB.f16Arg2,minSamplingPulse_x2);
			pwmB.f16Arg1 = ((diffUV)<MLIB_Sub_F16(temp,minZeroPulse))?MLIB_SubSat_F16(temp,diffUV):minZeroPulse;
			
			CalcEdges(&pwm3PhEdges, f16pwm, &pwmB);
			
			trg[1] = pwm3PhEdges.phB.modA.firstEdge;
			trg[2] = pwm3PhEdges.phC.modA.firstEdge;
			trg[3] = pwm3PhEdges.phC.modB.secondEdge;
			trg[4] = pwm3PhEdges.phB.modA.secondEdge;
			trg[5] = pwm3PhEdges.phA.modA.secondEdge;
				
			break;

		case 2:
			diffUV   = MLIB_Sub_F16(f16pwm->f16Arg2,f16pwm->f16Arg1);
			diffWU   = MLIB_Sub_F16(f16pwm->f16Arg1,f16pwm->f16Arg3);

			pwmB.f16Arg3 = minZeroPulse;
			pwmB.f16Arg1 = ((diffWU)<minSamplingPulse_x2)?MLIB_SubSat_F16(pulseSum,diffWU):minZeroPulse;
			temp         = MLIB_AddSat_F16(pwmB.f16Arg1,minSamplingPulse_x2);
			pwmB.f16Arg2 = ((diffUV)<MLIB_Sub_F16(temp,minZeroPulse))?MLIB_SubSat_F16(temp,diffUV):minZeroPulse;
			
			CalcEdges(&pwm3PhEdges, f16pwm, &pwmB);
			
			trg[1] = pwm3PhEdges.phA.modA.firstEdge;
			trg[2] = pwm3PhEdges.phC.modA.firstEdge;
			trg[3] = pwm3PhEdges.phC.modB.secondEdge;
			trg[4] = pwm3PhEdges.phA.modA.secondEdge;
			trg[5] = pwm3PhEdges.phB.modA.secondEdge;
			
			break;
			
		case 3:
			diffWU   = MLIB_Sub_F16(f16pwm->f16Arg3,f16pwm->f16Arg1);
			diffVW   = MLIB_Sub_F16(f16pwm->f16Arg2,f16pwm->f16Arg3);

			pwmB.f16Arg1 = minZeroPulse;
			pwmB.f16Arg3 = ((diffWU)<minSamplingPulse_x2)?MLIB_SubSat_F16(pulseSum,diffWU):minZeroPulse;
			temp         = MLIB_AddSat_F16(pwmB.f16Arg3,minSamplingPulse_x2);
			pwmB.f16Arg2 = ((diffVW)<MLIB_Sub_F16(temp,minZeroPulse))?MLIB_SubSat_F16(temp,diffVW):minZeroPulse;
			
			CalcEdges(&pwm3PhEdges, f16pwm, &pwmB);
			
			trg[1] = pwm3PhEdges.phC.modA.firstEdge;
			trg[2] = pwm3PhEdges.phA.modA.firstEdge;
			trg[3] = pwm3PhEdges.phA.modB.secondEdge;
			trg[4] = pwm3PhEdges.phC.modA.secondEdge;
			trg[5] = pwm3PhEdges.phB.modA.secondEdge;
			
			break;

		case 4:
			diffUV   = MLIB_Sub_F16(f16pwm->f16Arg2,f16pwm->f16Arg1);
			diffVW   = MLIB_Sub_F16(f16pwm->f16Arg3,f16pwm->f16Arg2);

			pwmB.f16Arg1 = minZeroPulse;
			pwmB.f16Arg2 = ((diffUV)<minSamplingPulse_x2)?MLIB_SubSat_F16(pulseSum,diffUV):minZeroPulse;
			temp         = MLIB_AddSat_F16(pwmB.f16Arg2,minSamplingPulse_x2);
			pwmB.f16Arg3 = ((diffVW)<MLIB_Sub_F16(temp,minZeroPulse))?MLIB_SubSat_F16(temp,diffVW):minZeroPulse;
			
			CalcEdges(&pwm3PhEdges, f16pwm, &pwmB);
			
			trg[1] = pwm3PhEdges.phB.modA.firstEdge;
			trg[2] = pwm3PhEdges.phA.modA.firstEdge;
			trg[3] = pwm3PhEdges.phA.modB.secondEdge;
			trg[4] = pwm3PhEdges.phB.modA.secondEdge;
			trg[5] = pwm3PhEdges.phC.modA.secondEdge;
			break;

		case 5:
			diffUV   = MLIB_Sub_F16(f16pwm->f16Arg1,f16pwm->f16Arg2);
			diffWU   = MLIB_Sub_F16(f16pwm->f16Arg3,f16pwm->f16Arg1);

			pwmB.f16Arg2 = minZeroPulse;
			pwmB.f16Arg1 = ((diffUV)<minSamplingPulse_x2)?MLIB_SubSat_F16(pulseSum,diffUV):minZeroPulse;
			temp         = MLIB_AddSat_F16(pwmB.f16Arg1,minSamplingPulse_x2);
			pwmB.f16Arg3 = ((diffWU)<MLIB_Sub_F16(temp,minZeroPulse))?MLIB_SubSat_F16(temp,diffWU):minZeroPulse;
			
			CalcEdges(&pwm3PhEdges, f16pwm, &pwmB);
			
			trg[1] = pwm3PhEdges.phA.modA.firstEdge;
			trg[2] = pwm3PhEdges.phB.modA.firstEdge;
			trg[3] = pwm3PhEdges.phB.modB.secondEdge;
			trg[4] = pwm3PhEdges.phA.modA.secondEdge;
			trg[5] = pwm3PhEdges.phC.modA.secondEdge;
			
			break;

		case 6:
			diffWU   = MLIB_Sub_F16(f16pwm->f16Arg1,f16pwm->f16Arg3);
			diffVW   = MLIB_Sub_F16(f16pwm->f16Arg3,f16pwm->f16Arg2);

			pwmB.f16Arg2 = minZeroPulse;
			pwmB.f16Arg3 = ((diffVW)<minSamplingPulse_x2)?MLIB_SubSat_F16(pulseSum,diffVW):minZeroPulse;
			temp         = MLIB_AddSat_F16(pwmB.f16Arg3,minSamplingPulse_x2);
			pwmB.f16Arg1 = ((diffWU)<MLIB_Sub_F16(temp,minZeroPulse))?MLIB_SubSat_F16(temp,diffWU):minZeroPulse;
			
			CalcEdges(&pwm3PhEdges, f16pwm, &pwmB);
			
			trg[1] = pwm3PhEdges.phC.modA.firstEdge;
			trg[2] = pwm3PhEdges.phB.modA.firstEdge;
			trg[3] = pwm3PhEdges.phC.modB.secondEdge;
			trg[4] = pwm3PhEdges.phC.modA.secondEdge;
			trg[5] = pwm3PhEdges.phA.modA.secondEdge;
			break;

		default:
			pwmB.f16Arg1 = 0;
			pwmB.f16Arg2 = 0;
			pwmB.f16Arg3 = 0;
			
			CalcEdges(&pwm3PhEdges, f16pwm, &pwmB);
			
			trg[1] = pwm3PhEdges.phB.modA.firstEdge;
			trg[2] = pwm3PhEdges.phC.modA.firstEdge;

			trg[3] = pwm3PhEdges.phC.modB.secondEdge;

			trg[4] = pwm3PhEdges.phB.modA.secondEdge;
			trg[5] = pwm3PhEdges.phA.modA.secondEdge;
			break;
	}
	
	if (MLIB_Sub_F16(trg[5],trg[4]) < minSamplingPulse)
	{
		trg[4] = MLIB_Sub_F16(trg[5], minSamplingPulse);
	}

	trigs.ph1Trg1       = (tU16) MLIB_Mul_F16(trg[1],PMFMODA);
	trigs.ph2Trg1       = (tU16) MLIB_Mul_F16(trg[2],PMFMODA);
	trigs.dcOffsetTrg   = (tU16) PMFMODA;
	trigs.ph2Trg2       = (tU16) MLIB_Mul_F16(trg[4],PMFMODA);
	trigs.ph1Trg2       = (tU16) MLIB_Mul_F16(trg[5],PMFMODA);
	
  
	SetPtuTriggers(&trigs);
	
	SetPmfValReg(&pwm3PhEdges);
	
	PTUC_PTULDOK = 1;
}

volatile tS16 triggerOffset1 = -25;
volatile tS16 triggerOffset2 = -25;
volatile tS16 triggerOffset3 = -25;
volatile tS16 triggerOffset4 = -25;

volatile tU8 writeToList = 0;
/***************************************************************************//*!
@brief SetPtuTriggers calculates appropriate trigger points for ADC measurements 

@param[in,out]  PTU_TRIGGERS_T - ADC trigger points

@return         void

@details
******************************************************************************/
void SetPtuTriggers(PTU_TRIGGERS_T	*pTrg)
{
    writeToList = (*(volatile tU8 *)(0x0580 + 0x0006)) & 0x01;
    writeToList  ^= (1 << 0);
    
    ptuTriggerList0[writeToList][0] = pTrg->ph1Trg1 + triggerOffset1;
    ptuTriggerList0[writeToList][1] = pTrg->ph2Trg1 + triggerOffset2;

    //ptuTriggerList0[writeToList][2] = pTrg->dcOffsetTrg + triggerOffsetR;

    ptuTriggerList0[writeToList][2] = pTrg->ph2Trg2 + triggerOffset3;
    ptuTriggerList0[writeToList][3] = pTrg->ph1Trg2 + triggerOffset4;
    ptuTriggerList0[writeToList][4] = 0x00;				// End Of List
}


/***************************************************************************//*!
@brief Calculate position of PWM edges within one duty cycle such that the 
		continuous double switching is possible. 

@param[in,out]  PMF_3PH_MODULATOR_T - position of pwm edges in percentage of pwm
				SWLIBS_3Syst_F16	- required duty cycle
				SWLIBS_3Syst_F16	- required off centre pattern

@return         

@details
******************************************************************************/
void CalcEdges(PMF_3PH_MODULATOR_T *pwm3PhEdges, SWLIBS_3Syst_F16 *duty, SWLIBS_3Syst_F16 *pwmB)
{
	SWLIBS_3Syst_F16    pwmAhalf,pwmBhalf;
	SWLIBS_3Syst_F16 	pwmA;
	
	pwmA.f16Arg1 = MLIB_AddSat_F16(duty->f16Arg1,pwmB->f16Arg1);
	pwmA.f16Arg2 = MLIB_AddSat_F16(duty->f16Arg2,pwmB->f16Arg2);
	pwmA.f16Arg3 = MLIB_AddSat_F16(duty->f16Arg3,pwmB->f16Arg3);
	
    pwmAhalf.f16Arg1 = pwmA.f16Arg1>>1;
    pwmAhalf.f16Arg2 = pwmA.f16Arg2>>1;
    pwmAhalf.f16Arg3 = pwmA.f16Arg3>>1;

    pwmBhalf.f16Arg1 = pwmB->f16Arg1>>1;
    pwmBhalf.f16Arg2 = pwmB->f16Arg2>>1;
    pwmBhalf.f16Arg3 = pwmB->f16Arg3>>1;

    /* ph A */
    pwm3PhEdges->phA.modA.firstEdge		= 0x3FFF - pwmAhalf.f16Arg1;
    pwm3PhEdges->phA.modA.secondEdge	= 0x3FFF + pwmAhalf.f16Arg1;
    pwm3PhEdges->phA.modB.firstEdge		= 0x3FFF - pwmBhalf.f16Arg1;
    pwm3PhEdges->phA.modB.secondEdge	= 0x3FFF + pwmBhalf.f16Arg1;
        
    /* ph B */
    pwm3PhEdges->phB.modA.firstEdge		= 0x3FFF - pwmAhalf.f16Arg2;
	pwm3PhEdges->phB.modA.secondEdge	= 0x3FFF + pwmAhalf.f16Arg2;
	pwm3PhEdges->phB.modB.firstEdge		= 0x3FFF - pwmBhalf.f16Arg2;
	pwm3PhEdges->phB.modB.secondEdge	= 0x3FFF + pwmBhalf.f16Arg2;

    /* ph C */
	pwm3PhEdges->phC.modA.firstEdge		= 0x3FFF - pwmAhalf.f16Arg3;
	pwm3PhEdges->phC.modA.secondEdge	= 0x3FFF + pwmAhalf.f16Arg3;
	pwm3PhEdges->phC.modB.firstEdge		= 0x3FFF - pwmBhalf.f16Arg3;
	pwm3PhEdges->phC.modB.secondEdge	= 0x3FFF + pwmBhalf.f16Arg3;
}

/***************************************************************************//*!
@brief Set PMF value registers

@param[in,out]  PMF_3PH_MODULATOR_T - pwm edges in percentage

@return         void

@details
******************************************************************************/
void SetPmfValReg(PMF_3PH_MODULATOR_T *pwm3PhEdges)
{
	/* ph A */
	PMFVAL0 = MLIB_Mul(pwm3PhEdges->phA.modA.firstEdge, PMFMODA<<1, F16);	// duty cycle 0-1 -> 0-PWM_MODULO
	PMFVAL1 = MLIB_Mul(pwm3PhEdges->phA.modB.firstEdge, PMFMODA<<1, F16);	// duty cycle 0-1 -> 0-PWM_MODULO
	
	/* ph B */
	PMFVAL2 = MLIB_Mul(pwm3PhEdges->phB.modA.firstEdge, PMFMODA<<1, F16);	// duty cycle 0-1 -> 0-PWM_MODULO
	PMFVAL3 = MLIB_Mul(pwm3PhEdges->phB.modB.firstEdge, PMFMODA<<1, F16);	// duty cycle 0-1 -> 0-PWM_MODULO

	/* ph C */
	PMFVAL4 = MLIB_Mul(pwm3PhEdges->phC.modA.firstEdge, PMFMODA<<1, F16);	// duty cycle 0-1 -> 0-PWM_MODULO
	PMFVAL5 = MLIB_Mul(pwm3PhEdges->phC.modB.firstEdge, PMFMODA<<1, F16);	// duty cycle 0-1 -> 0-PWM_MODULO
}

/**************************************************************************//*!
@brief Read GDU Flags register 

@param[in,out]  

@return  GDUF
******************************************************************************/
unsigned short GetDriverError(void)
{
	return (GDUF|GDUDSE);	// Return non zero value if GDU fault or desaturation error occurs
}

/**************************************************************************//*!
@brief Clear GDU flag ragisters 

@param[in,out]  

@return true - if the flags were cleared
		false- if the clearing was not successful  
******************************************************************************/
tBool ClearDriverError(void)
{
	tBool retVal = (tBool)1;

	GDUF = 0xFF;

	if (GDUF != 0)
		retVal = (tBool)0;
	
	GDUDSE = 0xFF;
	
	if (GDUDSE != 0)
		retVal = (tBool)0;

	return(retVal);
}

/* End of file */
