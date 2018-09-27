/******************************************************************************
*
* Freescale Semiconductor Inc.
* (c) Copyright 2004-2012 Freescale Semiconductor
* ALL RIGHTS RESERVED.
*
****************************************************************************//*!
*
* @file   freemaster_HC12.c
*
* @brief  FreeMASTER Driver HC12-hardware dependent stuff
*
* @version 1.0.1.0
* 
* @date Apr-27-2015
* 
*******************************************************************************/

#include "freemaster.h"
#include "freemaster_private.h"
#include "freemaster_HC12.h"

#if !(FMSTR_DISABLE)
/*******************************************************************************
*
*  @brief    API: User callback called from FMSTR_Isr() handler
*
*******************************************************************************/

#if defined(FMSTR_ISR_CALLBACK)
  extern void FMSTR_ISR_CALLBACK(void);
#endif 

/****************************************************************************************
* Vector to interrupt index translation, user may want to use INTVEC instead of interrupt number
*****************************************************************************************/

/* vector_address to interrupt_index (suitable for "interrupt" keyword declaration) */
#define FMSTR_INT_VEC2INDEX(vec) (0x7f-(((vec)&0xff)/2))

#if !defined(FMSTR_SCI_INTERRUPT) && defined(FMSTR_SCI_INTVEC)
#define FMSTR_SCI_INTERRUPT FMSTR_INT_VEC2INDEX(FMSTR_SCI_INTVEC)
#endif
#if !defined(FMSTR_SCI_RX_INTERRUPT) && defined(FMSTR_SCI_RX_INTVEC)
#define FMSTR_SCI_RX_INTERRUPT FMSTR_INT_VEC2INDEX(FMSTR_SCI_RX_INTVEC)
#endif
#if !defined(FMSTR_SCI_TX_INTERRUPT) && defined(FMSTR_SCI_TX_INTVEC)
#define FMSTR_SCI_TX_INTERRUPT FMSTR_INT_VEC2INDEX(FMSTR_SCI_TX_INTVEC)
#endif
#if !defined(FMSTR_CAN_INTERRUPT) && defined(FMSTR_CAN_INTVEC)
#define FMSTR_CAN_INTERRUPT FMSTR_INT_VEC2INDEX(FMSTR_CAN_INTVEC)
#endif
#if !defined(FMSTR_CAN_RX_INTERRUPT) && defined(FMSTR_CAN_RX_INTVEC)
#define FMSTR_CAN_RX_INTERRUPT FMSTR_INT_VEC2INDEX(FMSTR_CAN_RX_INTVEC)
#endif
#if !defined(FMSTR_CAN_TX_INTERRUPT) && defined(FMSTR_CAN_TX_INTVEC)
#define FMSTR_CAN_TX_INTERRUPT FMSTR_INT_VEC2INDEX(FMSTR_CAN_TX_INTVEC)
#endif
 
/*******************************************************************************
*
* @brief    API: Main SCI or CAN Interrupt handler call
*
* This Interrupt Service Routine handles the SCI or CAN interrupts for the FreeMASTER 
* driver. In case you want to handle the interrupt in the application yourselves,
* call the FMSTR_ProcessSCI, FMSTR_ProcessCanRx or FMSTR_ProcessCanTx functions which 
* does the same job but is not compiled as an Interrupt Service Routine.
*
* In poll-driven mode (FMSTR_POLL_DRIVEN) this function does nothing.
*
*******************************************************************************/

#if defined(__HCS12X__)
extern volatile __near FMSTR_U8 _GPAGE;
extern volatile __near FMSTR_U8 _PPAGE;
#endif

/* HC12 interrupt routine declaration, must be in non-paged code memory */
#if defined(__CSMC__)                           /* Cosmic Compiler */
@interrupt
#else                                           /* CodeWarrior compiler */
#if !defined(__S12Z__)
#include "non_bank.sgm"
#endif

/* user may define the interrupt vector number for the better convenience */
#if (FMSTR_USE_SCI) && defined(FMSTR_SCI_RX_INTERRUPT)      /* SCI RX interrupt */
interrupt FMSTR_SCI_RX_INTERRUPT
#elif (FMSTR_USE_SCI) && defined(FMSTR_SCI_INTERRUPT)       /* common SCI interrupt */
interrupt FMSTR_SCI_INTERRUPT
#elif (FMSTR_USE_CAN) && defined(FMSTR_CAN_RX_INTERRUPT)    /* CAN RX interrupt */
interrupt FMSTR_CAN_RX_INTERRUPT
#elif (FMSTR_USE_CAN) && defined(FMSTR_CAN_INTERRUPT)       /* common  CAN interrupt */
interrupt FMSTR_CAN_INTERRUPT
#else
#pragma TRAP_PROC   /* or may want to use the PRM file to set the vector to FMSTR_Isr */
#endif /* (FMSTR_USE_SCI) && defined(FMSTR_SCI_RX_INTERRUPT) */
#endif /* defined(__CSMC__) */

