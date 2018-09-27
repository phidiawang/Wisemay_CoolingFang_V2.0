/******************************************************************************
*
* Copyright 2006-2015 Freescale Semiconductor, Inc.
* Copyright 2016-2017 NXP
*
******************************************************************************/
/*!
*
* @file     vector.c
*
* @date     Mar-12-2013
*
* @brief    This file contains a table of ISRs in software (SW) vector
*           mode.
*
*******************************************************************************/
#include "S12ZVM_devconfig.h"


typedef void (* vecAddress)();


typedef struct typeVect
{
	char dummy;
	vecAddress Address;
}typeVect;

/*******************************************************************************
* Local Function Prototypes
*******************************************************************************/
void dummy (void);
void STARTUP_FCN(void);

/*******************************************************************************
* Global ISR Function Prototypes
*******************************************************************************/
/*
#ifdef IRQ_OFF_0_FCN
  extern void IRQ_OFF_0_FCN();
#endif

#ifdef IRQ_OFF_4_FCN
  extern void IRQ_OFF_4_FCN();
#endif

#ifdef IRQ_OFF_8_FCN
  extern void IRQ_OFF_8_FCN();
#endif

#ifdef IRQ_OFF_C_FCN
  extern void IRQ_OFF_C_FCN();
#endif
*/
#ifdef IRQ_OFF_10_FCN
  extern void IRQ_OFF_10_FCN();
#endif

#ifdef IRQ_OFF_14_FCN
  extern void IRQ_OFF_14_FCN();
#endif

#ifdef IRQ_OFF_18_FCN
  extern void IRQ_OFF_18_FCN();
#endif

#ifdef IRQ_OFF_1C_FCN
  extern void IRQ_OFF_1C_FCN();
#endif

#ifdef IRQ_OFF_20_FCN
  extern void IRQ_OFF_20_FCN();
#endif

#ifdef IRQ_OFF_24_FCN
  extern void IRQ_OFF_24_FCN();
#endif

#ifdef IRQ_OFF_28_FCN
  extern void IRQ_OFF_28_FCN();
#endif

#ifdef IRQ_OFF_2C_FCN
  extern void IRQ_OFF_2C_FCN();
#endif

#ifdef IRQ_OFF_30_FCN
  extern void IRQ_OFF_30_FCN();
#endif

#ifdef IRQ_OFF_34_FCN
  extern void IRQ_OFF_34_FCN();
#endif

#ifdef IRQ_OFF_38_FCN
  extern void IRQ_OFF_38_FCN();
#endif

#ifdef IRQ_OFF_3C_FCN
  extern void IRQ_OFF_3C_FCN();
#endif

#ifdef IRQ_OFF_40_FCN
  extern void IRQ_OFF_40_FCN();
#endif

#ifdef IRQ_OFF_44_FCN
  extern void IRQ_OFF_44_FCN();
#endif

#ifdef IRQ_OFF_48_FCN
  extern void IRQ_OFF_48_FCN();
#endif

#ifdef IRQ_OFF_4C_FCN
  extern void IRQ_OFF_4C_FCN();
#endif

#ifdef IRQ_OFF_50_FCN
  extern void IRQ_OFF_50_FCN();
#endif

#ifdef IRQ_OFF_54_FCN
  extern void IRQ_OFF_54_FCN();
#endif

#ifdef IRQ_OFF_58_FCN
  extern void IRQ_OFF_58_FCN();
#endif

#ifdef IRQ_OFF_5C_FCN
  extern void IRQ_OFF_5C_FCN();
#endif

#ifdef IRQ_OFF_60_FCN
  extern void IRQ_OFF_60_FCN();
#endif

#ifdef IRQ_OFF_64_FCN
  extern void IRQ_OFF_64_FCN();
#endif

#ifdef IRQ_OFF_68_FCN
  extern void IRQ_OFF_68_FCN();
#endif

#ifdef IRQ_OFF_6C_FCN
  extern void IRQ_OFF_6C_FCN();
#endif

#ifdef IRQ_OFF_70_FCN
  extern void IRQ_OFF_70_FCN();
#endif

#ifdef IRQ_OFF_74_FCN
  extern void IRQ_OFF_74_FCN();
#endif

#ifdef IRQ_OFF_78_FCN
  extern void IRQ_OFF_78_FCN();
