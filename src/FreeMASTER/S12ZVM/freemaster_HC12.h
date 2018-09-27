/******************************************************************************
*
* Freescale Semiconductor Inc.
* (c) Copyright 2004-2012 Freescale Semiconductor
* ALL RIGHTS RESERVED.
*
****************************************************************************//*!
*
* @file   freemaster_HC12.h
*
* @brief  FreeMASTER Driver hardware dependent stuff
*
* @version 1.0.1.0
* 
* @date Apr-27-2015
* 
*******************************************************************************/

#ifndef __FREEMASTER_HC12_H
#define __FREEMASTER_HC12_H

/******************************************************************************
* turn off some warning messages which appears in the FreeMASTER driver code
******************************************************************************/

#ifndef FMSTR_HC12_ALL_MESSAGES
#pragma MESSAGE DISABLE C1420  /* Result of function call is ignored */
#pragma MESSAGE DISABLE C3604  /* static not referenced */
#pragma MESSAGE DISABLE C4000  /* Condition always true */
#pragma MESSAGE DISABLE C4001  /* Condition always false */
#pragma MESSAGE DISABLE C4002  /* Result not used */
#pragma MESSAGE DISABLE C4301  /* Inline expansion done for call */
#pragma MESSAGE DISABLE C4443  /* Undefined macro taken as 0 */
#pragma MESSAGE DISABLE C5904  /* Division by one */
#pragma MESSAGE DISABLE C5905  /* Multiplication with one */
#pragma MESSAGE DISABLE C5909  /* Assignment in condition */
#pragma MESSAGE DISABLE C5917  /* Removed dead assignment */
#pragma MESSAGE DISABLE C12056 /* SP debug info incorrect due to optimizations */
#endif

/******************************************************************************
* platform-specific default configuration
******************************************************************************/

#ifndef FMSTR_LARGE_MODEL
#error FMSTR_LARGE_MODEL macro missing in freemaster.h
#endif

/* using 16bit addressing commands always makes sense on 16bit HC(S)12(X) platform */
/* (we keep enabled it even in S12X LARGE model because the most of accesses will  */
/* be using 16bit "near" addresses anyway) */
#ifndef FMSTR_USE_NOEX_CMDS
//S12z core and s12z core does not support noex commands
#if defined(__CSMC__) || defined(__S12Z__)
#define FMSTR_USE_NOEX_CMDS 0
#else
#define FMSTR_USE_NOEX_CMDS 1
#endif /* defined(__CSMC__) || defined(__S12Z__) */
#endif

/* using 32bit addressing commands (S12X only) */
#ifndef FMSTR_USE_EX_CMDS
    #if (FMSTR_LARGE_MODEL) && (defined(__HCS12X__) || defined(__CSMC__) || defined(__S12Z__))
    #define FMSTR_USE_EX_CMDS   1
    #else
    #define FMSTR_USE_EX_CMDS   0
    #endif
#endif

/* large model and EX commands handling possible on HCS12X only  */
#if ((FMSTR_USE_EX_CMDS) || (FMSTR_LARGE_MODEL)) && !(defined(__HCS12X__) || defined(__CSMC__) || defined(__S12Z__))
    #error Large FreeMASTER driver model possible on HCS12X only (FMSTR_LARGE_MODEL must be zero)
    #undef  FMSTR_USE_EX_CMDS
    #define FMSTR_USE_EX_CMDS 0
    #undef  FMSTR_LARGE_MODEL
    #define FMSTR_LARGE_MODEL 0
#endif

/* at least one of EX or no-EX command handling must be enabled */
#if !(FMSTR_USE_EX_CMDS) && !(FMSTR_USE_NOEX_CMDS)
    #error At least one of EX or no-EX command handling must be enabled (please set FMSTR_USE_NOEX_CMDS)
    #undef  FMSTR_USE_NOEX_CMDS
    #define FMSTR_USE_NOEX_CMDS 1
#endif

/* in large model, the 32bit addresses must be enabled */
#if (FMSTR_LARGE_MODEL) && !(FMSTR_USE_EX_CMDS)
    #error You must enable FMSTR_USE_EX_CMDS when using large memory model (when FMSTR_LARGE_MODEL is set)
    #undef  FMSTR_USE_EX_CMDS
    #define FMSTR_USE_EX_CMDS 1
