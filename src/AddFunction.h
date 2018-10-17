
/* Define to prevent recursive inclusion -------------------------------------*/

//#ifndef __AddFuntion_H_
//#define __AddFuntion_H_


#include "PMSM_appconfig.h"

/* motor run speed value */
//电机运行时最大最小转速、堵转保护转速
#define 	MOTOR_N_MAX		(N_MAX) // 运行最大转速(RPM)
#define 	MOTOR_SPEED_MIN_RPM		(200.0) // 运行最小转速(RPM)
#define 	MOTOR_SPEED_LIMIT_RPM   (4000.0) // PI调节
#define 	MOTOR_SPEED_MAX_RPM		(4000.0) // 运行最大转速(RPM)
#define 	MOTOR_SPEED_STAL_RPM	(4200.0) // 堵转保护转速(RPM)
#define 	MOTOR_SPEED_EMPTYRUN    (4100.0) // 空转保护转速(RPM)
#define 	Motor_CHECK_MIN_SPEED			FRAC16(MOTOR_SPEED_MIN_RPM/MOTOR_N_MAX)
#define 	Motor_Max_Speed         FRAC16(MOTOR_SPEED_MAX_RPM/MOTOR_N_MAX)
#define 	Motor_Stall_Speed       FRAC16(MOTOR_SPEED_STAL_RPM/MOTOR_N_MAX)
#define 	Motor_EmptyRun_Speed    FRAC16(MOTOR_SPEED_EMPTYRUN/MOTOR_N_MAX)

#define     POWER_OUT_MAX           ((I_MAX*U_DCB_MAX))
#define     POWER_LIMIT_THRESHOLD   FRAC16(200.0/POWER_OUT_MAX)//limit output power;Input:80w 
#define     POWER_INC               FRAC16(1.0/POWER_OUT_MAX)// 
#define     POWER_RAMPUP            FRAC16(1.0/POWER_OUT_MAX)// 
#define     POWER_REQ_MIN           FRAC16(16.0/POWER_OUT_MAX)//


/*保护参数值------------------------------------------------------------------*/
/* protect value */
#define 	CurrentRecoverEnable	(0) // 电流保护恢复，0,不使能；1，使能
#define 	VoltageProtectEnable	(1) // 电压保护，0,不使能；1，使能
#define 	StartProtectEnable		(0) // 启动保护，0,不使能；1，使能
#define 	StallProtectEnable		(1) // 堵转保护，0,不使能；1，使能
#define 	PhaseLossProtectEnable	(0) // 缺相保护，0,不使能；1，使能
#define		EmptyRunProtectEnable   (0)
#define		OverTempProtectEnable   (0)
//#define     OVER_Voltage 		    (380.0) // over voltage value，过压值
//#define     UNDER_Voltage          	(150.0) // under voltage value，欠压值
#define     OverCurrentValue1     	FRAC16(30.0/I_MAX) // software over current value，软件过流值
#define     StallCurrentValue1     	FRAC16(30.0/I_MAX) // stall over current value，堵转过流值
#define		LossPHLowCurrent        FRAC16(0.05/I_MAX)
#define		LossPHNomCurrent        FRAC16(0.30/I_MAX)
#define		EmptyRunCurrentLow      FRAC16(0.0001/I_MAX)
#define		EmptyRunCurrentHigh     FRAC16(0.5/I_MAX)




/* Exported types -------------------------------------------------------------------------------*/

typedef struct 
{
//voltage protect
    tU16  mcVoltDetecFaultCount;
    tU16  mcOverVoltageCount;
    tU16  mcUnderVoltageCount;
    tU16  mcVoltRecoverCount;	
    tU16  Over_Voltage_Value; 
    tU16  Lower_Voltage_Value;
    tU16  OV_Recover_Value;
    tU16  UV_Recover_Value;
//Current protect
    tS16  Abs_ia;
    tS16  Abs_ib;
    tS16  Abs_ic;
    tS16  OverCurrentValue;	
    tU16  OverCurCnt;
    tU16  CurrentRecoverCnt;
    tU16  currenttime;

//stall protect
    tU16  mcStallCnt;	
    tU16  mcStallESQUDly;
    tU16  mcStallESQUCnt;//method 1
    tU16  mcStallDectSpdDly;
    tU16  mcStallSpeedCnt;//method 2
    tU16  mcStallCurrentDly;//
    tU16  mcStallCurrentCnt;//method 3
    tU16  mcStallEsSpdCnt;//method 4
    //tU16  mcStallRecover;
    tU16  mcStallRestartDly;
    tU16  StallCurrentVale;

    //empty run
    tU16  EmptyStartCnt;
    tU16  EmptyRunCnt;
    tU16  EmptyRunRecoverCnt;
    tU16  EmptyRunTimeCnt;
    tU16  EmptyRunCurrentL;
    tU16  EmptyRunCurrentH;
	
//Loss Phase protect
    tS16  Max_ia; //max value of pmsm_ia;
    tS16  Max_ib; //max value of pmsm_ib;
    tS16  Max_ic; //max value of pmsm_ic;
    tU16  Lphasecnt;		
    tS16  LowCurrent;
    tS16  NomCurrent;
    tU16  AOpencnt; //A phase loss Times
    tU16  BOpencnt;
    tU16  COpencnt;
    tU16  mcLossPHTimes;//loss phase Times
    tU16  mcLossPHCount;//loss phase times Count
    tU16  mcLossPHRecover;//loss phase times
    //Star protect
    tU16  mcStartDelay;
    tU16  mcStartESDelay;
    tU16  mcStartESDectCnt;
    tU16  mcStartSpdDectCnt;
    tU16  mcStartPOSmode;
    tU16  SecondStart;
    tU16  SecondStaDely;
    // Limit protect
    tU16  LimitCount;
    tS16  LimitCurrent;
    tU16  LimitCNT;
    tU16  LimitFlag;
    // temp protect
    tU16  TemperCnt;
    tU16  TemperRecover; 
    
}FaultVarible;