#endif

#ifdef IRQ_OFF_7C_FCN
  extern void IRQ_OFF_7C_FCN();
#endif

#ifdef IRQ_OFF_80_FCN
  extern void IRQ_OFF_80_FCN();
#endif

#ifdef IRQ_OFF_84_FCN
  extern void IRQ_OFF_84_FCN();
#endif

#ifdef IRQ_OFF_88_FCN
  extern void IRQ_OFF_88_FCN();
#endif

#ifdef IRQ_OFF_8C_FCN
  extern void IRQ_OFF_8C_FCN();
#endif

#ifdef IRQ_OFF_90_FCN
  extern void IRQ_OFF_90_FCN();
#endif

#ifdef IRQ_OFF_94_FCN
  extern void IRQ_OFF_94_FCN();
#endif

#ifdef IRQ_OFF_98_FCN
  extern void IRQ_OFF_98_FCN();
#endif

#ifdef IRQ_OFF_9C_FCN
  extern void IRQ_OFF_9C_FCN();
#endif

#ifdef IRQ_OFF_A0_FCN
  extern void IRQ_OFF_A0_FCN();
#endif

#ifdef IRQ_OFF_A4_FCN
  extern void IRQ_OFF_A4_FCN();
#endif

#ifdef IRQ_OFF_A8_FCN
  extern void IRQ_OFF_A8_FCN();
#endif

#ifdef IRQ_OFF_AC_FCN
  extern void IRQ_OFF_AC_FCN();
#endif

#ifdef IRQ_OFF_B0_FCN
  extern void IRQ_OFF_B0_FCN();
#endif

#ifdef IRQ_OFF_B4_FCN
  extern void IRQ_OFF_B4_FCN();
#endif

#ifdef IRQ_OFF_B8_FCN
  extern void IRQ_OFF_B8_FCN();
#endif

#ifdef IRQ_OFF_BC_FCN
  extern void IRQ_OFF_BC_FCN();
#endif

#ifdef IRQ_OFF_C0_FCN
  extern void IRQ_OFF_C0_FCN();
#endif

#ifdef IRQ_OFF_C4_FCN
  extern void IRQ_OFF_C4_FCN();
#endif

#ifdef IRQ_OFF_C8_FCN
  extern void IRQ_OFF_C8_FCN();
#endif

#ifdef IRQ_OFF_CC_FCN
  extern void IRQ_OFF_CC_FCN();
#endif

#ifdef IRQ_OFF_D0_FCN
  extern void IRQ_OFF_D0_FCN();
#endif

#ifdef IRQ_OFF_D4_FCN
  extern void IRQ_OFF_D4_FCN();
#endif

#ifdef IRQ_OFF_D8_FCN
  extern void IRQ_OFF_D8_FCN();
#endif

#ifdef IRQ_OFF_DC_FCN
  extern void IRQ_OFF_DC_FCN();
#endif

#ifdef IRQ_OFF_E0_FCN
  extern void IRQ_OFF_E0_FCN();
#endif

#ifdef IRQ_OFF_E4_FCN
  extern void IRQ_OFF_E4_FCN();
#endif

#ifdef IRQ_OFF_E8_FCN
  extern void IRQ_OFF_E8_FCN();
#endif

#ifdef IRQ_OFF_EC_FCN
  extern void IRQ_OFF_EC_FCN();
#endif

#ifdef IRQ_OFF_F0_FCN
  extern void IRQ_OFF_F0_FCN();
#endif

#ifdef IRQ_OFF_F4_FCN
  extern void IRQ_OFF_F4_FCN();
#endif

#ifdef IRQ_OFF_F8_FCN
  extern void IRQ_OFF_F8_FCN();
#endif

#ifdef IRQ_OFF_FC_FCN
  extern void IRQ_OFF_FC_FCN();
#endif

#ifdef IRQ_OFF_100_FCN
  extern void IRQ_OFF_100_FCN();
#endif

#ifdef IRQ_OFF_104_FCN
  extern void IRQ_OFF_104_FCN();
#endif

#ifdef IRQ_OFF_108_FCN
  extern void IRQ_OFF_108_FCN();
#endif

#ifdef IRQ_OFF_10C_FCN
  extern void IRQ_OFF_10C_FCN();
#endif

