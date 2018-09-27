/**************************** (C) COPYRIGHT 2017  WK *****************************
* File Name          : AddFunction.c
* Author             : Appliction Team 6
* Version            : V1.0
* Date               : 03/27/2017
* Description        : This file contains all the add function used for Motor Control.
***************************************************************************************************
* All Rights Reserved
**************************************************************************************************/


/* Includes -------------------------------------------------------------------------------------*/
#include "mc9s12zvml32.h"
#include "S12zvm_periph.h"
#include "state_machine.h"
#include "mlib.h"
#include "gflib.h"
#include "gmclib.h"
#include "gdflib.h"
#include "motor_structure.h"
#include "S12ZVM_devconfig.h"
#include "meas_s12zvm.h"
#include "actuate_s12zvm.h"
//#include "bemf_Observer.h"
#include "PMSM_appconfig.h"
#include "AddFunction.h"
//#include "MC_key.h"


/* Private variables ---------------------------------------------------------*/

//FaultFlagType   mcFaultFlag;
FaultStateType  mcFaultSource;
//FOCCTRL mcFocCtrl;
FaultVarible mcFaultDect;
tcontrol_flags control_flags;

volatile tS16   segmentstate;
volatile tU16  mcDcbusFlt;
volatile tU16  mcTempDecFlt;
volatile tS16   mcSpeedFlt;
volatile tS16   mcEsValue;


tS16  mcIaPeak;
tS16  mcIbPeak;
tS16  mcIcPeak;

extern pmsmDrive_t drvFOC; // Field Oriented Control Variables
extern driveStates_t cntrState; // Responsible for stateMachine state propagation
extern appFaultStatus_t	permFaults; // Permanent faults to be indicated inhere
extern tPos_mode pos_mode;
extern AvIpeak_t AvIpeakCal;



/*---------------------------------------------------------------------------*/
/* Name		:	void VariablesPreInit(void)
/* Input	:	NO
/* Output	:	NO
/* Description:	��ʼ���������
/*---------------------------------------------------------------------------*/
void FaultVariablesInit(void)
{
/***********����******************/
    mcFaultSource=FaultNoSource;
    mcEsValue = 0;
    mcTempDecFlt=0;

/*****��ѹ����*****/
	mcFaultDect.mcVoltDetecFaultCount = 0;
	mcFaultDect.mcVoltRecoverCount = 0;
	mcFaultDect.mcOverVoltageCount = 0;
	mcFaultDect.mcUnderVoltageCount = 0;
	mcFaultDect.Over_Voltage_Value = U_DCB_OVERVOLTAGE;
    mcFaultDect.OV_Recover_Value = U_DCB_OVERVOLTAGE-FRAC16(2.0/U_DCB_MAX);
	mcFaultDect.Lower_Voltage_Value = U_DCB_UNDERVOLTAGE;
	mcFaultDect.UV_Recover_Value = U_DCB_UNDERVOLTAGE+FRAC16(2.0/U_DCB_MAX);
	
/*******��������*****************/	
	mcFaultDect.Abs_ia = 0;
	mcFaultDect.Abs_ib = 0;
	mcFaultDect.Abs_ic = 0;
	mcFaultDect.OverCurrentValue = I_PH_OVER;//FRAC16(I_PH_OVERCURRENT_FAULT/I_MAX);
	mcFaultDect.OverCurCnt = 0;  
	mcFaultDect.currenttime = 0;
	
/******��ת����*********/	
	//mcFaultDect.mcStallCnt = 0;	
	mcFaultDect.mcStallESQUDly= 0;//4.5s
	mcFaultDect.mcStallESQUCnt= 0;
	mcFaultDect.mcStallDectSpdDly= 0;
	mcFaultDect.mcStallSpeedCnt= 0;
	mcFaultDect.mcStallCurrentDly= 0;
	mcFaultDect.mcStallCurrentCnt= 0;
	mcFaultDect.StallCurrentVale = StallCurrentValue1;
	mcFaultDect.mcStallRestartDly = 0;
	mcFaultDect.mcStallEsSpdCnt= 0;
	
/*******��������*****************/		
	mcFaultDect.mcStartDelay = 0;	
	mcFaultDect.mcStartESDelay= 0;
	mcFaultDect.mcStartESDectCnt= 0;	
	mcFaultDect.mcStartPOSmode = 0;//force
	mcFaultDect.mcStartSpdDectCnt = 0;
	//mcFaultDect.SecondStart= 0;

/******ȱ�ౣ��*********/	
	mcFaultDect.Lphasecnt = 0;
	mcFaultDect.LowCurrent = LossPHLowCurrent;//FRAC16(0.01/I_MAX);
	mcFaultDect.NomCurrent = LossPHNomCurrent;//FRAC16(0.1/I_MAX);
	mcFaultDect.Max_ia = 0;
	mcFaultDect.Max_ib = 0;
	mcFaultDect.Max_ic = 0;
	mcFaultDect.AOpencnt = 0;
	mcFaultDect.BOpencnt = 0;
	mcFaultDect.COpencnt = 0;
	mcFaultDect.mcLossPHCount = 0;	
	mcFaultDect.mcLossPHRecover = 700;//700ms*7

/******���±���*************/
    mcFaultDect.TemperCnt = 0;
    mcFaultDect.TemperRecover = 0;
/******��ת����*************/
    mcFaultDect.EmptyStartCnt = 0;
    mcFaultDect.EmptyRunCnt = 0;
    mcFaultDect.EmptyRunRecoverCnt = 0;
    mcFaultDect.EmptyRunCurrentL = EmptyRunCurrentLow;
    mcFaultDect.EmptyRunCurrentH = EmptyRunCurrentHigh;

}