void FMSTR_Isr(void)
{
#if defined(__HCS12X__) && defined(__MWERKS__)
    asm LDAA _GPAGE
    asm PSHA  
    asm LDAA _PPAGE
    asm PSHA  
#endif

#if (FMSTR_LONG_INTR) || (FMSTR_SHORT_INTR)

    /* process serial interface */
#if FMSTR_USE_SCI
    FMSTR_ProcessSCI();

    /* process CAN interface */
#elif FMSTR_USE_CAN
    /* separate interrupts specified */
  #if defined(FMSTR_CAN_RX_INTERRUPT) && defined(FMSTR_CAN_TX_INTERRUPT) && !defined(FMSTR_CAN_INTERRUPT)
    /* CAN RX only! */
    FMSTR_ProcessCanRx();
  #else
    /* both CAN interrupts */
    FMSTR_ProcessCanRx();
    FMSTR_ProcessCanTx();
  #endif 
#endif /* FMSTR_USE_SCI */

    /* process application callback */
#if defined(FMSTR_ISR_CALLBACK)
    if((FMSTR_ISR_CALLBACK) != NULL)
        FMSTR_ISR_CALLBACK();
#endif

#if defined(__HCS12X__) && defined(__MWERKS__)
    asm PULA  
    asm STAA  _PPAGE
    asm PULA  
    asm STAA  _GPAGE
#endif
#endif /* (FMSTR_LONG_INTR) || (FMSTR_SHORT_INTR) */
}

/*******************************************************************************
*
* @brief    The second ISR for case separate vectors exist for RX and TX
*
* In poll-driven mode (FMSTR_POLL_DRIVEN) or is a common interrupt for RX and TX 
* was selected, this function is not compiled at all.
*
*******************************************************************************/


#if defined(__CSMC__)                           /* Cosmic Compiler */
#if (FMSTR_LONG_INTR) || (FMSTR_SHORT_INTR)
@interrupt
#define FMSTR_IMPL_ISRTX 1
#endif
#else                                           /* CodeWarrior compiler */
#undef FMSTR_IMPL_ISRTX
#if (FMSTR_LONG_INTR) || (FMSTR_SHORT_INTR)
#if (FMSTR_USE_SCI) && defined(FMSTR_SCI_TX_INTERRUPT) && defined(FMSTR_SCI_RX_INTERRUPT)
interrupt FMSTR_SCI_TX_INTERRUPT
#define FMSTR_IMPL_ISRTX 1
#elif FMSTR_USE_CAN && defined(FMSTR_CAN_TX_INTERRUPT) && defined(FMSTR_CAN_RX_INTERRUPT)
interrupt FMSTR_CAN_TX_INTERRUPT
#define FMSTR_IMPL_ISRTX 1
#endif
#endif

#endif /* defined(__CSMC__) */

#ifdef FMSTR_IMPL_ISRTX

void FMSTR_Isr2(void)
{
#if defined (__HCS12X__) && defined (__MWERKS__)
    asm LDAA _GPAGE
    asm PSHA  
    asm LDAA _PPAGE
    asm PSHA  
#endif

    /* process serial interface */
#if FMSTR_USE_SCI
    FMSTR_ProcessSCI(); 

    /* process CAN interface */
#elif FMSTR_USE_CAN
    FMSTR_ProcessCanTx();
#endif

    /* process application callback */
#if defined(FMSTR_ISR_CALLBACK)
    if((FMSTR_ISR_CALLBACK) != NULL)
        FMSTR_ISR_CALLBACK();
#endif

#if defined (__HCS12X__) && defined (__MWERKS__)
    asm PULA  
    asm STAA  _PPAGE
    asm PULA  
    asm STAA  _GPAGE
#endif
}

#endif /* FMSTR_IMPL_ISRTX */

/* restore HC12 code segment */
#if defined(FMSTR_PLATFORM_HC12) && defined (__MWERKS__) && (!defined(__S12Z__))
    #include "default.sgm"
#endif