#endif

/* when 32bit addresses are enabled, the large model must be used */
#if !(FMSTR_LARGE_MODEL) && (FMSTR_USE_EX_CMDS)
    #error You must enable FMSTR_LARGE_MODEL when EX commands are enabled (when FMSTR_USE_EX_CMDS is set)
#endif

/*****************************************************************************
* Board configuration information 
******************************************************************************/

#define FMSTR_PROT_VER           3      /* protocol version 3 */
#define FMSTR_CFG_FLAGS  FMSTR_CFGFLAG_BIGENDIAN /* board info flags */
#define FMSTR_CFG_BUS_WIDTH      1      /* data bus width */
#define FMSTR_GLOB_VERSION_MAJOR 2      /* driver version */
#define FMSTR_GLOB_VERSION_MINOR 0
#define FMSTR_IDT_STRING "HC(S)12(X) FreeMASTER"
#define FMSTR_TSA_FLAGS          0

/******************************************************************************
* platform-specific types
******************************************************************************/

typedef unsigned char  FMSTR_U8;        /* smallest memory entity */
typedef unsigned short FMSTR_U16;       /* 16bit value */
typedef unsigned long  FMSTR_U32;       /* 32bit value */

typedef signed char    FMSTR_S8;        /* signed 8bit value */
typedef signed short   FMSTR_S16;       /* signed 16bit value */
typedef signed long    FMSTR_S32;       /* signed 32bit value */

#if FMSTR_REC_FLOAT_TRIG
typedef float          FMSTR_FLOAT;     /* float value */
#endif

typedef unsigned char  FMSTR_FLAGS;     /* type to be union-ed with flags (at least 8 bits) */
typedef unsigned char  FMSTR_SIZE8;     /* one-byte size value */
typedef signed short   FMSTR_INDEX;     /* general for-loop index (must be signed) */

typedef unsigned char  FMSTR_BCHR;      /* type of a single character in comm.buffer */
typedef unsigned char* FMSTR_BPTR;      /* pointer within a communication buffer */

typedef unsigned char  FMSTR_SCISR;     /* data type to store SCI status register */

/******************************************************************************
* communication buffer access functions
******************************************************************************/

void FMSTR_CopyMemory(FMSTR_ADDR nDestAddr, FMSTR_ADDR nSrcAddr, FMSTR_SIZE8 nSize);
FMSTR_BPTR FMSTR_CopyToBuffer(FMSTR_BPTR pDestBuff, FMSTR_ADDR nSrcAddr, FMSTR_SIZE8 nSize);
FMSTR_BPTR FMSTR_CopyFromBuffer(FMSTR_ADDR nDestAddr, FMSTR_BPTR pSrcBuff, FMSTR_SIZE8 nSize);
void FMSTR_CopyFromBufferWithMask(FMSTR_ADDR nDestAddr, FMSTR_BPTR pSrcBuff, FMSTR_SIZE8 nSize);

/* mixed EX and non-EX commands may occur */
#if (FMSTR_LARGE_MODEL) && (FMSTR_USE_EX_CMDS) && (FMSTR_USE_NOEX_CMDS)
void FMSTR_SetExAddr(FMSTR_BOOL bNextAddrIsEx);
#else
/* otherwise, we always know what addresses are used, (ignore FMSTR_SetExAddr) */
#define FMSTR_SetExAddr(bNextAddrIsEx) 
#endif

/*********************************************************************************
* communication buffer access functions. Most of them are trivial simple on HC12
*********************************************************************************/

#define FMSTR_ValueFromBuffer8(pDest, pSrc) \
    ( (*((FMSTR_U8*)(pDest)) = *(FMSTR_U8*)(pSrc)), (((FMSTR_BPTR)(pSrc))+1) )

#define FMSTR_ValueFromBuffer16(pDest, pSrc) \
    ( (*((FMSTR_U16*)(pDest)) = *(FMSTR_U16*)(pSrc)), (((FMSTR_BPTR)(pSrc))+2) )