void FaultProcess(void)
{
    cntrState.state = fault;
    cntrState.event = e_fault;
}

/*****************************************************************************
 * Function:		 void	Fault_OverVoltage(mcFaultVarible *h_Fault)
 * Description:	 ��ѹǷѹ����������ÿ0.25s���һ�Σ������ĸ�ߵ�ѹֵ������ѹ����ֵʱ�����ͣ���������ѹ�������ϣ�
	               �����ѹ����״̬�£������ĸ�ߵ�ѹֵ���ڣ���ѹ����ֵ-20V������2.5sʱ����ѹ����������������mcInit״̬��
	               �����ĸ�ߵ�ѹֵ����Ƿѹ����ֵʱ�����ͣ�������Ƿѹ�������ϣ����Ƿѹ����״̬�£�
	               �����ĸ�ߵ�ѹֵ���ڣ�Ƿѹ����ֵ+20V������2.5sʱ��Ƿѹ����������������mcInit״̬���� 
 * Parameter:		 mcFaultVarible *h_Fault
 * Return:			 no
 *****************************************************************************/
void Fault_OverVoltage(FaultVarible *h_Fault)
{
	h_Fault->mcVoltDetecFaultCount++ ; 				
	if(h_Fault->mcVoltDetecFaultCount > 10)//10ms*7
	{	
		h_Fault->mcVoltDetecFaultCount=0;

        if(mcFaultSource == FaultNoSource)
        {
            //��ѹ����
            if(mcDcbusFlt > h_Fault->Over_Voltage_Value)     
            {
                h_Fault->mcOverVoltageCount++;
                if(h_Fault->mcOverVoltageCount > 10)
                {
                    h_Fault->mcOverVoltageCount = 0;
                    mcFaultSource=FaultOverVoltage;
                    FaultProcess();
                    permFaults.motor.B.OverDCBusVoltage = true;
                }
            }
            else
            {
                if(h_Fault->mcOverVoltageCount>0)
                {           
                    h_Fault->mcOverVoltageCount--;
                }
            }
            
            //Ƿѹ����
            if(mcDcbusFlt< h_Fault->Lower_Voltage_Value)
            {
                h_Fault->mcUnderVoltageCount++;  
                
                if(h_Fault->mcUnderVoltageCount > 10)
                {                                   
                    h_Fault->mcUnderVoltageCount = 0;
                    mcFaultSource=FaultUnderVoltage;
                    FaultProcess();
                    permFaults.motor.B.UnderDCBusVoltage = true;
                }
            }       
            else
            {
                if(h_Fault->mcUnderVoltageCount>0)
                {           
                    h_Fault->mcUnderVoltageCount--;
                }           
            }
        }

		/*******��ѹǷѹ�����ָ�*********/
/*    by phidia_wang  2017-06-05
        if((cntrState.state == fault) &&((mcFaultSource==FaultUnderVoltage)
            ||((mcFaultSource==FaultOverVoltage)))&&(mcDcbusFlt < (h_Fault->OV_Recover_Value))
            &&(mcDcbusFlt > (h_Fault->UV_Recover_Value)))									
		{
			h_Fault->mcVoltRecoverCount++;
			if(h_Fault->mcVoltRecoverCount>30)//30*7*10ms
			{
                h_Fault->mcVoltRecoverCount = 0;
                cntrState.usrControl.switchFaultClear = true;
                mcFaultSource=FaultNoSource;	
			}
		}
		else
		{
			h_Fault->mcVoltRecoverCount = 0;
		}	
*/
	}
}

