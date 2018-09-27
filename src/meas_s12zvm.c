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

/******************************************************************************
| Includes
-----------------------------------------------------------------------------*/
#include "meas_S12zvm.h"
#include "gflib.h"
#include "gmclib.h"
#include "gdflib.h"

#include "adc.h"

/******************************************************************************
| External declarations
-----------------------------------------------------------------------------*/

/******************************************************************************
| Defines and macros            (scope: module-local)
-----------------------------------------------------------------------------*/

/******************************************************************************
| Typedefs and structures       (scope: module-local)
-----------------------------------------------------------------------------*/
typedef struct ADC_RAW_DATA_T
{
	SWLIBS_2Syst_F16	ph1;
    SWLIBS_2Syst_F16	ph2;
    tFrac16				dcOffset;
}ADC_RAW_DATA_T;
/******************************************************************************
| Global variable definitions   (scope: module-exported)
-----------------------------------------------------------------------------*/


/******************************************************************************
| Global variable definitions   (scope: module-local)
-----------------------------------------------------------------------------*/

/******************************************************************************
| Function prototypes           (scope: module-local)
-----------------------------------------------------------------------------*/
void GetAdcRawValues(measModule_t *ptr, ADC_RAW_DATA_T *rawData);
/******************************************************************************
| Function implementations      (scope: module-local)
-----------------------------------------------------------------------------*/

/******************************************************************************
| Function implementations      (scope: module-exported)
-----------------------------------------------------------------------------*/

/**************************************************************************//*!
@brief			Measurement module software initialisation 

@param[in,out]  *ptr

@return		# true - when Module initialisation ended successfully
            # false - when Module initialisation is ongoing, or error occurred

@details	Clear variables needed for both calibration as well as run time
			measurement. 

@note		It is not inteded to be executed when application is in run mode.

@warning
******************************************************************************/
tBool Meas_Clear(measModule_t *ptr)
{
    ptr->measured.f16PhA.filt   = 0x0;
    ptr->measured.f16PhA.raw    = 0x0;
    ptr->measured.f16PhB.filt   = 0x0;
    ptr->measured.f16PhB.raw    = 0x0;
    ptr->measured.f16PhC.filt   = 0x0;
    ptr->measured.f16PhC.raw    = 0x0;
    ptr->measured.f16Udcb.filt  = 0x0;
    ptr->measured.f16Udcb.raw   = 0x0;
    ptr->measured.f16Temp.filt  = 0x0;
    ptr->measured.f16Temp.raw   = 0x0;
    ptr->measured.f16Idcb.filt  = 0x0;
    ptr->measured.f16Idcb.raw   = 0x0;

    ptr->offset.f16Idcb.f16Offset = 0;    
    
    ptr->flag.R             	= 0x0;

    ptr->param.u16CalibSamples  = 0;
    ptr->flag.B.calibInitDone   = 0;
    ptr->flag.B.calibDone       = 0;

    return 1;
}

/**************************************************************************//*!
@brief      3Phase current measurement software callibration routine.

@param[in,out]  *ptr    	Pointer to structure of measurement module variables and
                        	parameters
@param[in]      svmSector	Space Vector Modulation Secotr

@return     # true - when Calibration ended successfully
            # false - when Calibration is ongoing

@details    This function performs offset callibration for 3 phase current measurement
			performed on single dc link shunt resistor. It is not intended to be 
			executed when application is in run mode.

@warning
******************************************************************************/
tBool Meas_CalibCurrentSense(measModule_t *ptr, tU16 svmSector)
{
	ADC_RAW_DATA_T 	rawValues;
		
	if (!(ptr->flag.B.calibInitDone))
	{
		ptr->calibCntr = 1<< (ptr->param.u16CalibSamples + 4); // +4 in order to accommodate settling time of the filter

		ptr->offset.f16Idcb.filtParam.f32Acc	= 0x0;

		ptr->flag.B.calibDone       = 0;
		ptr->flag.B.calibInitDone   = 1;
	}

	if (!(ptr->flag.B.calibDone))
	{
		/* --------------------------------------------------------------
		 * OpAmp0 - DC offset data filtering using MA recursive filter
		 * ------------------------------------------------------------ */
		
		GetAdcRawValues(ptr, &rawValues);
				
		GDFLIB_FilterMA_F16(rawValues.ph2.f16Arg1, &ptr->offset.f16Idcb.filtParam);

		if ((--ptr->calibCntr)<=0)
		{
			ptr->flag.B.calibDone       = 1;    // end of DC offset calibration
			ptr->offset.f16Idcb.f16Offset = GDFLIB_FilterMA_F16(rawValues.ph2.f16Arg1, &ptr->offset.f16Idcb.filtParam);
		}
	}
	
	return (ptr->flag.B.calibDone);
}