#ifdef IRQ_OFF_110_FCN
  extern void IRQ_OFF_110_FCN();
#endif

#ifdef IRQ_OFF_114_FCN
  extern void IRQ_OFF_114_FCN();
#endif

#ifdef IRQ_OFF_118_FCN
  extern void IRQ_OFF_118_FCN();
#endif

#ifdef IRQ_OFF_11C_FCN
  extern void IRQ_OFF_11C_FCN();
#endif

#ifdef IRQ_OFF_120_FCN
  extern void IRQ_OFF_120_FCN();
#endif

#ifdef IRQ_OFF_124_FCN
  extern void IRQ_OFF_124_FCN();
#endif

#ifdef IRQ_OFF_128_FCN
  extern void IRQ_OFF_128_FCN();
#endif

#ifdef IRQ_OFF_12C_FCN
  extern void IRQ_OFF_12C_FCN();
#endif

#ifdef IRQ_OFF_130_FCN
  extern void IRQ_OFF_130_FCN();
#endif

#ifdef IRQ_OFF_134_FCN
  extern void IRQ_OFF_134_FCN();
#endif

#ifdef IRQ_OFF_138_FCN
  extern void IRQ_OFF_138_FCN();
#endif

#ifdef IRQ_OFF_13C_FCN
  extern void IRQ_OFF_13C_FCN();
#endif

#ifdef IRQ_OFF_140_FCN
  extern void IRQ_OFF_140_FCN();
#endif

#ifdef IRQ_OFF_144_FCN
  extern void IRQ_OFF_144_FCN();
#endif

#ifdef IRQ_OFF_148_FCN
  extern void IRQ_OFF_148_FCN();
#endif

#ifdef IRQ_OFF_14C_FCN
  extern void IRQ_OFF_14C_FCN();
#endif

#ifdef IRQ_OFF_150_FCN
  extern void IRQ_OFF_150_FCN();
#endif

#ifdef IRQ_OFF_154_FCN
  extern void IRQ_OFF_154_FCN();
#endif

#ifdef IRQ_OFF_158_FCN
  extern void IRQ_OFF_158_FCN();
#endif

#ifdef IRQ_OFF_15C_FCN
  extern void IRQ_OFF_15C_FCN();
#endif

#ifdef IRQ_OFF_160_FCN
  extern void IRQ_OFF_160_FCN();
#endif

#ifdef IRQ_OFF_164_FCN
  extern void IRQ_OFF_164_FCN();
#endif

#ifdef IRQ_OFF_168_FCN
  extern void IRQ_OFF_168_FCN();
#endif

#ifdef IRQ_OFF_16C_FCN
  extern void IRQ_OFF_16C_FCN();
#endif

#ifdef IRQ_OFF_170_FCN
  extern void IRQ_OFF_170_FCN();
#endif

#ifdef IRQ_OFF_174_FCN
  extern void IRQ_OFF_174_FCN();
#endif

#ifdef IRQ_OFF_178_FCN
  extern void IRQ_OFF_178_FCN();
#endif

#ifdef IRQ_OFF_17C_FCN
  extern void IRQ_OFF_17C_FCN();
#endif

#ifdef IRQ_OFF_180_FCN
  extern void IRQ_OFF_180_FCN();
#endif

#ifdef IRQ_OFF_184_FCN
  extern void IRQ_OFF_184_FCN();
#endif

#ifdef IRQ_OFF_188_FCN
  extern void IRQ_OFF_188_FCN();
#endif

#ifdef IRQ_OFF_18C_FCN
  extern void IRQ_OFF_18C_FCN();
#endif

#ifdef IRQ_OFF_190_FCN
  extern void IRQ_OFF_190_FCN();
#endif

#ifdef IRQ_OFF_194_FCN
  extern void IRQ_OFF_194_FCN();
#endif

#ifdef IRQ_OFF_198_FCN
  extern void IRQ_OFF_198_FCN();
#endif

#ifdef IRQ_OFF_19C_FCN
  extern void IRQ_OFF_19C_FCN();
#endif

#ifdef IRQ_OFF_1A0_FCN
  extern void IRQ_OFF_1A0_FCN();
#endif

#ifdef IRQ_OFF_1A4_FCN
  extern void IRQ_OFF_1A4_FCN();
#endif