/*****************************************************************************
 * Function:		 void	Fault_Overcurrent(mcFaultVarible *h_Fault)
 * Description:	 �������������������������κ�һ��ľ���ֵ������������ֵ��OverCurCnt��������1s�ڳ���3��ʱ��
	               �����ж�Ϊ����������������ֹͣ�������ϵ���ָܻ�����1s��OverCurCntС��3��ʱ��OverCurCnt���㡣
 * Parameter:		 mcFaultVarible *h_Fault
 * Return:			 no
 *****************************************************************************/
void Fault_Overcurrent(FaultVarible *h_Fault)
{
	if((cntrState.state != align)) // check over current in run and open mode//(cntrState.state == run)||
	{
		h_Fault->Abs_ia = MLIB_Abs_F16(drvFOC.iAbcFbck.f16Arg1);
		h_Fault->Abs_ib = MLIB_Abs_F16(drvFOC.iAbcFbck.f16Arg2);
		h_Fault->Abs_ic = MLIB_Abs_F16(drvFOC.iAbcFbck.f16Arg3);
		
		h_Fault->currenttime ++;
		if(h_Fault->currenttime>16000)////1.6s����
		{
			h_Fault->currenttime = 0;
			h_Fault->OverCurCnt= 0;
		}
		if((h_Fault->Abs_ia>=h_Fault->OverCurrentValue)
		||(h_Fault->Abs_ib>=h_Fault->OverCurrentValue)
		||(h_Fault->Abs_ic>=h_Fault->OverCurrentValue))
		{
			h_Fault->OverCurCnt++;
			if(h_Fault->OverCurCnt>=3)
			{
                h_Fault->OverCurCnt=0;
                mcFaultSource=FaultSoftOVCurrent;
                FaultProcess();	
                permFaults.motor.B.OverDCBusCurrent = true;
                permFaults.motor.B.OverPhaseACurrent = true;
                //permFaults.motor.B.OverPhaseBCurrent = true;
                //permFaults.motor.B.OverPhaseCCurrent = true;
			}
		}		
	}
}
/*****************************************************************************
* Function     :   void    Fault_OverCurrentRecover(mcFaultVarible *h_Fault)
* Description  :    
* Parameter    :   mcFaultVarible *h_Fault
* Return       :   no
*****************************************************************************/
void Fault_OverCurrentRecover(FaultVarible *h_Fault)
{
    if((cntrState.state == fault)&&(mcFaultSource == FaultSoftOVCurrent))
    {
         h_Fault->CurrentRecoverCnt++;
         if(h_Fault->CurrentRecoverCnt>=300)//300*7=2.1s
         {
             h_Fault->CurrentRecoverCnt=0;
             cntrState.usrControl.switchFaultClear = true;
             mcFaultSource=FaultNoSource;
         }
    }
}

 /*****************************************************************************
 * Function:		 void	Fault_Stall(mcFaultVarible *h_Fault)
 * Description:	 ��ת���������������ֱ�����ʽ��
	               ��һ�֣� ���㷴�綯��С�ڷ�ֵ
	               �ڶ��֣��������״̬�£��ӳ�4s�жϣ������ٶȾ���ֵ������ת�ٶ�����5�Σ�
	               �����֣��������״̬�£���U,V�����������ֵ���ڶ�ת��������ֵ����6�Σ�
	               ���������ֵ��κ�һ�ֱ�������ʱ�����ͣ���������ж�Ϊ��ת������
	               ����ת����״̬�£�U��ɼ�ֵ���ڶ�ת�ָ�ֵʱ������ת����С�ڻ���ڶ�ת��������8�Σ�
	               �����ӳ�mcStallRecover��������������У׼״̬��
 * Parameter:		 mcFaultVarible *h_Fault
 * Return:			 no
 *****************************************************************************/