/**************************************************************************//*!
*
* @brief    The "memcpy" used internally in FreeMASTER driver
*
* @param    nDestAddr - destination memory address
* @param    nSrcAddr  - source memory address
* @param    nSize     - memory size (always in bytes)
*
******************************************************************************/

void FMSTR_CopyMemory(FMSTR_ADDR nDestAddr, FMSTR_ADDR nSrcAddr, FMSTR_SIZE8 nSize)
{
    FMSTR_U8* ps = (FMSTR_U8*) nSrcAddr;
    FMSTR_U8* pd = (FMSTR_U8*) nDestAddr;

    while(nSize--)
        *pd++ = *ps++;
}

/**************************************************************************//*!
*
* @brief  Write-into the communication buffer memory
*
* @param  pDestBuff - pointer to destination memory in communication buffer
* @param  nSrcAddr  - source memory address
* @param  nSize     - buffer size (always in bytes)
*
* @return This function returns a pointer to next byte in comm. buffer
*
******************************************************************************/

FMSTR_BPTR FMSTR_CopyToBuffer(FMSTR_BPTR pDestBuff, FMSTR_ADDR nSrcAddr, FMSTR_SIZE8 nSize)
{
    FMSTR_U8* ps = (FMSTR_U8*) nSrcAddr;
    FMSTR_U8* pd = (FMSTR_U8*) pDestBuff;

    while(nSize--)
        *pd++ = *ps++;

    return (FMSTR_BPTR) pd;
}

/**************************************************************************//*!
*
* @brief  Read-out memory from communication buffer
*
* @param  nDestAddr - destination memory address
* @param  pSrcBuff  - pointer to source memory in communication buffer
* @param  nSize     - buffer size (always in bytes)
*
* @return This function returns a pointer to next byte in comm. buffer
*
******************************************************************************/

FMSTR_BPTR FMSTR_CopyFromBuffer(FMSTR_ADDR nDestAddr, FMSTR_BPTR pSrcBuff, FMSTR_SIZE8 nSize)
{
    FMSTR_U8* ps = (FMSTR_U8*) pSrcBuff;
    FMSTR_U8* pd = (FMSTR_U8*) nDestAddr;

    while(nSize--)
        *pd++ = *ps++;

    return (FMSTR_BPTR) ps;
}


/**************************************************************************//*!
*
* @brief  Read-out memory from communication buffer, perform AND-masking
*
* @param  nDestAddr - destination memory address
* @param  pSrcBuff  - source memory in communication buffer, mask follows data
* @param  nSize     - buffer size (always in bytes)
*
******************************************************************************/

void FMSTR_CopyFromBufferWithMask(FMSTR_ADDR nDestAddr, FMSTR_BPTR pSrcBuff, FMSTR_SIZE8 nSize)
{
    FMSTR_U8* ps = (FMSTR_U8*) pSrcBuff;
    FMSTR_U8* pd = (FMSTR_U8*) nDestAddr;
    FMSTR_U8* pm = ps + nSize;
    FMSTR_U8 mask, stmp, dtmp;

    while(nSize--)
    {
        mask = *pm++;
        stmp = *ps++;
        dtmp = *pd;

        /* perform AND-masking */
        stmp = (FMSTR_U8) ((stmp & mask) | (dtmp & ~mask));

        /* put the result back */
        *pd++ = stmp;
    }
}

/******************************************************************************/

/* S12X LARGE model special handling (FMSTR_ADDR is __far pointer, global address) */
#if (defined(__HCS12X__) || defined(__CSMC__) || defined(__S12Z__)) && FMSTR_LARGE_MODEL

/* mixed EX and no-EX commands? */
#if (FMSTR_USE_EX_CMDS) && (FMSTR_USE_NOEX_CMDS)

/**************************************************************************//*!
*
* @brief  When mixed EX and no-EX command may occur, this variable is
*         here to remember what command is just being handled.
*
******************************************************************************/

static FMSTR_BOOL pcm_bNextAddrIsEx;

void FMSTR_SetExAddr(FMSTR_BOOL bNextAddrIsEx)
{
    pcm_bNextAddrIsEx = bNextAddrIsEx;
}

#else /* only no-EX commands (we are in LARGE model) */

/**************************************************************************//*!
*
* @brief  When mixed EX and no-EX commands are disabled, we are sure
*         only the EX are used (we are in LARGE mode here).
*
******************************************************************************/

static const FMSTR_BOOL pcm_bNextAddrIsEx = 1;

#endif /* mixed EX and no-EX commands */