#ifdef IRQ_OFF_1A8_FCN
  extern void IRQ_OFF_1A8_FCN();
#endif

#ifdef IRQ_OFF_1AC_FCN
  extern void IRQ_OFF_1AC_FCN();
#endif

#ifdef IRQ_OFF_1B0_FCN
  extern void IRQ_OFF_1B0_FCN();
#endif

#ifdef IRQ_OFF_1B4_FCN
  extern void IRQ_OFF_1B4_FCN();
#endif

#ifdef IRQ_OFF_1B8_FCN
  extern void IRQ_OFF_1B8_FCN();
#endif

#ifdef IRQ_OFF_1BC_FCN
  extern void IRQ_OFF_1BC_FCN();
#endif

#ifdef IRQ_OFF_1C0_FCN
  extern void IRQ_OFF_1C0_FCN();
#endif

#ifdef IRQ_OFF_1C4_FCN
  extern void IRQ_OFF_1C4_FCN();
#endif

#ifdef IRQ_OFF_1C8_FCN
  extern void IRQ_OFF_1C8_FCN();
#endif

#ifdef IRQ_OFF_1CC_FCN
  extern void IRQ_OFF_1CC_FCN();
#endif

#ifdef IRQ_OFF_1D0_FCN
  extern void IRQ_OFF_1D0_FCN();
#endif

#ifdef IRQ_OFF_1D4_FCN
  extern void IRQ_OFF_1D4_FCN();
#endif

#ifdef IRQ_OFF_1D8_FCN
  extern void IRQ_OFF_1D8_FCN();
#endif

#ifdef IRQ_OFF_1DC_FCN
  extern void IRQ_OFF_1DC_FCN();
#endif

#ifdef IRQ_OFF_1E0_FCN
  extern void IRQ_OFF_1E0_FCN();
#endif

#ifdef IRQ_OFF_1E4_FCN
  extern void IRQ_OFF_1E4_FCN();
#endif

#ifdef IRQ_OFF_1E8_FCN
  extern void IRQ_OFF_1E8_FCN();
#endif

#ifdef IRQ_OFF_1EC_FCN
  extern void IRQ_OFF_1EC_FCN();
#endif

#ifdef IRQ_OFF_1F0_FCN
  extern void IRQ_OFF_1F0_FCN();
#endif

#ifdef IRQ_OFF_1F4_FCN
  extern void IRQ_OFF_1F4_FCN();
#endif

#ifdef IRQ_OFF_1F8_FCN
  extern void IRQ_OFF_1F8_FCN();
#endif

#ifdef IRQ_OFF_1FC_FCN
  extern void IRQ_OFF_1FC_FCN();
#endif