void Fault_Stall(FaultVarible *h_Fault)
{
    if((cntrState.state == run)&&(pos_mode == sensorless1))//
	{	
        //method 1      
        if(h_Fault->mcStallESQUDly < 400)///400ms*7
        {
            h_Fault->mcStallESQUDly++;
        }
        else
        {
            //mcEsValue = 0;
            if(mcEsValue < FRAC16(0.5/U_DCB_MAX))
            {                       
                h_Fault->mcStallESQUCnt++;
                if((h_Fault->mcStallESQUCnt>=10))
                {   
                    h_Fault->mcStallESQUCnt=0;
                    h_Fault->mcStallESQUDly=0;
                    h_Fault->mcStallCnt++;
                    mcFaultSource = FaultStall;
                    FaultProcess(); 
                    permFaults.motor.B.FaultStall = true;
                }                        
            }           
            else
            {
                if(h_Fault->mcStallESQUCnt >0)
                {
                    h_Fault->mcStallESQUCnt --;
                }           
            }       
        }   


        //method 2      
        if(h_Fault->mcStallDectSpdDly <= 400)///400ms*7
		{ 
			h_Fault->mcStallDectSpdDly++;
		}
		else
        {
			//h_Fault->mcStallDelaDectSpd = 0;
			if((mcSpeedFlt > Motor_Stall_Speed)||(mcSpeedFlt < Motor_CHECK_MIN_SPEED))
			{					 	
				h_Fault->mcStallSpeedCnt++;				
                if(h_Fault->mcStallSpeedCnt>=50)
                {   
                    h_Fault->mcStallSpeedCnt=0;
                    h_Fault->mcStallDectSpdDly=0;
                    h_Fault->mcStallCnt++;
                    mcFaultSource = FaultStall; 
                    FaultProcess(); 
                    permFaults.motor.B.FaultStall = true;
                }       
            }           
            else
            {
				if(h_Fault->mcStallSpeedCnt >0)
				{
					h_Fault->mcStallSpeedCnt --;
				}			
            }               
				
        }

        if(h_Fault->mcStallCurrentDly < 200)///700ms*7
        {
            h_Fault->mcStallCurrentDly ++;
        }
        else
        {
            if((h_Fault->Abs_ia >= h_Fault->StallCurrentVale)||
                (h_Fault->Abs_ib >= h_Fault->StallCurrentVale)||
                (h_Fault->Abs_ic >= h_Fault->StallCurrentVale))//method 3
            {			 
				h_Fault->mcStallCurrentCnt++;				
                if(h_Fault->mcStallCurrentCnt>=10)
                {   
                    h_Fault->mcStallCurrentCnt=0;
                    h_Fault->mcStallCurrentDly=0;
                    h_Fault->mcStallCnt++;
                    mcFaultSource = FaultStall; 
                    FaultProcess(); 
                    permFaults.motor.B.FaultStall = true;
                }       
            }
            else
            {
				if(h_Fault->mcStallCurrentCnt >0)
				{
					h_Fault->mcStallCurrentCnt --;
				}			
            }

            
            ////method 4
            if((mcSpeedFlt > FRAC16(500.0/N_MAX))&&(mcEsValue < FRAC16(1.0/U_DCB_MAX)))
            {       
                h_Fault->mcStallEsSpdCnt++;
                if(h_Fault->mcStallEsSpdCnt >= 10)
                {
                    h_Fault->mcStallEsSpdCnt=0;
                    h_Fault->mcStallCnt++;
                    mcFaultSource = FaultStall; 
                    FaultProcess(); 
                    permFaults.motor.B.FaultStall = true;
                }
            }
            else
            {
                if(h_Fault->mcStallEsSpdCnt >0)
                {
                    h_Fault->mcStallEsSpdCnt --;
                }           
            }   

        }

    }
		 /*******��ת�����ָ�*********/
/*    by phidia_wang  2017-06-05
	if((mcFaultSource==FaultStall)&&(cntrState.state == fault)&&(h_Fault->mcStallCnt<5))
	{
		h_Fault->mcStallRestartDly++;			 
		if(h_Fault->mcStallRestartDly >= 300)////300ms*7//h_Fault->mcStallRecover
		{
			h_Fault->mcStallRestartDly = 0;
			mcFaultSource=FaultNoSource;
            cntrState.usrControl.switchFaultClear = true;
		}					 				 
	}
	else
	{
		h_Fault->mcStallRestartDly=0;	
	}
*/
}
/*-----------------------------------------------------*/
/* Name		:	void Fault_EmptyRun(FaultVarible *h_Fault)
/* Input	    :	FaultVarible *h_Fault
/* Output	:	NO
/* Description:��ˮ��ת����
/*-----------------------------------------------------*/