#define FMSTR_ValueFromBuffer32(pDest, pSrc) \
    ( (*((FMSTR_U32*)(pDest)) = *(FMSTR_U32*)(pSrc)), (((FMSTR_BPTR)(pSrc))+4) )


#define FMSTR_ValueToBuffer8(pDest, src) \
    ( (*((FMSTR_U8*)(pDest)) = (FMSTR_U8)(src)), (((FMSTR_BPTR)(pDest))+1) )

#define FMSTR_ValueToBuffer16(pDest, src) \
    ( (*((FMSTR_U16*)(pDest)) = (FMSTR_U16)(src)), (((FMSTR_BPTR)(pDest))+2) )

#define FMSTR_ValueToBuffer32(pDest, src) \
    ( (*((FMSTR_U32*)(pDest)) = (FMSTR_U32)(src)), (((FMSTR_BPTR)(pDest))+4) )


#define FMSTR_SkipInBuffer(pDest, nSize) \
    ( ((FMSTR_BPTR)(pDest)) + (nSize) )


#define FMSTR_ConstToBuffer8  FMSTR_ValueToBuffer8
#define FMSTR_ConstToBuffer16 FMSTR_ValueToBuffer16

/* Address fetching is different in small and large data models. In large model 
  (or when EX and no-EX commands mey be mixed), we must handle the addresses
  in functions (translate addresses from logical to global format if needed). */
#if FMSTR_LARGE_MODEL 
    FMSTR_BPTR FMSTR_AddressFromBuffer(FMSTR_ADDR* pAddr, FMSTR_BPTR pSrc);
    FMSTR_BPTR FMSTR_AddressToBuffer(FMSTR_BPTR pDest, FMSTR_ADDR nAddr);
    /* TSA uses this address-fixing method when checking memory space */
    FMSTR_ADDR FMSTR_FixHcs12xAddr(FMSTR_ADDR nAddr);
#else
    /* sizeof pointers is 2 bytes, fetch and store is trivial (only no-EX commands are used) */
    #define FMSTR_AddressFromBuffer(pDest, pSrc) \
        ( (*((FMSTR_ADDR*)(pDest)) = *(FMSTR_ADDR*)(pSrc)), (((FMSTR_BPTR)(pSrc))+2) )
    #define FMSTR_AddressToBuffer(pDest, nAddr) \
        ( (*((FMSTR_ADDR*)(pDest)) = (FMSTR_ADDR)(nAddr)), (((FMSTR_BPTR)(pDest))+2) )
    #define FMSTR_FixHcs12xAddr(nAddr)  (nAddr)
#endif

#define FMSTR_GetS8(addr)  ( *(FMSTR_S8*)(addr) )
#define FMSTR_GetU8(addr)  ( *(FMSTR_U8*)(addr) )
#define FMSTR_GetS16(addr) ( *(FMSTR_S16*)(addr) )
#define FMSTR_GetU16(addr) ( *(FMSTR_U16*)(addr) )
#define FMSTR_GetS32(addr) ( *(FMSTR_S32*)(addr) )
#define FMSTR_GetU32(addr) ( *(FMSTR_U32*)(addr) )

#if FMSTR_REC_FLOAT_TRIG
#define FMSTR_GetFloat(addr) ( *(FMSTR_FLOAT*)(addr) )
#endif

/****************************************************************************************
* Other helper macros
*****************************************************************************************/

/* This macro assigns C pointer to FMSTR_ADDR-typed variable */
#define FMSTR_PTR2ADDR(tmpAddr,ptr) ( tmpAddr = (FMSTR_ADDR) (FMSTR_U8*) ptr )
#define FMSTR_ARR2ADDR FMSTR_PTR2ADDR

/****************************************************************************************
* Platform-specific configuration 
*****************************************************************************************/

/* MSCAN functionality implemented on HC12 */
#define FMSTR_CANHW_MSCAN 1 

/****************************************************************************************
* General peripheral space access macros
*****************************************************************************************/