/**************************************************************************//*!
*
* @brief  Store (global) address to communication buffer
*
******************************************************************************/

FMSTR_BPTR FMSTR_AddressToBuffer(FMSTR_BPTR pDest, FMSTR_ADDR nAddr)
{
    if(pcm_bNextAddrIsEx)
    {
        /* fill in the 24bit (global) address, right-align in 32bit destination */
        *(FMSTR_U32*) pDest = ((FMSTR_U32)nAddr);
        pDest += 4;
    }
    else
    {
        /* this should never happen, the result address would be invalid */
#if defined(__CSMC__)                           /* Cosmic Compiler */
        #asm
            BGND;
        #endasm
#else                                           /* CodeWarrior compiler */
        asm BGND;
#endif
        
        /* use NULL address rather than invalid one */
        *(FMSTR_U16*) pDest = 0;
        pDest += 2; 
    }
    
    return pDest;
}

/**************************************************************************//*!
*
* @brief  Test if given numeric (FMSTR_U32) address is global one
*
* Although not really general approach, this condition works on all current 
* S12X devices. In fact, this will work until the valid PPAGE and RPAGE values
* will be 0x80 or higher. On current devices, the PPAGE and RPAGE values start
* at 0xFF and going down depending on the ammount of available memory.
*
* Non-global address is either near (16bit only) or or logical (24bit page+offs, 
* Bit23 set (no device uses page 7f or less). The conversion of both such formats 
* to a global format is handled by CodeWarrior library function 
* _CONV_LOGICAL_TO_GLOBAL function.
*
* For us now, it is okay to assume the global address is the one with 
* non-zero page (GPAGE) while having Bit23 cleared.
*
******************************************************************************/

#define FMSTR_IsGlobalAddress(addr) \
    (((addr) & 0xff0000L) && !((addr) & 0x800000L))

#if defined(__MWERKS__) && (!defined(__S12Z__))
/**************************************************************************//*!
*
* @brief  CodeWarrior logical-to-global translation function 
*
* FMSTR_ADDR is defined as void*__far which is passed in B:X as
* the library function expects it. The function is NEAR so JSR is used
*
******************************************************************************/

FMSTR_ADDR NEAR _CONV_LOGICAL_TO_GLOBAL(FMSTR_ADDR);
#endif
/**************************************************************************//*!
*
* @brief  Fetch address from communication buffer
*
******************************************************************************/

FMSTR_BPTR FMSTR_AddressFromBuffer(FMSTR_ADDR* pAddr, FMSTR_BPTR pSrc)
{
    /* treat address as long word to determine the kind of the address */
    FMSTR_U32 addr = 0;

    if(pcm_bNextAddrIsEx)
    {
        addr = *((FMSTR_U32*) pSrc);
        pSrc += 4;
    }
    else
    {
        addr = *((FMSTR_U16*) pSrc);
        pSrc += 2;
    }
#if defined(__CSMC__)                           /* Cosmic compiler */
    if(FMSTR_IsGlobalAddress(addr))
    {
        *pAddr = (FMSTR_ADDR) (void* @far) (addr & 0xffffff);
    }
    else
    {
        *pAddr = (FMSTR_ADDR)addr;
    }
#else                                           /* CodeWarrior compiler */
    if(FMSTR_IsGlobalAddress(addr))
    {
#if defined(__S12Z__)
        *pAddr = (FMSTR_ADDR) (void*) (addr & 0xffffff);
#else
        *pAddr = (FMSTR_ADDR) (void*__far) (addr & 0xffffff);
#endif
    }
    else
    {
#if defined(__HCS12X__)
        *pAddr = (FMSTR_ADDR) _CONV_LOGICAL_TO_GLOBAL((FMSTR_ADDR)addr);
#else
        *pAddr = (FMSTR_ADDR)addr;
#endif
    }
#endif

    return pSrc;
}

/**************************************************************************//*!
*
* @brief  Check if the address is in logical form (page+offs) and convert
*         it to global address
*
******************************************************************************/

FMSTR_ADDR FMSTR_FixHcs12xAddr(FMSTR_ADDR nAddr)
{
    FMSTR_U32 addr = (FMSTR_U32) nAddr;
    
    if(!FMSTR_IsGlobalAddress(addr))
    {
#if defined(__HCS12X__)
        return _CONV_LOGICAL_TO_GLOBAL(nAddr);
#else
        return nAddr;
#endif
    }
    
    return nAddr;
}

#endif /* S12X FMSTR_LARGE_MODEL */

#endif /* !(FMSTR_DISABLE) */