void Fault_EmptyRun(FaultVarible *h_Fault)
{
	if((cntrState.state == run)&&(pos_mode == sensorless1)) // check over current in rum and open mode
	{
		if(h_Fault->EmptyStartCnt<=800)///500ms*7   
		{
            h_Fault->EmptyStartCnt++;
		}
		else 
		{
            if(((h_Fault->Max_ia>h_Fault->EmptyRunCurrentL) && (h_Fault->Max_ia<h_Fault->EmptyRunCurrentH))&&
                ((h_Fault->Max_ib>h_Fault->EmptyRunCurrentL) && (h_Fault->Max_ib<h_Fault->EmptyRunCurrentH))&&
                ((h_Fault->Max_ic>h_Fault->EmptyRunCurrentL) && (h_Fault->Max_ic<h_Fault->EmptyRunCurrentH))||
                (mcSpeedFlt>=Motor_EmptyRun_Speed))//4000
            {
                h_Fault->EmptyRunCnt++;
                if(h_Fault->EmptyRunCnt>= 30)// ���0.2s=30ms*7
                {
                    h_Fault->EmptyRunCnt = 0;
                    h_Fault->EmptyStartCnt = 0;
                    h_Fault->EmptyRunTimeCnt++;
                    mcFaultSource = FaultEmptyRun;              
                    FaultProcess();
                    permFaults.motor.B.FaultEmptyRun = true;
                    //h_Fault->Max_ia=h_Fault->Max_ib=h_Fault->Max_ic=0;
                }   
            }       
            else
            {
                if(h_Fault->EmptyRunCnt > 0)
                {
                    h_Fault->EmptyRunCnt --;
                }
                else
                    h_Fault->EmptyStartCnt=400;
                //h_Fault->EmptyRunTimeCnt = 0;
            }
		}
	}
	
    /*******��ת��������*********/
/*    by phidia_wang  2017-06-05
    if(((mcFaultSource==FaultEmptyRun)&&(cntrState.state == fault))&&
		((h_Fault->EmptyRunTimeCnt<5)))//����5��
    {	 
        h_Fault->EmptyRunRecoverCnt++;
        if(h_Fault->EmptyRunRecoverCnt>=300)//����ʱ��2s=300ms*7
        {
            mcFaultSource = FaultNoSource;
            cntrState.usrControl.switchFaultClear = true;
            h_Fault->EmptyRunRecoverCnt = 0;					 
        }
									 	 
    }
    else 
    { 
        h_Fault->EmptyRunRecoverCnt = 0;				
    }
*/
	
}

/*****************************************************************************
 * Function:		 void	Fault_Start(mcFaultVarible *h_Fault)
 * Description:	 ���������������������״̬�£������ǰ5s����ת�ٴﵽ��ת����ֵ����5s�󷴵綯��ֵ̫��(�˷���δ��֤)
                  ��4s�ڻ���CtrlMode״̬�����ٶȵ���MOTOR_LOOP_RPM�������ж�Ϊ����ʧ�ܣ����ͣ����
                  �������ж�Ϊ����ʧ�ܺ��������������ڻ����5�Σ�������������У׼״̬���ȴ�������
 * Parameter:		 mcFaultVarible *h_Fault               
 * Return:			 no
 *****************************************************************************/