#define FMSTR_SETBIT(base, offset, bit)         (*(((volatile FMSTR_U8*)(base))+(offset)) |= (bit))
#define FMSTR_CLRBIT(base, offset, bit)         (*(((volatile FMSTR_U8*)(base))+(offset)) &= ~(bit))
#define FMSTR_TSTBIT(base, offset, bit)         (*(((volatile FMSTR_U8*)(base))+(offset)) & (bit))
#define FMSTR_SETREG(base, offset, value)       (*(((volatile FMSTR_U8*)(base))+(offset)) = (value))
#define FMSTR_GETREG(base, offset)              (*(((volatile FMSTR_U8*)(base))+(offset)))

/****************************************************************************************
* SCI module constants
*****************************************************************************************/

/* SCI module registers */
#define FMSTR_SCIBDH_OFFSET 0
#define FMSTR_SCIBDL_OFFSET 1
#define FMSTR_SCICR1_OFFSET 2
#define FMSTR_SCICR2_OFFSET 3
#define FMSTR_SCISR1_OFFSET 4
#define FMSTR_SCISR2_OFFSET 5
#define FMSTR_SCIDRH_OFFSET 6
#define FMSTR_SCIDRL_OFFSET 7

/* SCI Control Register bits */
#define FMSTR_SCICR1_LOOPS     0x80
#define FMSTR_SCICR1_SWAI      0x40
#define FMSTR_SCICR1_RSRC      0x20
#define FMSTR_SCICR1_M         0x10
#define FMSTR_SCICR1_WAKE      0x08
#define FMSTR_SCICR1_ILT       0x04
#define FMSTR_SCICR1_PE        0x02
#define FMSTR_SCICR1_PT        0x01
#define FMSTR_SCICR2_TIE       0x80
#define FMSTR_SCICR2_TCIE      0x40
#define FMSTR_SCICR2_RIE       0x20
#define FMSTR_SCICR2_ILIE      0x10
#define FMSTR_SCICR2_TE        0x08
#define FMSTR_SCICR2_RE        0x04
#define FMSTR_SCICR2_RWU       0x02
#define FMSTR_SCICR2_SBK       0x01

/* SCI Status registers bits */
#define FMSTR_SCISR_TDRE       0x80
#define FMSTR_SCISR_TC         0x40
#define FMSTR_SCISR_RDRF       0x20
#define FMSTR_SCISR_IDLE       0x10
#define FMSTR_SCISR_OR         0x08
#define FMSTR_SCISR_NF         0x04
#define FMSTR_SCISR_FE         0x02
#define FMSTR_SCISR_PF         0x01
#define FMSTR_SCISR2_BRK13     0x04
#define FMSTR_SCISR2_TXDIR     0x02
#define FMSTR_SCISR2_RAF       0x01

/*******************************************************************************************
* SCI access macros
*****************************************************************************************/

/* transmitter enable/disable */
#define FMSTR_SCI_TE() FMSTR_SETBIT(FMSTR_SCI_BASE, FMSTR_SCICR2_OFFSET, FMSTR_SCICR2_TE)
#define FMSTR_SCI_TD() FMSTR_CLRBIT(FMSTR_SCI_BASE, FMSTR_SCICR2_OFFSET, FMSTR_SCICR2_TE)

/* receiver enable/disable */
#define FMSTR_SCI_RE() FMSTR_SETBIT(FMSTR_SCI_BASE, FMSTR_SCICR2_OFFSET, FMSTR_SCICR2_RE)
#define FMSTR_SCI_RD() FMSTR_CLRBIT(FMSTR_SCI_BASE, FMSTR_SCICR2_OFFSET, FMSTR_SCICR2_RE)

#define FMSTR_SCI_TE_RE() FMSTR_SETBIT(FMSTR_SCI_BASE, FMSTR_SCICR2_OFFSET, FMSTR_SCICR2_RE | FMSTR_SCICR2_TE)

/* Transmitter-empty interrupt enable/disable */
#define FMSTR_SCI_ETXI() FMSTR_SETBIT(FMSTR_SCI_BASE, FMSTR_SCICR2_OFFSET, FMSTR_SCICR2_TIE)
#define FMSTR_SCI_DTXI() FMSTR_CLRBIT(FMSTR_SCI_BASE, FMSTR_SCICR2_OFFSET, FMSTR_SCICR2_TIE)

