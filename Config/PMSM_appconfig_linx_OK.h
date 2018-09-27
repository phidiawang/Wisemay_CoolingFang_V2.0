/**********************************************************************/
// File Name: {FM_project_loc}/PMSM_appconfig.h 
//
// Date:  13. September, 2018
//
// Automatically generated file by MCAT
// - static configuration of the PMSM FOC application
/**********************************************************************/

#ifndef __PMSM_APPCONFIG_H
#define __PMSM_APPCONFIG_H


//Motor Parameters                      
//----------------------------------------------------------------------
//Pole-pair number                      = 4 [-]
//Stator resistance                     = 0.1498 [Ohms]
//Direct axis inductance                = 0.000131 [H]
//Quadrature axis inductance            = 0.000131 [H]
//Back-EMF constant                     = 0.001769 [V.sec/rad]
//Drive inertia                         = 0.5e-6 [kg.m2]
//Nominal current                       = 10.8 [A]
//Nominal speed                         = 4000 [rpm]

#define MOTOR_PP_GAIN                   FRAC16(0.5)
#define MOTOR_PP_SHIFT                  (3)

//Application scales                    
//----------------------------------------------------------------------
#define I_MAX                           (70.0F)
#define U_DCB_MAX                       (25.0F)
#define N_MAX                           (4500.0F)
#define WEL_MAX                         (1884.96F)
#define E_MAX                           (14.4F)

//Application Fault Triggers            
//----------------------------------------------------------------------
#define U_DCB_TRIP                      FRAC16(0.6400000000)
#define U_DCB_UNDERVOLTAGE              FRAC16(0.3200000000)
#define U_DCB_OVERVOLTAGE               FRAC16(0.6800000000)
#define I_PH_OVER                       FRAC16(0.1328571429)
#define TEMP_OVER                       FRAC16(0.1704897706)

//DC Bus voltage IIR1 filter constants  
//----------------------------------------------------------------------
//Cut-off frequency                     = 50 [Hz]
//Sample time                           = 0.0001 [sec]
//----------------------------------------------------------------------
#define UDCB_IIR_B0                     FRAC16(0.0019331299)
#define UDCB_IIR_B1                     FRAC16(0.0019331299)
#define UDCB_IIR_A1                     FRAC16(-0.1211337402)
//Mechanical Alignment                  
#define ALIGN_VOLTAGE                   FRAC16(0.0500000000)
#define ALIGN_DURATION                  (10000)

//Current Loop Control                  
//----------------------------------------------------------------------
//Loop Bandwidth                        = 300 [Hz]
//Loop Attenuation                      = 0.9 [-]
//Loop sample time                      = 0.0001 [sec]
//----------------------------------------------------------------------
//Current Controller Output Limit       
#define CLOOP_LIMIT                     FRAC16(0.9000000000)
//D-axis Controller - Recurrent type    
#define D_NSHIFT                        (0)
#define D_CC1SC                         FRAC16(0.8902461563)
#define D_CC2SC                         FRAC16(-0.7599200041)
//Q-axis Controller - Recurrent type    
#define Q_NSHIFT                        (0)
#define Q_CC1SC                         FRAC16(0.8902461563)
#define Q_CC2SC                         FRAC16(-0.7599200041)

//Speed Loop Control                    
//----------------------------------------------------------------------
//Loop Bandwidth                        = 10 [Hz]
//Loop Attenuation                      = 1 [-]
//Loop sample time                      = 0.001 [sec]
//----------------------------------------------------------------------
//Speed Controller - Parallel type      
#define SPEED_PI_PROP_GAIN              FRAC16(0.5864582957)
#define SPEED_PI_PROP_SHIFT             (-1)
#define SPEED_PI_INTEG_GAIN             FRAC16(0.5895721835)
#define SPEED_PI_INTEG_SHIFT            (-7)
#define SPEED_LOOP_HIGH_LIMIT           FRAC16(0.0828571429)
#define SPEED_LOOP_LOW_LIMIT            FRAC16(-0.0828571429)

#define SPEED_RAMP_UP                   FRAC32(0.000444)
#define SPEED_RAMP_DOWN                 FRAC32(0.000222)

#define SPEED_LOOP_CNTR                 (10)

#define POSPE_SPEED_FILTER_MA_NPOINT    (4)

//Sensorless DQ BEMF Observer and Tracking Observer
//----------------------------------------------------------------------
//Loop Bandwidth                        = 300 [Hz]
//Loop Attenuation                      = 0.9 [-]
//Loop sample time                      = 0.0001 [sec]
//----------------------------------------------------------------------
//DQ Bemf - plant coefficients          
#define I_GAIN                          FRAC16(0.8918333454)
#define U_GAIN                          FRAC16(0.1289417493)
#define E_GAIN                          FRAC16(0.0742704476)
#define WI_GAIN                         FRAC16(0.0891505461)
#define BEMF_SHIFT                      (0)

//DQ Bemf - PI controller parameters    
#define BEMF_DQ_CC1_GAIN                FRAC16(0.7727831218)
#define BEMF_DQ_CC2_GAIN                FRAC16(-0.6596527813)
#define BEMF_DQ_NSHIFT                  (1)

//Tracking Observer - PI controller parameters
#define TO_CC1SC                        FRAC16(0.5370316324)
#define TO_CC2SC                        FRAC16(-0.5311098698)
#define TO_NSHIFT                       (0)
//Tracking Observer - Integrator        
#define TO_THETA_GAIN                   FRAC16(0.0300000000)
#define TO_THETA_SHIFT                  (0)

//Observer speed output filter          

//Open loop start-up                    
#define OL_START_RAMP_INC               FRAC32(0.0001111)
#define OL_START_I                      FRAC16(0.0142857143)
#define MERG_SPEED_1_TRH                FRAC16(0.0777777778)
#define MERG_SPEED_2_TRH                FRAC16(0.1111111111)

//Control Structure Module - Scalar Control
//----------------------------------------------------------------------
#define SCALAR_VHZ_FACTOR_GAIN          FRAC16(0.6693750000)
#define SCALAR_VHZ_FACTOR_SHIFT         (0)
#define SCALAR_INTEG_GAIN               FRAC16(0.03)
#define SCALAR_INTEG_SHIFT              (0)
#define SCALAR_RAMP_UP                  FRAC16(0.0000400000)
#define SCALAR_RAMP_DOWN                FRAC16(0.0000200000)

//FreeMASTER Scale Variables            
//----------------------------------------------------------------------
//Note: Scaled at input = 1000          
//----------------------------------------------------------------------
#define FM_I_SCALE                      (70000)
#define FM_U_SCALE                      (20000)
#define FM_U_DCB_SCALE                  (25000)
#define FM_SPEED_RAD_EL_SCALE           (1884956)
#define FM_SPEED_RPM_MEC_SCALE          (4500000)
#define FM_POSITION_DEG_SCALE           (180000)

#endif

//End of generated file                 
/**********************************************************************/