void Fault_Start(FaultVarible *h_Fault)
{
	if(cntrState.state == run)
	{
    	if(h_Fault->mcStartESDelay < 1500)////400ms*7
    	{
    		if(pos_mode != force)
    		{
        		h_Fault->mcStartESDelay ++;    			
    		}

    	}
    	else if(h_Fault->mcStartESDelay <= 1550)////450ms*7
    	{
    		h_Fault->mcStartESDelay ++;
            if((mcEsValue < FRAC16(0.2/U_DCB_MAX))||(mcSpeedFlt < 0))////0x20
            {
                h_Fault->mcStartESDectCnt++;
                if(h_Fault->mcStartESDectCnt >= 30)////10ms*7
                {
                    mcFaultSource=FaultStart;
                    FaultProcess(); 
                    //mcFaultFlag = FaultStartFlag; 
                    permFaults.motor.B.FaultStart = true;
                    h_Fault->SecondStart++;
                    h_Fault->mcStartESDelay=0;    
                    h_Fault->mcStartESDectCnt=0;
                }
            }
    		else
    		{
                if(h_Fault->mcStartESDectCnt > 0)
                {
                    h_Fault->mcStartESDectCnt --;
                }
    		}

            ////////////////////////////////////////////////////
            if(pos_mode != sensorless1) 
            {
                h_Fault->mcStartPOSmode++;
                if(h_Fault->mcStartPOSmode>=2200)////2200ms*7
                {
                    h_Fault->mcStartPOSmode = 0;
                    h_Fault->mcStartESDelay=0;    
                    mcFaultSource=FaultStart;
                    FaultProcess(); 
                    permFaults.motor.B.FaultStart = true;
                    h_Fault->SecondStart++;
                }
            }
            else
                h_Fault->mcStartPOSmode = 0;
                
    	}

    	/////////////////////////////////////////////////////////////////////
        if((mcSpeedFlt < 0)&&(h_Fault->mcStartESDelay > 100))////�����ת
        {
            mcFaultSource=FaultStart;
            FaultProcess(); 
            //mcFaultFlag = FaultStartFlag; 
            permFaults.motor.B.FaultStart = true;
            h_Fault->SecondStart++;
            h_Fault->mcStartESDelay=0;    
            h_Fault->mcStartESDectCnt=0;
        }
    }
	
    /*******����ʧ������*********/
/*    by phidia_wang  2017-06-05
    if((mcFaultSource==FaultStart)&&(cntrState.state == fault)&&(h_Fault->SecondStart<=5))
    {
        if(h_Fault->SecondStaDely < 300)////300ms*7
        {
			 h_Fault->SecondStaDely ++;
        }
        else
        {
            //h_Fault->mcStartCntDel = 0;
            h_Fault->SecondStaDely = 0;
            mcFaultSource=FaultNoSource;
            cntrState.usrControl.switchFaultClear = true;
            //cntrState.state = init;
        }			 
    }
*/
}	
 
 /*****************************************************************************
 * Function:		 void	Fault_phaseloss(mcFaultVarible *h_Fault)
 * Description:	 ȱ�ౣ�����������������״̬�£�62.5msȡ������������ֵ��
	               2.5s�жϸ���������ֵ���������������ֵ����һ��ֵ�������������ֵȴ�ǳ�С�����ж�Ϊȱ�ౣ�������ͣ����	               
 * Parameter:		 mcFaultVarible *h_Fault
 * Return:			 no
 *****************************************************************************/