//#pragma section const {vector}
//#pragma CONST_SEG vector
PR_CONST_SECTION(vector)
const typeVect _vectab[] = {

//  #ifdef IRQ_OFF_0_FCN           /*0                    0xFFFE00 + 0*/
//    IRQ_OFF_0_FCN,
//  #else
//    dummy,
//  #endif
//  #ifdef IRQ_OFF_4_FCN           /*0                    0xFFFE00 + 4*/
//    IRQ_OFF_4_FCN,
//  #else
//    dummy,
//  #endif
//  #ifdef IRQ_OFF_8_FCN           /*0                    0xFFFE00 + 8*/
//    IRQ_OFF_8_FCN,
//  #else
//    dummy,
//  #endif
//  #ifdef IRQ_OFF_C_FCN           /*0                    0xFFFE00 + C*/
//    IRQ_OFF_C_FCN,
//  #else
//    dummy,
//  #endif
  { 0x00 , 
  #ifdef IRQ_OFF_10_FCN          /*0                    0xFFFE00 + 10*/
    IRQ_OFF_10_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_14_FCN          /*0                    0xFFFE00 + 14*/
    IRQ_OFF_14_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_18_FCN          /*0                    0xFFFE00 + 18*/
    IRQ_OFF_18_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1C_FCN          /*0                    0xFFFE00 + 1C*/
    IRQ_OFF_1C_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_20_FCN          /*0                    0xFFFE00 + 20*/
    IRQ_OFF_20_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_24_FCN          /*0                    0xFFFE00 + 24*/
    IRQ_OFF_24_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_28_FCN          /*0                    0xFFFE00 + 28*/
    IRQ_OFF_28_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_2C_FCN          /*0                    0xFFFE00 + 2C*/
    IRQ_OFF_2C_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_30_FCN          /*0                    0xFFFE00 + 30*/
    IRQ_OFF_30_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_34_FCN          /*0                    0xFFFE00 + 34*/
    IRQ_OFF_34_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_38_FCN          /*0                    0xFFFE00 + 38*/
    IRQ_OFF_38_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_3C_FCN          /*0                    0xFFFE00 + 3C*/
    IRQ_OFF_3C_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_40_FCN          /*0                    0xFFFE00 + 40*/
    IRQ_OFF_40_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_44_FCN          /*0                    0xFFFE00 + 44*/
    IRQ_OFF_44_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_48_FCN          /*0                    0xFFFE00 + 48*/
    IRQ_OFF_48_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_4C_FCN          /*0                    0xFFFE00 + 4C*/
    IRQ_OFF_4C_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_50_FCN          /*0                    0xFFFE00 + 50*/
    IRQ_OFF_50_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_54_FCN          /*0                    0xFFFE00 + 54*/
    IRQ_OFF_54_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_58_FCN          /*0                    0xFFFE00 + 58*/
    IRQ_OFF_58_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_5C_FCN          /*0                    0xFFFE00 + 5C*/
    IRQ_OFF_5C_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_60_FCN          /*0                    0xFFFE00 + 60*/
    IRQ_OFF_60_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_64_FCN          /*0                    0xFFFE00 + 64*/
    IRQ_OFF_64_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_68_FCN          /*0                    0xFFFE00 + 68*/
    IRQ_OFF_68_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_6C_FCN          /*0                    0xFFFE00 + 6C*/
    IRQ_OFF_6C_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_70_FCN          /*0                    0xFFFE00 + 70*/
    IRQ_OFF_70_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_74_FCN          /*0                    0xFFFE00 + 74*/
    IRQ_OFF_74_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_78_FCN          /*0                    0xFFFE00 + 78*/
    IRQ_OFF_78_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_7C_FCN          /*0                    0xFFFE00 + 7C*/
    IRQ_OFF_7C_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_80_FCN          /*0                    0xFFFE00 + 80*/
    IRQ_OFF_80_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_84_FCN          /*0                    0xFFFE00 + 84*/
    IRQ_OFF_84_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_88_FCN          /*0                    0xFFFE00 + 88*/
    IRQ_OFF_88_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_8C_FCN          /*0                    0xFFFE00 + 8C*/
    IRQ_OFF_8C_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_90_FCN          /*0                    0xFFFE00 + 90*/
    IRQ_OFF_90_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_94_FCN          /*0                    0xFFFE00 + 94*/
    IRQ_OFF_94_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_98_FCN          /*0                    0xFFFE00 + 98*/
    IRQ_OFF_98_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_9C_FCN          /*0                    0xFFFE00 + 9C*/
    IRQ_OFF_9C_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_A0_FCN          /*0                    0xFFFE00 + A0*/
    IRQ_OFF_A0_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_A4_FCN          /*0                    0xFFFE00 + A4*/
    IRQ_OFF_A4_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_A8_FCN          /*0                    0xFFFE00 + A8*/
    IRQ_OFF_A8_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_AC_FCN          /*0                    0xFFFE00 + AC*/
    IRQ_OFF_AC_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_B0_FCN          /*0                    0xFFFE00 + B0*/
    IRQ_OFF_B0_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_B4_FCN          /*0                    0xFFFE00 + B4*/
    IRQ_OFF_B4_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_B8_FCN          /*0                    0xFFFE00 + B8*/
    IRQ_OFF_B8_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_BC_FCN          /*0                    0xFFFE00 + BC*/
    IRQ_OFF_BC_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_C0_FCN          /*PMF RELOAD OVERUN    0xFFFE00 + C0*/
    IRQ_OFF_C0_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_C4_FCN          /*PMF FAULT            0xFFFE00 + C4*/
    IRQ_OFF_C4_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_C8_FCN          /*PMF Reload C         0xFFFE00 + C8*/
    IRQ_OFF_C8_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_CC_FCN          /*PMF Reload B         0xFFFE00 + CC*/
    IRQ_OFF_CC_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_D0_FCN          /*PMF Reload A         0xFFFE00 + D0*/
    IRQ_OFF_D0_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_D4_FCN          /*0                    0xFFFE00 + D4*/
    IRQ_OFF_D4_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_D8_FCN          /*0                    0xFFFE00 + D8*/
    IRQ_OFF_D8_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_DC_FCN          /*0                    0xFFFE00 + DC*/
    IRQ_OFF_DC_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_E0_FCN          /* PTU Trigger1 Done   0xFFFE00 + E0*/
    IRQ_OFF_E0_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_E4_FCN          /*PTU Trigger0 Done    0xFFFE00 + E4*/
    IRQ_OFF_E4_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_E8_FCN          /*PTU Trigger1 Error   0xFFFE00 + E8*/
    IRQ_OFF_E8_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_EC_FCN          /*PTU Trigger0 Error   0xFFFE00 + EC*/
    IRQ_OFF_EC_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_F0_FCN          /*PTU Reload Overrun   0xFFFE00 + F0*/
    IRQ_OFF_F0_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_F4_FCN          /*0                    0xFFFE00 + F4*/
    IRQ_OFF_F4_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_F8_FCN          /*0                    0xFFFE00 + F8*/
    IRQ_OFF_F8_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_FC_FCN          /*0                    0xFFFE00 + FC*/
    IRQ_OFF_FC_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_100_FCN                 /*0                    0xFFFE00 + 100*/
    IRQ_OFF_100_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_104_FCN                 /*0                    0xFFFE00 + 104*/
    IRQ_OFF_104_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_108_FCN                 /*0                    0xFFFE00 + 108*/
    IRQ_OFF_108_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_10C_FCN                 /*0                    0xFFFE00 + 10C*/
    IRQ_OFF_10C_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_110_FCN                 /*0                    0xFFFE00 + 110*/
    IRQ_OFF_110_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_114_FCN                 /*0                    0xFFFE00 + 114*/
    IRQ_OFF_114_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_118_FCN                 /*0                    0xFFFE00 + 118*/
    IRQ_OFF_118_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_11C_FCN                 /*0                    0xFFFE00 + 11C*/
    IRQ_OFF_11C_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_120_FCN                 /*0                    0xFFFE00 + 120*/
    IRQ_OFF_120_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_124_FCN                 /*0                    0xFFFE00 + 124*/
    IRQ_OFF_124_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_128_FCN                 /*0                    0xFFFE00 + 128*/
    IRQ_OFF_128_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_12C_FCN                 /*0                    0xFFFE00 + 12C*/
    IRQ_OFF_12C_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_130_FCN                 /*0                    0xFFFE00 + 130*/
    IRQ_OFF_130_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_134_FCN                 /*0                    0xFFFE00 + 134*/
    IRQ_OFF_134_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_138_FCN                 /*0                    0xFFFE00 + 138*/
    IRQ_OFF_138_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_13C_FCN                 /*0                    0xFFFE00 + 13C*/
    IRQ_OFF_13C_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_140_FCN                 /*0                    0xFFFE00 + 140*/
    IRQ_OFF_140_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_144_FCN                 /*0                    0xFFFE00 + 144*/
    IRQ_OFF_144_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_148_FCN                 /*0                    0xFFFE00 + 148*/
    IRQ_OFF_148_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_14C_FCN                 /*0                    0xFFFE00 + 14C*/
    IRQ_OFF_14C_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_150_FCN                 /*0                    0xFFFE00 + 150*/
    IRQ_OFF_150_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_154_FCN                 /*0                    0xFFFE00 + 154*/
    IRQ_OFF_154_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_158_FCN                 /*0                    0xFFFE00 + 158*/
    IRQ_OFF_158_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_15C_FCN                 /*0                    0xFFFE00 + 15C*/
    IRQ_OFF_15C_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_160_FCN                 /*0                    0xFFFE00 + 160*/
    IRQ_OFF_160_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_164_FCN                 /*0                    0xFFFE00 + 164*/
    IRQ_OFF_164_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_168_FCN                 /*0                    0xFFFE00 + 168*/
    IRQ_OFF_168_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_16C_FCN                 /*0                    0xFFFE00 + 16C*/
    IRQ_OFF_16C_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_170_FCN                 /*0                    0xFFFE00 + 170*/
    IRQ_OFF_170_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_174_FCN                 /*0                    0xFFFE00 + 174*/
    IRQ_OFF_174_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_178_FCN                 /*0                    0xFFFE00 + 178*/
    IRQ_OFF_178_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_17C_FCN                 /*0                    0xFFFE00 + 17C*/
    IRQ_OFF_17C_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_180_FCN                 /*0                    0xFFFE00 + 180*/
    IRQ_OFF_180_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_184_FCN                 /*0                    0xFFFE00 + 184*/
    IRQ_OFF_184_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_188_FCN                 /*0                    0xFFFE00 + 188*/
    IRQ_OFF_188_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_18C_FCN                 /*0                    0xFFFE00 + 18C*/
    IRQ_OFF_18C_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_190_FCN                 /*0                    0xFFFE00 + 190*/
    IRQ_OFF_190_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_194_FCN                 /*0                    0xFFFE00 + 194*/
    IRQ_OFF_194_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_198_FCN                 /*SCI1_ISR             0xFFFE00 + 198*/
    IRQ_OFF_198_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_19C_FCN                 /*SCI0_ISR             0xFFFE00 + 19C*/
    IRQ_OFF_19C_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1A0_FCN                 /*0                    0xFFFE00 + 1A0*/
    IRQ_OFF_1A0_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1A4_FCN                 /*0                    0xFFFE00 + 1A4*/
    IRQ_OFF_1A4_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1A8_FCN                 /*0                    0xFFFE00 + 1A8*/
    IRQ_OFF_1A8_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1AC_FCN                 /*0                    0xFFFE00 + 1AC*/
    IRQ_OFF_1AC_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1B0_FCN                 /*0                    0xFFFE00 + 1B0*/
    IRQ_OFF_1B0_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1B4_FCN                 /*0                    0xFFFE00 + 1B4*/
    IRQ_OFF_1B4_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1B8_FCN                 /*0                    0xFFFE00 + 1B8*/
    IRQ_OFF_1B8_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1BC_FCN                 /*0                    0xFFFE00 + 1BC*/
    IRQ_OFF_1BC_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1C0_FCN                 /*TIMchan3_ISR         0xFFFE00 + 1C0*/
    IRQ_OFF_1C0_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1C4_FCN                 /*TIMchan2_ISR         0xFFFE00 + 1C4*/
    IRQ_OFF_1C4_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1C8_FCN                 /*TIMchan1_ISR         0xFFFE00 + 1C8*/
    IRQ_OFF_1C8_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1CC_FCN                 /*TIMchan0_ISR         0xFFFE00 + 1CC*/
    IRQ_OFF_1CC_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1D0_FCN                 /*0                    0xFFFE00 + 1D0*/
    IRQ_OFF_1D0_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1D4_FCN                 /*0                    0xFFFE00 + 1D4*/
    IRQ_OFF_1D4_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1D8_FCN                 /*0                    0xFFFE00 + 1D8*/
    IRQ_OFF_1D8_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1DC_FCN                 /*0                    0xFFFE00 + 1DC*/
    IRQ_OFF_1DC_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1E0_FCN                 /*0                    0xFFFE00 + 1E0*/
    IRQ_OFF_1E0_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1E4_FCN                 /*0                    0xFFFE00 + 1E4*/
    IRQ_OFF_1E4_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1E8_FCN                 /*0                    0xFFFE00 + 1E8*/
    IRQ_OFF_1E8_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1EC_FCN                 /*0                    0xFFFE00 + 1EC*/
    IRQ_OFF_1EC_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1F0_FCN                 /*0                    0xFFFE00 + 1F0*/
    IRQ_OFF_1F0_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1F4_FCN                 /*0                    0xFFFE00 + 1F4*/
    IRQ_OFF_1F4_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
  #ifdef IRQ_OFF_1F8_FCN                 /*0                    0xFFFE00 + 1F8*/
    IRQ_OFF_1F8_FCN,
  #else
    dummy,
  #endif
  },{ 0x00 ,
   STARTUP_FCN
  }
};

/***************************************************************************//*!
*
* @brief    dummy interrupt function
*
* @param    void
*
* @return   none
*
* @details  Dummy function which is entered if any non-used vector is called
*******************************************************************************/
void dummy (void)
{
  //_asm("bgnd");
}

#pragma section const {security}
const char securityVal = 0xFE;

