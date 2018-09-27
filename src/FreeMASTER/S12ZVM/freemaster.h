/******************************************************************************
*
* Freescale Semiconductor Inc.
* (c) Copyright 2004-2012 Freescale Semiconductor
* ALL RIGHTS RESERVED.
*
****************************************************************************//*!
*
* @file   freemaster.h
*
* @brief  FreeMASTER Driver main API header file, HC(S)12(X) platform
*
* @version 1.0.1.0
* 
* @date Apr-27-2015
* 
*******************************************************************************
*
* This is the only header file needed to be included by the user application
* to implement the FreeMASTER interface. In addition, user has to write her 
* "freemaster_cfg.h" configuration file and put it anywhere on the #include path
*
*******************************************************************************/

#ifndef __FREEMASTER_H
#define __FREEMASTER_H

/* identify our current platform */
#define FMSTR_PLATFORM_HC12 1

/* FreeMASTER configuration */
#include "freemaster_defcfg.h"

/* Cosmic compiler defines only Large memory for FreeMASTER pointers ans memory
   access.*/
#if defined(__CSMC__) || defined(__S12Z__)      /* Cosmic or S12z compiler */
  #ifndef FMSTR_LARGE_MODEL
    #define FMSTR_LARGE_MODEL 1
  #endif
#else                                           /* CodeWarrior compiler */
/* HCS12X only: determine large/small model for FreeMASTER pointers and memory 
   access. The user may enable FMSTR_LARGE_MODEL model in configuration file
   even if project is configured for small or banked models. */
  #if defined(__HCS12X__)
    #ifndef FMSTR_LARGE_MODEL
      #if defined(__LARGE__)
      #define FMSTR_LARGE_MODEL 1
      #elif defined(__SMALL__) || defined(__BANKED__)
      #define FMSTR_LARGE_MODEL 0
      #else
      #error Unknown compiler memory model
      #endif
    #endif
  #else
    /* large driver model not implemented on HC12 or HCS12 */
    #ifndef FMSTR_LARGE_MODEL
    #define FMSTR_LARGE_MODEL 0
    #endif
    #if FMSTR_LARGE_MODEL
    #error Large FreeMASTER driver model possible on HCS12X only
    #endif
  #endif
#endif

/*****************************************************************************
* Global types
******************************************************************************/
#if defined(__CSMC__)                           /* Cosmic compiler */
  #if FMSTR_LARGE_MODEL
  typedef unsigned char * FMSTR_ADDR;           /* CPU address type (3bytes) */
  #else
  typedef unsigned char * FMSTR_ADDR;           /* CPU address type (3bytes) */
  #endif
#else                                           /* CodeWarrior compiler */
  #if defined(__S12Z__)
    typedef unsigned char* FMSTR_ADDR;          /* CPU address type (3bytes) */
  #else
    #if FMSTR_LARGE_MODEL
    typedef unsigned char* __far  FMSTR_ADDR;   /* CPU address type (3bytes) */
    #else
    typedef unsigned char* __near FMSTR_ADDR;   /* CPU address type (2bytes) */
    #endif
  #endif
#endif

typedef unsigned short FMSTR_SIZE;              /* general size type (at least 16 bits) */
typedef unsigned char  FMSTR_BOOL;              /* general boolean type  */

/* application command-specific types */
typedef unsigned char FMSTR_APPCMD_CODE;
typedef unsigned char FMSTR_APPCMD_DATA, *FMSTR_APPCMD_PDATA;
typedef unsigned char FMSTR_APPCMD_RESULT;

/* pointer to application command callback handler */
typedef FMSTR_APPCMD_RESULT (*FMSTR_PAPPCMDFUNC)(FMSTR_APPCMD_CODE,FMSTR_APPCMD_PDATA,FMSTR_SIZE);

/*****************************************************************************
* TSA-related user types and macros
******************************************************************************/

#if defined(__CSMC__)                           /* Cosmic compiler */
  #if FMSTR_LARGE_MODEL
    /* sizeof(void*) is 3 in large model, we must make TSA entries 4 bytes  */
    #define FMSTR_TSATBL_STRPTR          unsigned long
    #define FMSTR_TSATBL_VOIDPTR         unsigned long
    #define FMSTR_TSATBL_STRPTR_CAST(x)  ((unsigned long)((char *)(x)))
    #define FMSTR_TSATBL_VOIDPTR_CAST(x) ((unsigned long)((void *)(x)))
  #else
    #error "Near data model is not supported by cosmic compiler"
    /* HCS12X small model near pointers */
    #define FMSTR_TSATBL_STRPTR   char @far *
    #define FMSTR_TSATBL_VOIDPTR  void @far *
  #endif