void Fault_phaseloss(FaultVarible *h_Fault)
{
    if((cntrState.state == run))//||(cntrState.state == align)	
    {			  																	
        h_Fault->Lphasecnt++;
        if(h_Fault->Lphasecnt>100)////200ms*7
        {
            h_Fault->Lphasecnt=0;
            
            if(h_Fault->Max_ia < h_Fault->LowCurrent && h_Fault->Max_ib > h_Fault->NomCurrent && h_Fault->Max_ic > h_Fault->NomCurrent)
            {
                h_Fault->AOpencnt++;
            }
            else
            {
                h_Fault->AOpencnt = 0;
            }			
            
            if(h_Fault->Max_ib < h_Fault->LowCurrent && h_Fault->Max_ia > h_Fault->NomCurrent && h_Fault->Max_ic > h_Fault->NomCurrent)
            {
                h_Fault->BOpencnt++;
            }
            else
            {
                h_Fault->BOpencnt = 0;
            }
            
            if(h_Fault->Max_ic < h_Fault->LowCurrent && h_Fault->Max_ib > h_Fault->NomCurrent && h_Fault->Max_ia > h_Fault->NomCurrent)
            {
                h_Fault->COpencnt++;
            }
            else
            {
                h_Fault->COpencnt = 0;
            }
                                 
            h_Fault->Max_ia = 0;
            h_Fault->Max_ib = 0;
            h_Fault->Max_ic = 0;
            
            if(h_Fault->AOpencnt >= 2|| h_Fault->BOpencnt >= 2 || h_Fault->COpencnt >= 2)
            {
                h_Fault->AOpencnt=0;
                h_Fault->BOpencnt=0;
                h_Fault->COpencnt=0;
                h_Fault->mcLossPHTimes++;
                mcFaultSource=FaultLossPhase;					
                FaultProcess();
                permFaults.motor.B.FaultLossPhase = true;
                //mcFaultFlag = FaultLossPhase;						
            }
            else
            {
                h_Fault->mcLossPHTimes = 0;
            }
        
        }
    }	
             /*******ȱ�ౣ���ָ�*********/
/*    by phidia_wang  2017-06-05
    if((mcFaultSource==FaultLossPhase)&&(cntrState.state == fault)&&
        (h_Fault->mcLossPHTimes<5))
    {
        h_Fault->mcLossPHCount++;			 
        if(h_Fault->mcLossPHCount>= 300)///300ms*7//h_Fault->mcLossPHRecover
        {					 
            mcFaultSource=FaultNoSource;
            cntrState.usrControl.switchFaultClear = true;
            //mcFaultFlag = FaultNoFlag;	
        }				 
    }
    else
    {
        h_Fault->mcLossPHCount=0;	
    }			 
*/

}
/*****************************************************************************
* Function:         void   Fault_Temperature(mcFaultVarible *h_Fault)
* Description:  ע�⵱ǰ��������ΪPTC����NTC���¶ȼ�Ᵽ����
                ����95��C�¶ȱ���ֵ500ms����뱣����5s����С��85��C���������
* Parameter:        mcFaultVarible *h_Fault               
* Return:           no
*****************************************************************************/
void Fault_Temperature(FaultVarible *h_Fault)
{
    if(mcTempDecFlt >= TEMP_OVER)//FRAC16(TEMP_FAULT/TEMP_MAX)
    {
        h_Fault->TemperCnt++;              
        if(h_Fault->TemperCnt > 100)                             
        {    
            h_Fault->TemperCnt = 0;
            h_Fault->TemperRecover = 0; 
            mcFaultSource = FaultOverTemp;
            FaultProcess();
            permFaults.motor.B.OverHeating = true;
        }     
    }
    else
    {
        if(h_Fault->TemperCnt >0)
        {
            h_Fault->TemperCnt --;
        }           
    }

/*    by phidia_wang  2017-06-05
    if((cntrState.state == fault)&&(mcFaultSource == FaultOverTemp))
    {                           
        if(h_Fault->TemperRecover < 300)///300ms*7                            
        {
            h_Fault->TemperRecover++; 
        }
        else
        {
            if(mcTempDecFlt < (FRAC16((TEMP_FAULT-20)/TEMP_MAX)))    
            {   
                 h_Fault->TemperRecover = 0;                 
                 mcFaultSource=FaultNoSource;
                 cntrState.usrControl.switchFaultClear = true;
            }              
        }     
    }
*/
}


/*---------------------------------------------------------------------------*/
/* Name     :   void Fault_Detection(void)
/* Input    :	NO
/* Output   :	NO
/* Description:	�����������򱣻���ʱ����Ӧ����ܸߣ����÷ֶδ���ÿ5����ʱ���ж�ִ��һ�ζ�Ӧ�ı���
                ���������й�Ƿѹ�����¡���ת��������ȱ��ȱ���������ʱ���ɸ�������һ�����ĵ��Լ��롣
/*---------------------------------------------------------------------------*/
void User_Fault_Detection(void)
{
    segmentstate++;
    if(segmentstate>=7)
        segmentstate=0;
    if(segmentstate==0)
    {
        if(CurrentRecoverEnable==1)
        {	
            Fault_OverCurrentRecover(&mcFaultDect);
        }
    }
    else if(segmentstate==1)
    {	
        if(VoltageProtectEnable==1)
        {					
            Fault_OverVoltage(&mcFaultDect);
        }
    }
    else if(segmentstate==2)
    {
        if(StartProtectEnable==1)
        {	
            Fault_Start(&mcFaultDect);
        }
    }
    else if(segmentstate==3)
    {
        if(StallProtectEnable==1)
        {
            Fault_Stall(&mcFaultDect);
        }
    }
    else if(segmentstate==4)
    {
        if(PhaseLossProtectEnable==1)
        {
            Fault_phaseloss(&mcFaultDect);
        }
    }
    else  if(segmentstate==5)
    {
        if(EmptyRunProtectEnable==1)
        {
            Fault_EmptyRun(&mcFaultDect);
        }
    }
    else if(segmentstate==6)
    {
        if(OverTempProtectEnable==1)
        {
            Fault_Temperature(&mcFaultDect);
        }
    }
}

