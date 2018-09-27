/******************************************************************************
*
* Copyright 2006-2015 Freescale Semiconductor, Inc.
* Copyright 2016-2017 NXP
*
******************************************************************************/
/*!
*
* @file     adc.c
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
#include "adc.h"


/******************************************************************************
* Global adc variables definition
******************************************************************************/
/****
 * CMD_SEL[1:0]:
 * 00 normal conversion
 * 40 end of sequence
 * 80 end of list, wrap to top, continue
 * C0 end of list, stop
 *
 */

/*
!!!!
ADC reference source VRL[1:0] and VRH[1:0] mapping is incorrect
The mapping of the ADC reference sources as specified In the device section of the reference manual is incorrect.
The mapping on the device is the other way around, namely:
VRL[0] is mapped to PAD7 (specified VSSA)
VRL[1] is mapped to VSSA (specified PAD7)
VRH[0] is mapped to PAD8 (specified VDDA)
VRH[1] is mapped to VDDA (specified PAD8)


ADC0:
internal_7 = channel 0x0F: MCU.PADS.SUPPLIES.VSSA.vssx_int
internal_6 = channel 0x0E: MCU.PADS.SUPPLIES.VSSA.vssx_int
internal_5 = channel 0x0D: MCU.PADS.SUPPLIES.VSSA.vssx_int
internal_4 = channel 0x0C: MCU.PADS.VSUP_SENSE.ipp_ina
internal_3 = channel 0x0B: MCU.CORE.FET_PREDRV.CONTROL.fp_hd_outa
internal_2 = channel 0x0A: MCU.CORE.FET_PREDRV.CONTROL.fp_phase_outa
internal_1 = channel 0x09: MCU.CORE.CPMU_UHV.VREG_AUTO.VREG_AUTO_MAIN.vreg_auto_outa
internal_0 = channel 0x08: MCU.CORE.ADC0.ADC.adc_temp_sense_out

ADC1:
internal_7 = channel 0x0F: MCU.PADS.SUPPLIES.VSSA.vssx_int
internal_6 = channel 0x0E: MCU.PADS.SUPPLIES.VSSA.vssx_int
internal_5 = channel 0x0D: MCU.CORE.CPMU_UHV.VREG_AUTO.VREG_AUTO_MAIN.vddf
internal_4 = channel 0x0C: MCU.CORE.LINPHY.analog_module.linphy_tempsense_pnp
internal_3 = channel 0x0B: MCU.CORE.FET_PREDRV.CONTROL.fp_hd_outa
internal_2 = channel 0x0A: MCU.CORE.FET_PREDRV.CONTROL.fp_phase_outa
internal_1 = channel 0x09: MCU.CORE.CPMU_UHV.VREG_AUTO.VREG_AUTO_MAIN.vreg_auto_outa
internal_0 = channel 0x08: MCU.CORE.ADC1.ADC.adc_temp_sense_out
*/
PR_SECTION(adcLists)
  volatile char ADC0CommandList[COMMAND_NO][COMMAND_LENGTH] = {
	  {0x40,0xD0,0x00,0x00},	// end of sequence [40], current sense channel [D0] - dc bus current on op-amp0
	  {0x40,0xD0,0x00,0x00},	// end of sequence [40], current sense channel [D0] - dc bus current on op-amp0
	  {0x40,0xD0,0x00,0x00},	// end of sequence [40], current sense channel [D0] - dc bus current on op-amp0
	  {0xC0,0xD0,0x00,0x00},	// end of list + no int [C0], current sense channel [D0] - dc bus current on op-amp0
	  {0x00,0x00,0x00,0x00},
	  {0x00,0x00,0x00,0x00},
	  {0x00,0x00,0x00,0x00},
      {0x00,0x00,0x00,0x00}
  };

  volatile char ADC1CommandList[COMMAND_NO][COMMAND_LENGTH] = {
	  {0x40,0xCB,0x00,0x00},	// end of sequence + no int [40], DC-Link VOltage
	  {0x40,0xC9,0x00,0x00},	// end of sequence + no int [40], TEMP [C9], 4 clock cycles sample time [00], reserved [00]	
	  {0xC0,0xCA,0x00,0x00},	// end of list + no int [C0], phase voltage [CA]
	  {0x00,0x00,0x00,0x00},	
	  {0x00,0x00,0x00,0x00},	
	  {0x00,0x00,0x00,0x00},
	  {0x00,0x00,0x00,0x00},
	  {0x00,0x00,0x00,0x00}
  };

  volatile unsigned short ADC0ResultList[2][RESULT_NO] = {{32758, 32758, 32758, 32758, 0, 0, 0, 0},{32758, 32758, 32758, 32758, 0, 0, 0, 0}};
  volatile unsigned short ADC1ResultList[2][RESULT_NO] = {{32758, 0, 0, 0, 0, 0, 0, 0},{0, 0, 0, 0, 0, 0, 0, 0}};
PR_SECTION(DEFAULT_SEC)

/******************************************************************************
* adc MACRO definitions
******************************************************************************/


/******************************************************************************
* adc registers bit definition
******************************************************************************/


/******************************************************************************
* Functions Definitions
*******************************************************************************/
void adc0_init(void)
{
	  ADC0CTL_0_ACC_CFG = 3;      // Dual access mode
	  ADC0CTL_0_STR_SEQA = 1;     // Store result at abort/restart
	  ADC0CTL_1_CSL_BMOD = 0; 	  // Command list is single buffered
	  ADC0CTL_1_RVL_BMOD = 1; 	  // Result list is double buffered

	  ADC0TIM = 2;                // clock: clk = fbus [50 MHz] / (2x(reg.value + 1)) [0.25 - 8.33MHz]; 2 => 8.33 MHZ @ 50 MHz bus clock !_!

	  ADC0FMT_DJM = 0;            // Left justified result data
	  ADC0FMT_SRES = 4;           // 12-bit result

	  // ADC0 Command Base Pointer
	  ADC0CBP = ADC0CommandList;
	  // ADC0 Result Base Pointer
	  ADC0RBP = ADC0ResultList;
	  
	  // ADC0 Command/Result Offset registers
	  ADC0CROFF1 = (unsigned char)(((unsigned long)&ADC0ResultList[1][0] - (unsigned long)&ADC0ResultList[0][0])>>1);

	  ADC0CTL_0_ADC_EN = 1;       // enable ADC0
	  ADC0EIE = 0xEE;     		  // enable all errors interrupts
}


void adc1_init(void)
{
  ADC1CTL_0_ACC_CFG = 3;      // Dual access mode
  ADC1CTL_0_ACC_CFG = 3;      // Dual access mode
  ADC1CTL_0_STR_SEQA = 1;     // Store result at abort/restart

  ADC1TIM = 2;                // clock: clk = fbus [50 MHz] / (2x(reg.value + 1)) [0.25 - 8.33MHz]; 2 => 8.33 MHZ @ 50 MHz bus clock !_!
  ADC1FMT_DJM = 0;            // left justified result data
  ADC1FMT_SRES = 4;           // 12-bit result

  ADC1CONIE_1_CON_IE1 = 0;	  // End of sequence interrupt enable
  
  // ADC1 Command Base Pointer
  ADC1CBP = ADC1CommandList;
  // ADC1 Result Base Pointer
  ADC1RBP = ADC1ResultList;

  // ADC1 Command/Result Offset registers
  ADC1CROFF1 = 0;

  ADC1CTL_0_ADC_EN = 1;       // enable ADC1
  ADC1EIE = 0xEE;             // enable all error interrupts
}