/* Receiver-full interrupt enable/disable */
#define FMSTR_SCI_ERXI() FMSTR_SETBIT(FMSTR_SCI_BASE, FMSTR_SCICR2_OFFSET, FMSTR_SCICR2_RIE)
#define FMSTR_SCI_DRXI() FMSTR_CLRBIT(FMSTR_SCI_BASE, FMSTR_SCICR2_OFFSET, FMSTR_SCICR2_RIE)

/* Tranmsit character */
#define FMSTR_SCI_PUTCHAR(ch) FMSTR_SETREG(FMSTR_SCI_BASE, FMSTR_SCIDRL_OFFSET, ch)

/* Get received character */
#define FMSTR_SCI_GETCHAR() FMSTR_GETREG(FMSTR_SCI_BASE, FMSTR_SCIDRL_OFFSET)

/* read status register */
#define FMSTR_SCI_GETSR()   FMSTR_GETREG(FMSTR_SCI_BASE, FMSTR_SCISR1_OFFSET)

/* read & clear status register */
#define FMSTR_SCI_RDCLRSR() FMSTR_GETREG(FMSTR_SCI_BASE, FMSTR_SCISR1_OFFSET)

/****************************************************************************************
* MSCAN module constants
*****************************************************************************************/

/* MSCAN module registers */
#define FMSTR_MSCANRFLG_OFFSET  0x04
#define FMSTR_MSCANRIER_OFFSET  0x05
#define FMSTR_MSCANTFLG_OFFSET  0x06
#define FMSTR_MSCANTIER_OFFSET  0x07
#define FMSTR_MSCANTBSEL_OFFSET 0x0a
#define FMSTR_MSCANRXFG_OFFSET  0x20
#define FMSTR_MSCANTXFG_OFFSET  0x30

/* MSCAN MB registers offsets (must also add CANxxFG_OFFSET) */
#define FMSTR_MSCMBIDR0  0
#define FMSTR_MSCMBIDR1  1
#define FMSTR_MSCMBIDR2  2
#define FMSTR_MSCMBIDR3  3
#define FMSTR_MSCMBDSR0  4
#define FMSTR_MSCMBDSR1  5
#define FMSTR_MSCMBDSR2  6
#define FMSTR_MSCMBDSR3  7
#define FMSTR_MSCMBDSR4  8
#define FMSTR_MSCMBDSR5  9
#define FMSTR_MSCMBDSR6 10
#define FMSTR_MSCMBDSR7 11
#define FMSTR_MSCMBDLR  12
#define FMSTR_MSCMBTBPR 13
#define FMSTR_MSCMBTSRH 14
#define FMSTR_MSCMBTSRL 15

/* MSCAN CANRFLG */
#define FMSTR_MSCANRFLG_RXF     0x01

/* MSCAN CANRIER */
#define FMSTR_MSCANRFLG_RXFIE   0x01

/* MSCAN CANTFLG, TIER, TARQ, TBSEL */
#define FMSTR_MSCANTBUF_TX2     0x04
#define FMSTR_MSCANTBUF_TX1     0x02
#define FMSTR_MSCANTBUF_TX0     0x01
#define FMSTR_MSCANTBUF_ALL     0x07

/* MSCAN CANIDRx */
#define FMSTR_MSCANIDR1_IDE     0x08
#define FMSTR_MSCANIDR1_STD_RTR 0x10
#define FMSTR_MSCANIDR3_EXT_RTR 0x08

/* MSCAN: enable/disable CAN RX/TX interrupts */
#define FMSTR_MSCAN_ETXI() FMSTR_SETBIT(FMSTR_CAN_BASE, FMSTR_MSCANTIER_OFFSET, FMSTR_MSCANTBUF_ALL)
#define FMSTR_MSCAN_DTXI() FMSTR_CLRBIT(FMSTR_CAN_BASE, FMSTR_MSCANTIER_OFFSET, FMSTR_MSCANTBUF_ALL)
#define FMSTR_MSCAN_ERXI() FMSTR_SETBIT(FMSTR_CAN_BASE, FMSTR_MSCANRIER_OFFSET, FMSTR_MSCANRFLG_RXFIE)
#define FMSTR_MSCAN_DRXI() FMSTR_CLRBIT(FMSTR_CAN_BASE, FMSTR_MSCANRIER_OFFSET, FMSTR_MSCANRFLG_RXFIE)