/**************************************************************************//*!
@brief      3-phase current measurement reading.

@param[in,out]  *ptr    	Pointer to structure of module variables and
                        	parameters
                *i			Reconstructed 3Ph currents
                svmSector	Space Vector Modulation Secotr

@return     # true - when measurement ended successfully
            # false - when measurement is ongoing, or error occurred.

@details    This function performs measurement of three phase currents from
            single shunt resistors.

@note

@warning
******************************************************************************/
tBool Meas_Get3PhCurrent(measModule_t *ptr, SWLIBS_3Syst_F16 *i,  tU16 svmSector)
{
	volatile SWLIBS_2Syst_F16	avgValue;
	ADC_RAW_DATA_T 			rawValues;
	SWLIBS_3Syst_F16		raw;
	static tU16				sectorK_1 = 2;
	
	GetAdcRawValues(ptr, &rawValues);
	
	avgValue.f16Arg1    = (((rawValues.ph1.f16Arg1)>>1) + ((rawValues.ph1.f16Arg2)>>1));
	avgValue.f16Arg2    = (((rawValues.ph2.f16Arg1)>>1) + ((rawValues.ph2.f16Arg2)>>1));

	switch (sectorK_1){    
	case 1:
			/* direct sensing of U, -W, calculation of V */
			raw.f16Arg1 = avgValue.f16Arg1;
			raw.f16Arg3 = avgValue.f16Arg2;

			i->f16Arg1 = raw.f16Arg1;
			i->f16Arg3 = -raw.f16Arg3;
			i->f16Arg2 = MLIB_SubSat_F16(MLIB_NegSat_F16(i->f16Arg3),i->f16Arg1);

			break;
		case 2:
			/* direct sensing of V, -W, calculation of U */
			raw.f16Arg2 = avgValue.f16Arg1;
			raw.f16Arg3 = avgValue.f16Arg2;

			i->f16Arg2 = raw.f16Arg2;
			i->f16Arg3 = -raw.f16Arg3;
			i->f16Arg1 = MLIB_SubSat_F16(MLIB_NegSat_F16(i->f16Arg2),i->f16Arg3);
			break;
		case 3:
			/* direct sensing of V, -U, calculation of W */
			raw.f16Arg2 = avgValue.f16Arg1;
			raw.f16Arg1 = avgValue.f16Arg2;

			i->f16Arg2 = raw.f16Arg2;
			i->f16Arg1 = -raw.f16Arg1;
			i->f16Arg3 = MLIB_SubSat_F16(MLIB_NegSat_F16(i->f16Arg2),i->f16Arg1);
			break;
		case 4:
			/* direct sensing of W, -U, calculation of V */
			raw.f16Arg3 = avgValue.f16Arg1;
			raw.f16Arg1 = avgValue.f16Arg2;

			i->f16Arg3 = raw.f16Arg3;
			i->f16Arg1 = -raw.f16Arg1;
			i->f16Arg2 = MLIB_SubSat_F16(MLIB_NegSat_F16(i->f16Arg3),i->f16Arg1);
			break;
		case 5:
			/* direct sensing of W, -V, calculation of U */
			raw.f16Arg3 = avgValue.f16Arg1;
			raw.f16Arg2 = avgValue.f16Arg2;

			i->f16Arg3 = raw.f16Arg3;
			i->f16Arg2 = -raw.f16Arg2;
			i->f16Arg1 = MLIB_SubSat_F16(MLIB_NegSat_F16(i->f16Arg3),i->f16Arg2);
			break;
		case 6:
			/* direct sensing of U, -V, calculation of W */
			raw.f16Arg1 = avgValue.f16Arg1;
			raw.f16Arg2 = avgValue.f16Arg2;

			i->f16Arg1 = raw.f16Arg1;
			i->f16Arg2 = -raw.f16Arg2;
			i->f16Arg3 = MLIB_SubSat_F16(MLIB_NegSat_F16(i->f16Arg1),i->f16Arg2);
			break;
		default:
			break;
	}

	sectorK_1 = svmSector;

	return(1);
}


