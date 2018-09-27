/******************************************************************************
*
* Copyright 2006-2015 Freescale Semiconductor, Inc.
* Copyright 2016-2017 NXP
*
***************************************************************************/

/*****************************************************
    starts12z.c - startup code for S12Z (S12/L-ISA)
 *****************************************************/



#ifndef START_S12Z_H
#define START_S12Z_H

#include <hidef.h>
#include <stdtypes.h>

#ifdef __cplusplus
extern "C" {
#endif


/* these macros remove some unused fields in the startup descriptor */
#define __NO_FLAGS_OFFSET       /* we do not need the flags field in the startup data descriptor */
#define __NO_MAIN_OFFSET        /* we do not need the main field in the startup data descriptor */
#define __NO_STACKOFFSET_OFFSET /* we do not need the stackOffset field in the startup data descriptor */

typedef void (*_PFunc)(void);

typedef struct _Range {
  unsigned char * beg;
  unsigned long size;      /* [beg..beg+size] */
} _Range;

typedef struct _Copy {
  unsigned long size; 
	unsigned char *dest;
} _Copy;

typedef struct _Cpp {
    _PFunc  initFunc;      /* address of init function */
} _Cpp;

extern struct _tagStartup {
     unsigned long   nofZeroOuts;     /* number of zero out ranges */
     _Range *        pZeroOut;        /* vector of ranges with nofZeroOuts elements */
     _Copy *         toCopyDownBeg;   /* rom-address where copydown-data begins */
#ifdef __cplusplus
     unsigned int    nofInitBodies;   /* number of init functions for C++ constructors */
     _Cpp *          initBodies;      /* vector of function pointers to init functions for C++ constructors */
     unsigned int    nofFiniBodies;   /* number of fini functions for C++ destructors */
     _Cpp            finiBodies;      /* vector of function pointers to fini functions for C++ destructors */
#endif
} _startupData;


#ifdef __cplusplus
 }
#endif

#endif /* START_S12Z_H */