typedef enum
{
    FaultNoSource       = 0,
    FaultSoftOVCurrent	= 1,
    FaultFOCerror   	= 2,	
    FaultUnderVoltage   = 3,
    FaultOverVoltage    = 4,
    FaultLossPhase      = 5,
    FaultStall          = 6,
    FaultStart          = 7,
    FaultEmptyRun       = 8,
    FaultLimCur         = 9,
    FaultOverTemp       = 10,
    FaultGDUerror       = 11,
    FaultPTUerror       = 12,
    FaultPMFerror       = 13
} FaultStateType;

typedef struct  
{		
    volatile unsigned char DIR;
    volatile unsigned char INIT_ACQUIRE;
    volatile unsigned char LEVEL;
    volatile unsigned char ACQUIRE;
    volatile unsigned char ACQUIRE_RED;
    volatile unsigned char ACQUIRE_YELLOW;
    volatile unsigned char ACQUIRE_BLUE;
    volatile unsigned char ROTATION_CHECK;
    volatile unsigned char WINDMILLING;
    volatile unsigned char RETRY_FLAG;

}tcontrol_flags;


/*    by phidia_wang  2017-03-31
typedef enum
{
    FaultNoFlag             = 0,
    FaultOVerCurrentFlag    = 1,
    FaultUnderVoltageFlag   = 2,
    FaultOverVoltageFlag    = 3,
    FaultLossPhaseFlag      = 4,
    FaultStallFlag          = 5,
    FaultEmptyRunFlag       = 6,	
    FaultStartFlag          = 7,
    FaultLimCurFlag         = 8,
    FaultOverTempFlag       = 10,
} FaultFlagType;

typedef struct
{
	tS16   ADCDcbus;
	tS16   ADCSpeed;
	tU16  ADCPower;
} ADCSample;
*/

/*
 * typedef struct
{
    tU16  CtrlMode;
    tU16  SpeedLoopTime;
    tU16  PowerLoopTime;
    tU16  TorqueLoopTime;
    tU16  RunCurrent;
    tU16  mcIqref;
    tU16  mcIqrefMax;
}FOCCTRL;
*/




/* Exported variables ---------------------------------------------------------------------------*/
//extern FOCCTRL  mcFocCtrl;
extern FaultVarible mcFaultDect;
extern FaultStateType mcFaultSource;
//extern ADCSample    AdcSampleValue;
//extern FaultFlagType    mcFaultFlag;
extern tcontrol_flags control_flags;

extern volatile tU16  mcDcbusFlt;
extern volatile tU16  mcTempDecFlt;
extern volatile tS16   mcSpeedFlt;
extern volatile tS16   mcEsValue;
extern volatile tU16 BrakeLoopDuration;
extern volatile unsigned char brakeEnableFlags;
extern volatile tU32 RunningChk_counter;
extern volatile tU8 ADC_channel;
extern volatile tU16 vph_red, vph_yellow, vph_blue;

/* Exported functions ---------------------------------------------------------------------------*/
extern void Fault_OverVoltage(FaultVarible *h_Fault);
extern void Fault_OverCurrentRecover(FaultVarible *h_Fault);
extern void Fault_Overcurrent(FaultVarible *h_Fault);
extern void Fault_Stall(FaultVarible *h_Fault);
extern void Fault_Start(FaultVarible *h_Fault);
extern void Fault_phaseloss(FaultVarible *h_Fault);
extern void Fault_EmptyRun(FaultVarible *h_Fault);
extern void FaultVariablesInit(void);
extern void Fault_Temperature(FaultVarible *h_Fault);
extern void User_Fault_Detection(void);
extern void FaultProcess(void);
extern void GetIABCpeak(void);
extern void Get_AvPeak_Current(void);

//#endif