/* MSCAN: read RX status register */
#define FMSTR_MSCAN_TEST_RXFLG()   FMSTR_TSTBIT(FMSTR_CAN_BASE, FMSTR_MSCANRFLG_OFFSET, FMSTR_MSCANRFLG_RXF)
#define FMSTR_MSCAN_CLEAR_RXFLG()  FMSTR_SETREG(FMSTR_CAN_BASE, FMSTR_MSCANRFLG_OFFSET, FMSTR_MSCANRFLG_RXF)

/* MSCAN: read TX status register */
#define FMSTR_MSCAN_TEST_TXFLG()   FMSTR_TSTBIT(FMSTR_CAN_BASE, FMSTR_MSCANTFLG_OFFSET, FMSTR_MSCANTBUF_ALL)

/* MSCAN: id to idr translation */
#define FMSTR_MSCAN_MAKEIDR0(id) ((FMSTR_U8)(((id)&FMSTR_CAN_EXTID) ? (id)>>21 : (id)>>3))
#define FMSTR_MSCAN_MAKEIDR1(id) ((FMSTR_U8)(((id)&FMSTR_CAN_EXTID) ? ((((id)>>13) & 0xe0U) | 0x18 | (((id)>>15) & 0x07U)) : (((id)<<5)&0xe0)))
#define FMSTR_MSCAN_MAKEIDR2(id) ((FMSTR_U8)(((id)&FMSTR_CAN_EXTID) ? (id)>>7 : 0))
#define FMSTR_MSCAN_MAKEIDR3(id) ((FMSTR_U8)(((id)&FMSTR_CAN_EXTID) ? (((id)<<1) & 0xfeU) : 0))

/* MSCAN: CAN transmission */
typedef struct
{
    FMSTR_U8 nTxBufSel;
    FMSTR_U8 nDataIx;
} FMSTR_MSCAN_TCTX;

/* MSCAN: CAN transmission, configuring the buffer before each transmission */
#define FMSTR_MSCAN_TCFG(pctx) \
    FMSTR_MACROCODE_BEGIN() \
        FMSTR_SETREG(FMSTR_CAN_BASE, FMSTR_MSCANTBSEL_OFFSET, FMSTR_GETREG(FMSTR_CAN_BASE, FMSTR_MSCANTFLG_OFFSET)); \
        (pctx)->nTxBufSel = FMSTR_GETREG(FMSTR_CAN_BASE, FMSTR_MSCANTBSEL_OFFSET); \
        (pctx)->nDataIx = 0; \
    FMSTR_MACROCODE_END()

/* MSCAN: CAN transmission, preparing the buffer before each transmission */
#define FMSTR_MSCAN_TID(pctx, idr0, idr1, idr2, idr3) \
    FMSTR_MACROCODE_BEGIN() \
        FMSTR_SETREG(FMSTR_CAN_BASE, FMSTR_MSCANTXFG_OFFSET+FMSTR_MSCMBIDR0, idr0); \
        FMSTR_SETREG(FMSTR_CAN_BASE, FMSTR_MSCANTXFG_OFFSET+FMSTR_MSCMBIDR1, idr1); \
        FMSTR_SETREG(FMSTR_CAN_BASE, FMSTR_MSCANTXFG_OFFSET+FMSTR_MSCMBIDR2, idr2); \
        FMSTR_SETREG(FMSTR_CAN_BASE, FMSTR_MSCANTXFG_OFFSET+FMSTR_MSCMBIDR3, idr3); \
    FMSTR_MACROCODE_END()

/* CAN transmission, put one data byte into buffer */
#define FMSTR_MSCAN_TLEN(pctx, len) \
    FMSTR_SETREG(FMSTR_CAN_BASE, FMSTR_MSCANTXFG_OFFSET+FMSTR_MSCMBDLR, len)