#else                                           /* CodeWarrior compiler */
  #if defined(__HCS12X__) || defined(__S12Z__)
    #if FMSTR_LARGE_MODEL
      /* sizeof(void*) is 3 in large model, we must make TSA entries 4 bytes  */
      #define FMSTR_TSATBL_STRPTR          unsigned long
      #define FMSTR_TSATBL_VOIDPTR         unsigned long
      #if defined(__S12Z__)
        #define FMSTR_TSATBL_STRPTR_CAST(x)  ((unsigned long)((char*)(x)))
        #define FMSTR_TSATBL_VOIDPTR_CAST(x) ((unsigned long)((void*)(x)))
      #else
        #define FMSTR_TSATBL_STRPTR_CAST(x)  ((unsigned long)((char*__far)(x)))
        #define FMSTR_TSATBL_VOIDPTR_CAST(x) ((unsigned long)((void*__far)(x)))
      #endif
    #else
      #if defined(__S12Z__)
        #error "Near data model is not supported by s12z core"
        /* HCS12X small model far pointers */
        #define FMSTR_TSATBL_STRPTR   char* __far
        #define FMSTR_TSATBL_VOIDPTR  void* __far
      #else
        /* HCS12X small model near pointers */
        #define FMSTR_TSATBL_STRPTR   char*__near 
        #define FMSTR_TSATBL_VOIDPTR  void*__near
      #endif
    #endif /* defined(__S12Z__) */
  #endif
#endif

#include "freemaster_tsa.h"

/*****************************************************************************
* Constants
******************************************************************************/

/* application command status information  */
#define FMSTR_APPCMDRESULT_NOCMD      0xff
#define FMSTR_APPCMDRESULT_RUNNING    0xfe
#define MFSTR_APPCMDRESULT_LASTVALID  0xf7  /* F8-FF are reserved  */

/* recorder time base declaration helpers */
#define FMSTR_REC_BASE_SECONDS(x)  ((x) & 0x3fff)
#define FMSTR_REC_BASE_MILLISEC(x) (((x) & 0x3fff) | 0x4000)
#define FMSTR_REC_BASE_MICROSEC(x) (((x) & 0x3fff) | 0x8000)
#define FMSTR_REC_BASE_NANOSEC(x)  (((x) & 0x3fff) | 0xc000)

/*****************************************************************************
* Global functions 
******************************************************************************/

/* FreeMASTER serial communication API */
FMSTR_BOOL FMSTR_Init(void);    /* general initialization */
void FMSTR_Poll(void);          /* polling call, use in SHORT_INTR and POLL_DRIVEN modes */

#if defined(__MWERKS__) && (!defined(__S12Z__)) /* CodeWarrior compiler */
#include "non_bank.sgm"
#endif
void FMSTR_Isr(void);           /* SCI interrupt handler for LONG_INTR and SHORT_INTR modes */
void FMSTR_Isr2(void);          /* SCI 2nd interrupt handler for LONG_INTR and SHORT_INTR modes */
#if defined(__MWERKS__) && (!defined(__S12Z__)) /* CodeWarrior compiler */
#include "default.sgm"
#endif

/* Recorder API */
void FMSTR_Recorder(void);
void FMSTR_TriggerRec(void);
void FMSTR_SetUpRecBuff(FMSTR_ADDR nBuffAddr, FMSTR_SIZE nBuffSize);

/* Application commands API */
FMSTR_APPCMD_CODE  FMSTR_GetAppCmd(void);
FMSTR_APPCMD_PDATA FMSTR_GetAppCmdData(FMSTR_SIZE* pDataLen);
FMSTR_BOOL         FMSTR_RegisterAppCmdCall(FMSTR_APPCMD_CODE nAppCmdCode, FMSTR_PAPPCMDFUNC pCallbackFunc);

void FMSTR_AppCmdAck(FMSTR_APPCMD_RESULT nResultCode);
void FMSTR_AppCmdSetResponseData(FMSTR_ADDR nResultDataAddr, FMSTR_SIZE nResultDataLen);

#endif /* __FREEMASTER_H */