/***************************************************************************//*!
@brief Read raw values from adc and remove offset obtained in calibration function 

@param[in,out]  *ptr    	Pointer to structure of module variables and
                        	parameters
                *rawData    Samples corresponding to the same phase

@return         void

@details
******************************************************************************/
void GetAdcRawValues(measModule_t *ptr, ADC_RAW_DATA_T *rawData)
{
	volatile tU8 readFromList = 0;
	
    readFromList = (((*(volatile tU8 *)(0x0600 + 0x0010)))>>6) & 0x01;
    //readFromList  ^= (1 << 0);
    
    /* removing DC shift of 2.5V ~ OX7FFF  */
    rawData->ph1.f16Arg1    = (tFrac16)(ADC0ResultList[readFromList][0]) - (tFrac16)0x7FFF - (tFrac16)ptr->offset.f16Idcb.f16Offset;
    rawData->ph2.f16Arg1    = (tFrac16)(ADC0ResultList[readFromList][1]) - (tFrac16)0x7FFF - (tFrac16)ptr->offset.f16Idcb.f16Offset;

    rawData->dcOffset       = 0;//((tFrac32)(ADC0ResultList[readFromList][2]) - (tFrac32)0x7FFF)<<16;

    rawData->ph2.f16Arg2    = (tFrac16)(ADC0ResultList[readFromList][2]) - (tFrac16)0x7FFF - (tFrac16)ptr->offset.f16Idcb.f16Offset;
    rawData->ph1.f16Arg2    = (tFrac16)(ADC0ResultList[readFromList][3]) - (tFrac16)0x7FFF - (tFrac16)ptr->offset.f16Idcb.f16Offset;
}


/**************************************************************************//*!
@brief      DCB Voltage measurement routine.

@param[in,out]  *ptr    Pointer to structure of module variables and
                        parameters

@return     # true - when measurement ended successfully
            # false - when measurement is ongoing, or error occurred.

@details    This function performs measurement of DCBus Voltage.
            
@note

@warning
******************************************************************************/
tBool Meas_GetUdcVoltage(measModule_t *ptr, GDFLIB_FILTER_IIR1_T_F16 *uDcbFilter)
{
	ptr->measured.f16Udcb.raw   = ADC1ResultList[0][0]>>1;
	ptr->measured.f16Udcb.filt  = GDFLIB_FilterIIR1_F16(ptr->measured.f16Udcb.raw, uDcbFilter);

    return(1);
}



/**************************************************************************//*!
@brief      Temperature measurement routine.

@param[in,out]  *ptr    Pointer to structure of module variables and
                        parameters

@return     # true - when measurement ended successfully
            # false - when measurement is ongoing, or error occurred.

@details    This function performs measurement of System temperature.
            
@note

@warning
******************************************************************************/
tBool Meas_GetTemperature(measModule_t *ptr)
{
	ptr->measured.f16Temp.raw = (tFrac16)(ADC1ResultList[0][1]);
	ptr->measured.f16Temp.filt = MLIB_Mul_F16(ptr->measured.f16Temp.raw,FRAC16(0.73801));
	ptr->measured.f16Temp.filt = MLIB_Sub_F16(ptr->measured.f16Temp.filt, FRAC16(0.23801));
	ptr->measured.f16Temp.filt = ptr->measured.f16Temp.filt>>2;
    return(1);
}


/* End of file */