/* CAN transmission, put one data byte into buffer */
#define FMSTR_MSCAN_PUTBYTE(pctx, dataByte) \
    FMSTR_MACROCODE_BEGIN() \
        FMSTR_SETREG(FMSTR_CAN_BASE, FMSTR_MSCANTXFG_OFFSET+FMSTR_MSCMBDSR0+(pctx)->nDataIx, dataByte); \
        (pctx)->nDataIx++; \
    FMSTR_MACROCODE_END()

/* CAN transmission, set transmit priority */
#define FMSTR_MSCAN_TPRI(pctx, txPri) \
        FMSTR_SETREG(FMSTR_CAN_BASE, FMSTR_MSCANTXFG_OFFSET+FMSTR_MSCMBTBPR, txPri)
    
/* CAN transmission, final firing of the buffer */
#define FMSTR_MSCAN_TX(pctx) \
        FMSTR_SETREG(FMSTR_CAN_BASE, FMSTR_MSCANTFLG_OFFSET, (pctx)->nTxBufSel)

/* CAN reception */
typedef struct
{
    FMSTR_U8 nDataIx;
} FMSTR_MSCAN_RCTX;

/* CAN reception, configuring the buffer, just once at the initialization phase */
#define FMSTR_MSCAN_RINIT(idr0, idr1, idr2, idr3) /* nothing needed on msCAN */

/* CAN transmission, configuring the buffer, just once at the initialization phase */
#define FMSTR_MSCAN_TINIT(idr0, idr1, idr2, idr3) 

/* CAN reception, configuring the buffer for receiving (each time receiver is re-enabled) */
#define FMSTR_MSCAN_RCFG() /* nothing needed on msCAN */

/* CAN reception, lock frame */
#define FMSTR_MSCAN_RX(pctx) \
    (pctx)->nDataIx = 0;

/* CAN reception, test if received message ID matches the one given, TRUE if matching */
#define FMSTR_MSCAN_TEST_RIDR(pctx, idr0, idr1, idr2, idr3) \
    (((idr1) & FMSTR_MSCANIDR1_IDE) ? \
        /* ext id compare */ \
        (((idr0)==FMSTR_GETREG(FMSTR_CAN_BASE, FMSTR_MSCANRXFG_OFFSET+FMSTR_MSCMBIDR0)) && \
         ((idr1)==FMSTR_GETREG(FMSTR_CAN_BASE, FMSTR_MSCANRXFG_OFFSET+FMSTR_MSCMBIDR1)) && \
         ((idr2)==FMSTR_GETREG(FMSTR_CAN_BASE, FMSTR_MSCANRXFG_OFFSET+FMSTR_MSCMBIDR2)) && \
         ((idr3)==FMSTR_GETREG(FMSTR_CAN_BASE, FMSTR_MSCANRXFG_OFFSET+FMSTR_MSCMBIDR3))) : \
        /* std id compare */ \
        (((idr0)==FMSTR_GETREG(FMSTR_CAN_BASE, FMSTR_MSCANRXFG_OFFSET+FMSTR_MSCMBIDR0)) && \
         (0==(((idr1)^FMSTR_GETREG(FMSTR_CAN_BASE, FMSTR_MSCANRXFG_OFFSET+FMSTR_MSCMBIDR1))&0xf8U))))
        

/* CAN reception, get receviced frame length */
#define FMSTR_MSCAN_RLEN(pctx) \
    FMSTR_GETREG(FMSTR_CAN_BASE, FMSTR_MSCANRXFG_OFFSET+FMSTR_MSCMBDLR)

/* CAN reception, get one received byte */
#define FMSTR_MSCAN_GETBYTE(pctx) \
    FMSTR_GETREG(FMSTR_CAN_BASE, FMSTR_MSCANRXFG_OFFSET+FMSTR_MSCMBDSR0+(pctx)->nDataIx++)

/* CAN reception, unlock the buffer */
#define FMSTR_MSCAN_RFINISH(pctx)  /* nothing needed on msCAN */

#endif /* __FREEMASTER_HC12_H */