void GetIABCpeak(void)
{
    /* Sort out the peak current for each phase. */
    if ( (drvFOC.iAbcFbck.f16Arg1 > 0) && (drvFOC.iAbcFbck.f16Arg2 <= 0) && (drvFOC.iAbcFbck.f16Arg3 <= 0) )
    {    // Sort out the Phase A peak current...
        mcIbPeak = mcIcPeak = 0;
        if (drvFOC.iAbcFbck.f16Arg1 > AvIpeakCal.sIABCpeak.f16Arg1)
        {
            AvIpeakCal.sIABCpeak.f16Arg1 = drvFOC.iAbcFbck.f16Arg1;
            if(mcIaPeak < AvIpeakCal.sIABCpeak.f16Arg1)
                mcIaPeak = AvIpeakCal.sIABCpeak.f16Arg1;
            else
                mcFaultDect.Max_ia = mcIaPeak;
            
        }
        AvIpeakCal.f16RtIpeak = AvIpeakCal.sIABCpeak.f16Arg1;
    }
    else
        AvIpeakCal.sIABCpeak.f16Arg1 = 0;

    if ( (drvFOC.iAbcFbck.f16Arg2 > 0) && (drvFOC.iAbcFbck.f16Arg1 <= 0) && (drvFOC.iAbcFbck.f16Arg3 <= 0) )
    {    // Sort out the Phase B peak current...
        mcIaPeak = mcIcPeak = 0;
        if (drvFOC.iAbcFbck.f16Arg2 > AvIpeakCal.sIABCpeak.f16Arg2)
        {
            AvIpeakCal.sIABCpeak.f16Arg2 = drvFOC.iAbcFbck.f16Arg2;
            if(mcIbPeak < AvIpeakCal.sIABCpeak.f16Arg2)
                mcIbPeak = AvIpeakCal.sIABCpeak.f16Arg2;
            else    
                mcFaultDect.Max_ib = mcIbPeak;
        }
        AvIpeakCal.f16RtIpeak = AvIpeakCal.sIABCpeak.f16Arg2;
    }
    else
        AvIpeakCal.sIABCpeak.f16Arg2 = 0;
        
    if ( (drvFOC.iAbcFbck.f16Arg3 > 0) && (drvFOC.iAbcFbck.f16Arg1 <= 0) && (drvFOC.iAbcFbck.f16Arg2 <= 0) )
    {    // Sort out the Phase A peak current...
        mcIaPeak = mcIbPeak = 0;
        if (drvFOC.iAbcFbck.f16Arg3 > AvIpeakCal.sIABCpeak.f16Arg3)
        {
            AvIpeakCal.sIABCpeak.f16Arg3 = drvFOC.iAbcFbck.f16Arg3;
            if(mcIcPeak < AvIpeakCal.sIABCpeak.f16Arg3)
                mcIcPeak = AvIpeakCal.sIABCpeak.f16Arg3;
            else    
                mcFaultDect.Max_ic = mcIcPeak;
        }
        AvIpeakCal.f16RtIpeak = AvIpeakCal.sIABCpeak.f16Arg3;
    }
    else
        AvIpeakCal.sIABCpeak.f16Arg3 = 0;

}

void Get_AvPeak_Current(void)
{
    if((cntrState.state == run))//||(cntrState.state == align)  
    {
        /* AvIpeak filter */
        AvIpeakCal.f16AvIpeakFilt =
            GDFLIB_FilterMA_F16(AvIpeakCal.f16RtIpeak, &AvIpeakCal.uAvIpeakFilter);
    }
}


