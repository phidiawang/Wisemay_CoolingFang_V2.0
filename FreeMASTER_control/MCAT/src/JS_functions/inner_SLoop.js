/*******************************************************************************
*
* Copyright 2014 Freescale Semiconductor, Inc.

*
* This software is owned or controlled by Freescale Semiconductor.
* Use of this software is governed by the Freescale License
* distributed with this Material.
* See the LICENSE file distributed for more details.
* 
*
****************************************************************************//*!
*
* @file   inner_SLoop.js
*
* @brief  Cpeed control loop engine
*
******************************************************************************/
/******************************************************************************
* List of functions
******************************************************************************
* initLoadFormSloop() - init Speed Loop control page paramters and constants  
* clickCalculateSloop() - calculates control constants based on input parameters
* clickUpdateSloopFM() - update selected variables in FreeMASTER application
* writeSLoopHTMLOutput(prefix,xmlObject) - write selected constants to output preview page 
* writeSLoopHeaderOutput(str,prefix) - write selected constants to output header file
*******************************************************************************/
/***************************************************************************//*!
*
* @brief  The function loads values from inner storage table to forms based
*         on parameter ID 
* @param   
* @return 
* @remarks 
******************************************************************************/
var SPEED_MAF_L_filt;
var SPEED_MAF_N_filt;
    
function initLoadFormSloop()
{
    var valType        = parent.document.getElementById("Arithmetic").innerText;
    
    // in basic mode, precalculate paramters
    if(getActiveMode()===0)
      basicModeCalcSLoop();
    
    copyParent2InnerValById("SLOOP_F0");   
    copyParent2InnerValById("SLOOP_Att");
    copyParent2InnerValById("SLOOP_Ts");

    copyParent2InnerValById("RAMP_UP");   
    copyParent2InnerValById("RAMP_DOWN");
    copyParent2InnerValById("SPEED_MAF_L"); 
    copyParent2InnerValById("SPEED_MAF_N"); 
    copyParent2InnerValById("SPEED_IIR_FREQ");
    
    copyParent2InnerValById("SL_HIGH_LIM");   
    copyParent2InnerValById("SL_LOW_LIM");
   
    // display only required type of Speed filter           
    document.getElementById("SpeedFilterIIR").style.display = "none";
    document.getElementById("SpeedFilterMAF_lambda").style.display = "none"; 
    document.getElementById("SpeedFilterMAF_npoint").style.display = "none"; 
    document.getElementById("Speed_IIR_filt").style.display = "none";
    
    if(testVarValue('WFilt','MA Filter (lambda)'))
    {
        document.getElementById("SpeedFilterMAF_lambda").style.display = ""; 
    }    
    if(testVarValue('WFilt','MA Filter (n-point)'))
    {
        document.getElementById("SpeedFilterMAF_npoint").style.display = ""; 
    }    
    if(testVarValue('WFilt','IIR Filter'))
    {
        document.getElementById("SpeedFilterIIR").style.display = ""; 
    }    
  
    // display only required type of PI controller, either Recurrent or Paraller
    if(testVarValue('Scontroller','Parallel'))
    {
        document.getElementById("Speed_PIparal").style.display = "";
        document.getElementById("Speed_PIrecur").style.display = "none";   
       
         // Disable shift values for Float implementation
         if(valType ==='Float'){
         document.getElementById("row_SL_Kp_sh").style.display = 'none';
         document.getElementById("row_SL_Ki_sh").style.display = 'none';        
        }        
    }
    else
    {
        document.getElementById("Speed_PIparal").style.display = "none";
        document.getElementById("Speed_PIrecur").style.display = "";
        
        // Disable shift values for Float implementation
        if(valType ==='Float')
        document.getElementById("row_SL_Nsh").style.display = 'none';
    }
    
     // display Zero Cancellation filter constants
    if(testVarValue('FFw_SL','Zero Cancellation'))
    {
        document.getElementById("Speed_ZC").style.display = '';
    }
    else
    {
        document.getElementById("Speed_ZC").style.display = 'none';
    }    
        
     // display speed IIR filter constants
    if(testVarValue('WFilt','IIR Filter'))
    {
        document.getElementById("Speed_IIR_filt").style.display = '';
    }
    else
    {
        document.getElementById("Speed_IIR_filt").style.display = 'none';
    }  
    
    // display Speed ramp constants
    if(testVarValue('FFw_SL','Incremental Ramp'))
    { 
        document.getElementById("SpeedRamp").style.display = "";
        document.getElementById("SpeedRamp_out").style.display = "";
    }    
    else
    {
        document.getElementById("SpeedRamp").style.display = "none";
        document.getElementById("SpeedRamp_out").style.display = "none";
    }   

    //document.getElementById("Arithmetic").innerText = parent.document.getElementById("Arithmetic").innerText;
    
    // enable button enabling
    ReloadStoreButtonsOnOff(1);
   
    // check manual tuning mode
    //get active motor to select proper prefix
    var prefixM = getActiveMotor();
    if(parent.document.getElementById(prefixM + 'SLOOP_PI_MAN_EN').innerHTML==='1')
      document.getElementById(prefixM+'SL_PImanualTuning').checked=true;
    else
      document.getElementById(prefixM+'SL_PImanualTuning').checked=false;  
    
    //calculate constants
    clickCalculateSloop();
    
    // manual tunning function
    SL_PImanualTuning();  
    
}

/***************************************************************************//*!
*
* @brief   Mark the Labels in the Fieldsets that's going to be updated
* @param   
* @return  None                                                                             
* @remarks 
******************************************************************************/
function markUpdateSLField()
{
    var obj = document.getElementById("Speed_PIparal").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';
    var obj = document.getElementById("Speed_PIparal_manual").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';    
    var obj = document.getElementById("Speed_PIrecur").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';
    var obj = document.getElementById("SpeedRamp_out").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';      
    var obj = document.getElementById("Speed_ZC").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';
    var obj = document.getElementById("Speed_IIR_filt").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';    
    var obj = document.getElementById("SpeedFilterMAF_lambda").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';    
    var obj = document.getElementById("SpeedFilterMAF_npoint").getElementsByTagName('legend')[0];    
    obj.className = 'fontControlLabelred';        
    var obj = document.getElementById("SpeedPIlimits").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';  
        
    document.getElementById("SLoopUpdateFrm").title = "Red-headline constants will be updated to MCU on click"
}

/***************************************************************************//*!
* @brief   UnMark the Labels in the Fieldsets that's going to be updated
* @param   
* @return  None
* @remarks 
******************************************************************************/
function unmarkUpdateSLField()
{
    var obj = document.getElementById("Speed_PIparal").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';
    var obj = document.getElementById("Speed_PIparal_manual").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';    
    var obj = document.getElementById("Speed_PIrecur").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';
    var obj = document.getElementById("SpeedRamp_out").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';    
    var obj = document.getElementById("Speed_ZC").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';
    var obj = document.getElementById("Speed_IIR_filt").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';       
    var obj = document.getElementById("SpeedFilterMAF_lambda").getElementsByTagName('legend')[0]; 
    obj.className = 'fontControlLabel'    
    var obj = document.getElementById("SpeedFilterMAF_npoint").getElementsByTagName('legend')[0]; 
    obj.className = 'fontControlLabel'    
    
        var obj = document.getElementById("SpeedPIlimits").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel'; 
}

/***************************************************************************//*!
* @brief   Reload and Store button - hint appears on mouse over the button
* @param   
* @return  None
* @remarks 
******************************************************************************/
function reloadSLField()
{
    document.getElementById("ReloadData").title = "Reloading input parameters from an MCAT external file";
}

function storeSLField()
{
    document.getElementById("StoreData").title = "Storing input parameters to an MCAT external file";
}

/***************************************************************************//*!
*
* @brief   Parameter Calculation in BASIC mode
* @param   
* @return  None
* @remarks 
******************************************************************************/
function basicModeCalcSLoop()
{
    var Rs            = getParentHtmlValue("Rs");
    var Lq            = getParentHtmlValue("Lq");
    var I_ph          = getParentHtmlValue("I_ph");
    var SLOOP_Ts      = getParentHtmlValue("SLOOP_Ts");
    var CLOOP_fo      = getParentHtmlValue("CLOOP_F0");
    
    // calculated input parameters
    SLoop_bandwidth = Math.round(CLOOP_fo/10);
    
    // replace and disable params
    switchParam2BasicMode("SLOOP_Ts",SLOOP_Ts);
    switchParam2BasicMode("SLOOP_F0",SLoop_bandwidth);
    switchParam2BasicMode("SPEED_MAF_L",0.5); 
    switchParam2BasicMode("SPEED_MAF_N",2); 
    switchParam2BasicMode("SPEED_IIR_FREQ",30);
    switchParam2BasicMode("SL_HIGH_LIM",I_ph);
    switchParam2BasicMode("SL_LOW_LIM",-I_ph);
    
    if(testVarValue('FFw_SL','Zero Cancellation'))
      switchParam2BasicMode("SLOOP_Att",0.707);
    else
      switchParam2BasicMode("SLOOP_Att",1);                                                

}

/***************************************************************************//*!
*
* @brief  The function calculates ouput constans based on input parameters   
* @param   
* @return  None
* @remarks 
******************************************************************************/
function clickCalculateSloop()
{
    // need to be global vars due FM update
    SLOOP_Up_lim  = getParentHtmlValue("SL_HIGH_LIM");   
    SLOOP_Low_lim = getParentHtmlValue("SL_LOW_LIM");
    SPEED_MAF_L_filt  = getParentHtmlValue("SPEED_MAF_L");
    SPEED_MAF_N_filt  = getParentHtmlValue("SPEED_MAF_N");
    
    var SLOOP_Ts      = getParentHtmlValue("SLOOP_Ts");
    var SLOOP_F0      = getParentHtmlValue("SLOOP_F0");
    var SLOOP_att     = getParentHtmlValue("SLOOP_Att");       
    var RAMP_Up       = getParentHtmlValue("RAMP_UP");
    var RAMP_Down     = getParentHtmlValue("RAMP_DOWN");
    var SPEED_IIR_filt= getParentHtmlValue("SPEED_IIR_FREQ");
    var Imax          = getParentHtmlValue("I_max");
    var Nmax          = getParentHtmlValue("N_max");
    var kt            = getParentHtmlValue("kt");
    var J             = getParentHtmlValue("J");  
    var CLOOP_Ts      = getParentHtmlValue("CLOOP_Ts"); 
    var PP            = getParentHtmlValue("pp");   
    var Tmax          = Imax*kt; 
    var Wmax          = 2*Math.PI*PP*Nmax/60;

    var W_KP_Z_MAN      = getParentHtmlValue("SLOOP_KP_Z_MAN"); 
    var W_KI_Z_MAN      = getParentHtmlValue("SLOOP_KI_Z_MAN");
    var SL_MAN_TUN    = getParentHtmlValue("SLOOP_PI_MAN_EN");
    var IIRxCoefsScaleType     = parent.document.getElementById("IIRxCoefsScale").innerText;
    
    var valType     = parent.document.getElementById("Arithmetic").innerText;
    //////////////////////// Related to SPEED LOOP ///////////////////				
    if (SL_MAN_TUN){
     W_Kpz = W_KP_Z_MAN;
     W_Kiz = W_KI_Z_MAN;
     }
    else{
     // Pole placement method for speed PI parameters calculation   
     W_Kps = 2*SLOOP_att*2*Math.PI*SLOOP_F0*J/kt;	
     W_Kis = (Math.pow((2*Math.PI*SLOOP_F0),2)*J)/kt;	
     
     // Billinear discretization method, from "s" to "z" domain
     W_Kpz = W_Kps;
     W_Kiz = W_Kis*SLOOP_Ts/2;
    }
    
    // Normalization of PI constants
    W_Kpz_f = W_Kpz*Wmax/Imax;	
    W_Kiz_f = W_Kiz*Wmax/Imax;
    
    // Ssaling the PI constants into the <-1,1) range 
    W_Kp_gain     = getScale(W_Kpz_f);
    W_Ki_gain     = getScale(W_Kiz_f);
    
    W_Kp_shift    = getScaleShift(W_Kpz_f);   
    W_Ki_shift    = getScaleShift(W_Kiz_f);   
    
    ///// ************** RECCURENT PI CONTROLLER TYPE ***************** ///////
    // PIrec constants calculated from PIp constants, "z" domain
    W_CC1z = W_Kpz + W_Kiz;
    W_CC2z = -W_Kpz + W_Kiz;
    
    // Normalization of PI constants          
    W_CC1f = W_CC1z*Wmax/Tmax;
    W_CC2f = W_CC2z*Wmax/Tmax;
    
    // scale shift
    if ((Math.abs(W_CC1f)<1) && (Math.abs(W_CC2f)<1))  
            W_Nshift = 0;
    else
    {
      if (Math.abs(W_CC1f) > Math.abs(W_CC2f))
            W_Nshift = getScaleShift(W_CC1f); 
      else
            W_Nshift = getScaleShift(W_CC2f); 
    }
    
    W_CC1_gain = W_CC1f/Math.pow(2,W_Nshift);
    W_CC2_gain = W_CC2f/Math.pow(2,W_Nshift);
    
    // Zero cancelation block in feedforward path of the current control loop    
    // Zero-cross cancelation filter constants
    W_ZC_B0_fl = W_Kiz*2/(W_Kpz+W_Kiz*2);
    W_ZC_B1_fl = 0.0;
    W_ZC_A1_fl = -W_Kpz/(W_Kpz+W_Kiz*2);
    
    W_ZC_B0_out = W_ZC_B0_fl/IIRxCoefsScaleType;
    W_ZC_B1_out = W_ZC_B1_fl/IIRxCoefsScaleType;
    W_ZC_A1_out = W_ZC_A1_fl/IIRxCoefsScaleType;
    //testFracValRange("W_ZC_B0_out",W_ZC_B0_out,1);
    //testFracValRange("W_ZC_B1_out",W_ZC_B1_out,1);
    //testFracValRange("W_ZC_A1_out",W_ZC_A1_out,1);
    
    // speed ramp increments
    rampIncUp_float      = Math.round(RAMP_Up*2*Math.PI*PP/60*SLOOP_Ts*100000)/100000;
    rampIncDown_float    = Math.round(RAMP_Down*2*Math.PI*PP/60*SLOOP_Ts*100000)/100000;
    rampIncUp            = Math.round(rampIncUp_float/Wmax*1000000)/1000000;
    rampIncDown          = Math.round(rampIncDown_float/Wmax*1000000)/1000000;
    
    testFracValRange("rampIncUp",rampIncUp,1);
    testFracValRange("rampIncDown",rampIncDown,1);
    
    // scalar speed ramp increments
    /*ScalarRampIncUp_float = RAMP_Up*CLOOP_Ts;
    ScalarRampIncDown_float = RAMP_Down*CLOOP_Ts;
    ScalarRampIncUp =  Math.round(RAMP_Up/60*PP*2*Math.PI/Wmax*CLOOP_Ts*1000000000000)/1000000000000;
    ScalarRampIncDown =  Math.round(RAMP_Down/60*PP*2*Math.PI/Wmax*CLOOP_Ts*1000000000000)/1000000000000;
    testFracValRange("ScalarRampIncUp",ScalarRampIncUp,1);
    testFracValRange("ScalarRampIncDown",ScalarRampIncDown,1);*/
    
    // PI controller limits scaled
    Upper_limit = SLOOP_Up_lim/Imax;
    Lower_limit = SLOOP_Low_lim/Imax;
    testFracValRange("Upper_limit",Upper_limit,1);
    testFracValRange("Lower_limit",Lower_limit,1);
    
    // actual speed IIR filter
    W_IIR_B0_fl =  (2*Math.PI*SPEED_IIR_filt*SLOOP_Ts)/(2+(2*Math.PI*SPEED_IIR_filt*SLOOP_Ts)).toFixed(11); 
    W_IIR_B1_fl =  W_IIR_B0_fl;
    W_IIR_A1_fl =  (2*Math.PI*SPEED_IIR_filt*SLOOP_Ts-2)/(2+(2*Math.PI*SPEED_IIR_filt*SLOOP_Ts)).toFixed(11);
    W_IIR_B0_out = W_IIR_B0_fl/IIRxCoefsScaleType;
    W_IIR_B1_out = W_IIR_B1_fl/IIRxCoefsScaleType;
    W_IIR_A1_out = W_IIR_A1_fl/IIRxCoefsScaleType;
    
    
    /*testFracValRange("W_IIR_B0_out",W_IIR_B0_out,1);
    testFracValRange("W_IIR_B1_out",W_IIR_B1_out,1);
    testFracValRange("W_IIR_A1_out",W_IIR_A1_out,1);*/
    // speed counter
    speedCounter =  Math.round(SLOOP_Ts / CLOOP_Ts);
    
    // If SPEED LOOP tab is active ******************************************
    if(document.getElementById("SLoop") != undefined)
    {
      // write values to forms in current Html page
      setInnerHtmlValue("SL_Kp_g",W_Kp_gain,W_Kpz);
      setInnerHtmlValue("SL_Ki_g",W_Ki_gain,W_Kiz);
      setInnerHtmlValue("SL_Kp_sh",W_Kp_shift,'N/A');
      setInnerHtmlValue("SL_Ki_sh",W_Ki_shift,'N/A');      
      
      // write values to forms in current Html page
      //setInnerHtmlValue("SLOOP_KP_MAN",W_Kp_gain,W_Kpz);
      //setInnerHtmlValue("SLOOP_KI_MAN",W_Ki_gain,W_Kiz);      
      setInnerHtmlValue("SLOOP_KP_MAN",W_Kp_gain,W_Kpz);
      setInnerHtmlValue("SLOOP_KI_MAN",W_Ki_gain,W_Kiz);
      setInnerHtmlValue("SLOOP_KP_SHIFT_MAN",W_Kp_shift,'N/A');
      setInnerHtmlValue("SLOOP_KI_SHIFT_MAN",W_Ki_shift,'N/A');       
      
      // write values to forms in current Html page
      setInnerHtmlValue("SL_CC1",W_CC1_gain,W_CC1z);
      setInnerHtmlValue("SL_CC2",W_CC2_gain,W_CC2z);
      setInnerHtmlValue("SL_Nsh",W_Nshift,'N/A');      

      //if(testVarValue('FFw_SL','Incremental Ramp'))
     // {
      // write values to forms in current Html page
      setInnerHtmlValue("RAMP_UP_OUT",rampIncUp_float,rampIncUp_float);
      setInnerHtmlValue("RAMP_DOWN_OUT",rampIncDown_float,rampIncDown_float);
       // }
      
      // Zero cancelation
      setInnerHtmlValue("SL_ZC_B0",W_ZC_B0_fl,W_ZC_B0_fl);
      setInnerHtmlValue("SL_ZC_B1",W_ZC_B1_fl,W_ZC_B1_fl);
      setInnerHtmlValue("SL_ZC_A1",W_ZC_A1_fl,W_ZC_A1_fl);
      
      // Speed filtering using IIR filter
      setInnerHtmlValue("SL_IIR_B0",W_IIR_B0_fl,W_IIR_B0_fl);
      setInnerHtmlValue("SL_IIR_B1",W_IIR_B1_fl,W_IIR_B1_fl);
      setInnerHtmlValue("SL_IIR_A1",W_IIR_A1_fl,W_IIR_A1_fl);
    }
      
     // If HEADER FILE tab is active ********************************************
     if(document.getElementById("HeaderFileTab") != undefined)
     {	
        if(testVarValue('Scontroller','Parallel')) // parallel type of PI controller
        {
          // write values to forms in current Html page
          setInnerHtmlValueAsText("SPEED_PI_PROP_GAIN",0,W_Kp_gain, W_Kpz);
          setInnerHtmlValueAsText("SPEED_PI_PROP_SHIFT",1,W_Kp_shift,'N/A');
          setInnerHtmlValueAsText("SPEED_PI_INTEG_GAIN",0,W_Ki_gain, W_Kiz);
          setInnerHtmlValueAsText("SPEED_PI_INTEG_SHIFT",1,W_Ki_shift,'N/A');
        }
        else // reccurent type of PI controller 
        {
          // write values to forms in current Html page
          setInnerHtmlValueAsText("SPEED_NSHIFT",1,W_Nshift,'N/A');
          setInnerHtmlValueAsText("SPEED_CC1SC",0,W_CC1_gain,W_CC1z);
          setInnerHtmlValueAsText("SPEED_CC2SC",0,W_CC2_gain,W_CC2z);
        }
        
        if(testVarValue('FFw_SL','Zero Cancellation'))
        {
          // Zero cancelation
          setInnerHtmlValueAsText("SPEED_ZC_B0",0,W_ZC_B0_out,W_ZC_B0_out);
          setInnerHtmlValueAsText("SPEED_ZC_B1",0,W_ZC_B1_out,W_ZC_B1_out);
          setInnerHtmlValueAsText("SPEED_ZC_A1",0,W_ZC_A1_out,W_ZC_A1_out);
        } 
      
        if(testVarValue('FFw_SL','Incremental Ramp'))
        {
          // ramp increment
          if(valType=='Frac16'){
            setInnerHtmlValueAsText("SPEED_RAMP_UP",7,rampIncUp,rampIncUp_float);
            setInnerHtmlValueAsText("SPEED_RAMP_DOWN",7,rampIncDown,rampIncDown_float);}
          else
          { setInnerHtmlValueAsText("SPEED_RAMP_UP",0,rampIncUp,rampIncUp_float);
            setInnerHtmlValueAsText("SPEED_RAMP_DOWN",0,rampIncDown,rampIncDown_float);
            }
          
        }
     //   setInnerHtmlValueAsText("SCALAR_RAMP_UP",0,ScalarRampIncUp,ScalarRampIncUp_float);
     //   setInnerHtmlValueAsText("SCALAR_RAMP_DOWN",0,ScalarRampIncDown,ScalarRampIncDown_float);
          
        // Speed controller limits
        setInnerHtmlValueAsText("SPEED_LOOP_HIGH_LIMIT",0,Upper_limit,SLOOP_Up_lim);
        setInnerHtmlValueAsText("SPEED_LOOP_LOW_LIMIT",0,Lower_limit,SLOOP_Low_lim);
        
        // speed counter
        speedCounter =  Math.round(SLOOP_Ts / CLOOP_Ts);
        setInnerHtmlValueAsText("SPEED_LOOP_CNTR",2,speedCounter);
        // speed counter
        SL_freq =  Math.round(1/SLOOP_Ts);
        setInnerHtmlValueAsText("SPEED_LOOP_FREQ",2,SL_freq);
        
        if(testVarValue('WFilt','MA Filter (lambda)'))
        {
          //speed MA filter with Lambda parameter
          setInnerHtmlValueAsText("SPEED_FILTER_MA_L",0,SPEED_MAF_L_filt,SPEED_MAF_L_filt);
        }
        else if(testVarValue('WFilt','MA Filter (n-point)'))
        {
          //speed MA filter with N-point parameter
          setInnerHtmlValueAsText("SPEED_FILTER_MA_N",2,SPEED_MAF_N_filt);   
        }
        else if(testVarValue('WFilt','IIR Filter'))
        {
          //speed IIR filter
          setInnerHtmlValueAsText("SPEED_IIR_B0",0,W_IIR_B0_out,W_IIR_B0_out);
          setInnerHtmlValueAsText("SPEED_IIR_B1",0,W_IIR_B1_out,W_IIR_B1_out);
          setInnerHtmlValueAsText("SPEED_IIR_A1",0,W_IIR_A1_out,W_IIR_A1_out);
        }
         
     }   
 } 
/* ----------- End of PI controller parameters routine -------------- */  

/***************************************************************************//*!
*
* @brief   update variables in FreeMASTER application
* @param   
* @return  None
* @remarks 
******************************************************************************/
function clickUpdateSloopFM(){
    
  if(!pcm.IsCommPortOpen())
  {
      alert("Communication is stopped.\nPress Ctrl+K to start the communication");
  }
  else
  {
    xmlDoc=loadXMLDoc("xml_files\\FM_params_list.xml"); 
    var MotorPrefix = getActiveMotor();
    var errorArray = [];
    
    // calculate actual constant values
    clickCalculateSloop();

    var PositionType = Number(parent.document.getElementById(MotorPrefix + 'PospeFbck').innerText);
    var aritType     = parent.document.getElementById("Arithmetic").innerText;
        
    if(testVarValue('Scontroller','Parallel')) // parallel type of PI controller
    {
        errorArray.push(UpdateFMVariable(xmlDoc,'SL_Kp_g',W_Kp_gain, W_Kpz));
        errorArray.push(UpdateFMVariable(xmlDoc,'SL_Ki_g',W_Ki_gain, W_Kiz));
        
        if (aritType!=='Float')
        {        
        errorArray.push(UpdateFMVariable(xmlDoc,'SL_Ki_sc',W_Ki_shift));
        errorArray.push(UpdateFMVariable(xmlDoc,'SL_Kp_sc',W_Kp_shift));
        }
     }
     else // reccurent type of PI controller
     {
        if (aritType!=='Float')
        errorArray.push(UpdateFMVariable(xmlDoc,'SL_Nsh',W_Nshift));
        errorArray.push(UpdateFMVariable(xmlDoc,'SL_CC1SC',W_CC1_gain,W_CC1z));
        errorArray.push(UpdateFMVariable(xmlDoc,'SL_CC2SC',W_CC2_gain,W_CC2z));
     }
  
    // PI controller limits
    errorArray.push(UpdateFMVariable(xmlDoc,'SL_UP_LIM',SLOOP_Up_lim,SLOOP_Up_lim));
    errorArray.push(UpdateFMVariable(xmlDoc,'SL_LOW_LIM',SLOOP_Low_lim,SLOOP_Low_lim));
    
    // speed ramp
    if(testVarValue('FFw_SL','Incremental Ramp'))
    {
        errorArray.push(UpdateFMVariable(xmlDoc,'RAMP_UP_g',rampIncUp,rampIncUp_float));
        errorArray.push(UpdateFMVariable(xmlDoc,'RAMP_DOWN_g',rampIncDown,rampIncDown_float));
    } 

    /* scalar control V/Hz ramp */
   // errorArray.push(UpdateFMVariable(xmlDoc,'Scalar_ramp_up',ScalarRampIncUp,ScalarRampIncUp_float));
  //  errorArray.push(UpdateFMVariable(xmlDoc,'Scalar_ramp_down',ScalarRampIncDown,ScalarRampIncDown_float));
  
        
    if(testVarValue('WFilt','MA Filter (lambda)'))
    {
      //speed MA -lambda filter
        // encoder
        if((PositionType>>>0)&1) 
            errorArray.push(UpdateFMVariable(xmlDoc,'SPEED_ENC_MAF_sc',SPEED_MAF_L_filt,SPEED_MAF_L_filt));
        // resolver
        if((PositionType>>>1)&1)
            errorArray.push(UpdateFMVariable(xmlDoc,'SPEED_RES_MAF_sc',SPEED_MAF_L_filt,SPEED_MAF_L_filt));
        // sensorless
        if((PositionType>>>2)&1)
            errorArray.push(UpdateFMVariable(xmlDoc,'SPEED_SLSS_MAF_sc',SPEED_MAF_L_filt,SPEED_MAF_L_filt));
    }
    
    if(testVarValue('WFilt','MA Filter (n-point)'))
    {
      //speed MA npoint filter
        //encoder
        if((PositionType>>>0)&1) 
            errorArray.push(UpdateFMVariable(xmlDoc,'SPEED_ENC_MAF_sc',SPEED_MAF_N_filt,SPEED_MAF_N_filt));
        // resolver
        if((PositionType>>>1)&1)
            errorArray.push(UpdateFMVariable(xmlDoc,'SPEED_RES_MAF_sc',SPEED_MAF_N_filt,SPEED_MAF_N_filt));
        // sensorless
        if((PositionType>>>2)&1)
            errorArray.push(UpdateFMVariable(xmlDoc,'SPEED_SLSS_MAF_sc',SPEED_MAF_N_filt,SPEED_MAF_N_filt));            
    }    
    
    if(testVarValue('WFilt','IIR Filter'))
    {
       //speed IIR filter
       errorArray.push(UpdateFMVariable(xmlDoc,'SPEED_IIR_B0_g',W_IIR_B0_out));
       errorArray.push(UpdateFMVariable(xmlDoc,'SPEED_IIR_B1_g',W_IIR_B1_out));
       errorArray.push(UpdateFMVariable(xmlDoc,'SPEED_IIR_A1_g',W_IIR_A1_out));
    }
    
    // display error message                           
    UpdateError(errorArray);
  }                           
 }

/***************************************************************************//*!
*
* @brief  The function reads values from input forms, scales them and write 
*         to output HTML form
* @param   
* @return 
* @remarks 
******************************************************************************/
function writeSLoopHTMLOutput(prefix,xmlObject)
{
    
    // Speed Loop Control
    document.write(HTML_write_blank_line());     
    document.write(HTML_write_comment_line("Speed Loop Control","",""));
    document.write(HTML_write_comment_line_dash()); 
    
    if(parent.document.getElementById(prefixM + 'SLOOP_PI_MAN_EN').innerHTML==='1'){
        document.write(HTML_write_comment_line("Manually tuned PI controller parameters","",""));
    }
    else{
        document.write(HTML_write_comment_line("Loop bandwidth","SLOOP_F0",""));
        document.write(HTML_write_comment_line("Loop attenuation","SLOOP_Att",""));
    }
    
    document.write(HTML_write_comment_line("Loop sample time","SLOOP_Ts",""));
    
    if(testVarValue('Scontroller','Parallel'))
    {
      document.write(HTML_write_define_line_number(prefix,0,"SPEED_PI_PROP_GAIN",xmlObject));
      document.write(HTML_write_define_line_number(prefix,1,"SPEED_PI_PROP_SHIFT",xmlObject));
      document.write(HTML_write_define_line_number(prefix,0,"SPEED_PI_INTEG_GAIN",xmlObject));
      document.write(HTML_write_define_line_number(prefix,1,"SPEED_PI_INTEG_SHIFT",xmlObject));
    }
    else
    {
      document.write(HTML_write_define_line_number(prefix,1,"SPEED_NSHIFT",xmlObject));
      document.write(HTML_write_define_line_number(prefix,0,"SPEED_CC1SC",xmlObject));
      document.write(HTML_write_define_line_number(prefix,0,"SPEED_CC2SC",xmlObject));              
    } 
    
    document.write(HTML_write_define_line_number(prefix,0,"SPEED_LOOP_HIGH_LIMIT",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"SPEED_LOOP_LOW_LIMIT",xmlObject));
    
    if(testVarValue('FFw_SL','Zero Cancellation'))
    {              
      document.write(HTML_write_blank_line());
      document.write(HTML_write_define_line_number(prefix,0,"SPEED_ZC_B0",xmlObject));
      document.write(HTML_write_define_line_number(prefix,0,"SPEED_ZC_B1",xmlObject));
      document.write(HTML_write_define_line_number(prefix,0,"SPEED_ZC_A1",xmlObject));
    }     
    
    if(testVarValue('FFw_SL','Incremental Ramp'))
    {  
      document.write(HTML_write_blank_line());
      document.write(HTML_write_define_line_number(prefix,0,"SPEED_RAMP_UP",xmlObject));
      document.write(HTML_write_define_line_number(prefix,0,"SPEED_RAMP_DOWN",xmlObject));
    }
    
    //document.write(HTML_write_define_line_number(prefix,0,"SCALAR_RAMP_UP",xmlObject));
    //document.write(HTML_write_define_line_number(prefix,0,"SCALAR_RAMP_DOWN",xmlObject));    
    document.write(HTML_write_blank_line());
    document.write(HTML_write_define_line_number(prefix,0,"SPEED_LOOP_CNTR",xmlObject));
    //document.write(HTML_write_define_line_number(prefix,0,"SPEED_LOOP_FREQ",xmlObject));
    
    document.write(HTML_write_blank_line());
    /* Actual Speed MA filter with Lambda parameter*/
    if(testVarValue('WFilt','MA Filter (lambda)'))
    {
       document.write(HTML_write_define_line_number(prefix,0,"SPEED_FILTER_MA_L",xmlObject));
    }   
    
    /* Actual Speed MA filter with n-point parameter */
    if(testVarValue('WFilt','MA Filter (n-point)'))
    {
       document.write(HTML_write_define_line_number(prefix,0,"SPEED_FILTER_MA_N",xmlObject));
    }  

    // Actual Speed IIR filter 
    if(testVarValue('WFilt','IIR Filter'))
    {
       document.write(HTML_write_define_line_number(prefix,0,"SPEED_IIR_B0",xmlObject));
       document.write(HTML_write_define_line_number(prefix,0,"SPEED_IIR_B1",xmlObject));
       document.write(HTML_write_define_line_number(prefix,0,"SPEED_IIR_A1",xmlObject));
    }   
    
    copyParent2HeaderCfgById('SLOOP_F0','SLOOP_F0',' [Hz]',true);
    copyParent2HeaderCfgById('SLOOP_Att','SLOOP_Att',' [-]',true);
    copyParent2HeaderCfgById('SLOOP_Ts','SLOOP_Ts',' [sec]',true);
    clickCalculateSloop();

}    

/***************************************************************************//*!
* @brief  The function reads values from input forms, scales them and write 
*         to output file form
* @param   
* @return 
* @remarks 
******************************************************************************/
function writeSLoopHeaderOutput(str)
{
  
   str = write_blank_lines(str,1);     
   str = write_comment_text(str,'Speed Loop Control','');
   str = write_comment_line_dash(str);

   if(parent.document.getElementById(prefixM + 'SLOOP_PI_MAN_EN').innerHTML==='1'){
        str = write_comment_text(str,'Manually tuned PI controller parameters','');    
   }
   else{
       str = write_comment_text(str,'Loop Bandwidth','SLOOP_F0');    
       str = write_comment_text(str,'Loop Attenuation','SLOOP_Att');
    }
  
   str = write_comment_text(str,'Loop sample time','SLOOP_Ts');
   str = write_comment_line_dash(str);
 
   //Speed controller
   if(testVarValue('Scontroller','Parallel'))
   {
      str = write_comment_text(str,'Speed Controller - Parallel type','','');   
      str = write_define_line_number(str,'SPEED_PI_PROP_GAIN'); 
      str = write_define_line_number(str,'SPEED_PI_PROP_SHIFT');
      str = write_define_line_number(str,'SPEED_PI_INTEG_GAIN');
      str = write_define_line_number(str,'SPEED_PI_INTEG_SHIFT');
    }
    else
    {
      str = write_comment_text(str,'Speed Controller - Recurrent type','','');    
      str = write_define_line_number(str,'SPEED_NSHIFT');
      str = write_define_line_number(str,'SPEED_CC1SC');
      str = write_define_line_number(str,'SPEED_CC2SC');
    }
    
    str = write_define_line_number(str,'SPEED_LOOP_HIGH_LIMIT');
    str = write_define_line_number(str,'SPEED_LOOP_LOW_LIMIT');
    
    if(testVarValue('FFw_SL','Zero Cancellation'))
    {              
      str = write_blank_lines(str,1);
      str = write_define_line_number(str,'SPEED_ZC_B0');
      str = write_define_line_number(str,'SPEED_ZC_B1');
      str = write_define_line_number(str,'SPEED_ZC_A1');
    }
    if(testVarValue('FFw_SL','Incremental Ramp'))
    {
      str = write_blank_lines(str,1);
      str = write_define_line_number(str,'SPEED_RAMP_UP');
      str = write_define_line_number(str,'SPEED_RAMP_DOWN');
     // str = write_define_line_number(str,'SCALAR_RAMP_UP');
     // str = write_define_line_number(str,'SCALAR_RAMP_DOWN');      
    } 

    str = write_blank_lines(str,1);
    str = write_define_line_number(str,'SPEED_LOOP_CNTR');
    //str = write_define_line_number(str,'SPEED_LOOP_FREQ');
    str = write_blank_lines(str,1);
    
    if(testVarValue('WFilt','MA Filter (lambda)'))
    {
      str = write_define_line_number(str,'SPEED_FILTER_MA_L');
    }  
    if(testVarValue('WFilt','MA Filter (n-point)'))
    {
      str = write_define_line_number(str,'SPEED_FILTER_MA_N');
    }  
    
    // Actual Speed MA filter 
    if(testVarValue('WFilt','IIR Filter'))
    {
      str = write_define_line_number(str,'SPEED_IIR_B0');
      str = write_define_line_number(str,'SPEED_IIR_B1');
      str = write_define_line_number(str,'SPEED_IIR_A1');
    }
    return str;
}

/***************************************************************************//*!
* @brief  The function reads values from input forms, scales them and write 
*         to output file form
* @param   
* @return 
* @remarks 
******************************************************************************/
function SL_PImanualTuning()
{
  var parameterIdArray=new Array(3);
  parameterIdArray[0] = "SLOOP_Ts";
  parameterIdArray[1] = "SLOOP_F0";
  parameterIdArray[2] = "SLOOP_Att";
  
  //get active motor to select proper prefix
  var prefixM       = getActiveMotor();
  var valType       = parent.document.getElementById("Arithmetic").innerText;  
  
  // enable manunal tuning of SL PI controller constants
  if(document.getElementById(prefixM+'SL_PImanualTuning').checked)
  {
    for(i=0;i<3;i++){
      // set read only attributte
      document.getElementById(prefixM +  parameterIdArray[i]).readOnly  = true;
      // change background color
      document.getElementById(prefixM +  parameterIdArray[i]).style.backgroundColor ='#EEEEEE';
      document.getElementById(prefixM +  parameterIdArray[i]).disabled = 'true';
      // clear red text color of ID in main inner table 
      parent.document.getElementById(prefixM +  parameterIdArray[i]).style.color="black";
    }
    
    // swap constant / parameter displaying of PI constants
    document.getElementById('Speed_PIparal').style.display = "none";
    document.getElementById('Speed_PIparal_manual').style.display = "";
    
    // Disable shift values for Float implementation
    if(valType ==='Float'){
     document.getElementById("row_SLOOP_KP_SHIFT_MAN").style.display = 'none';
     document.getElementById("row_SLOOP_KI_SHIFT_MAN").style.display = 'none';        
    }
    
    // set manual tuning enabling to parameter
    parent.document.getElementById(prefixM + 'SLOOP_PI_MAN_EN').innerHTML = 1;

    document.getElementById(prefixM + 'SLOOP_KP_Z_MAN').value = document.getElementById('SL_Kp_g').value;
    document.getElementById(prefixM + 'SLOOP_KI_Z_MAN').value = document.getElementById('SL_Ki_g').value;

    copyParent2InnerValById("SLOOP_KP_Z_MAN");
    copyParent2InnerValById("SLOOP_KI_Z_MAN");

  }
  else
  {
    for(i=0;i<3;i++){
      // set read only attributte
      document.getElementById(prefixM +  parameterIdArray[i]).readOnly  = false;
      // change background color
      document.getElementById(prefixM +  parameterIdArray[i]).style.backgroundColor ='';  
      document.getElementById(prefixM +  parameterIdArray[i]).disabled = '';
      // clear red text color of ID in main inner table 
      parent.document.getElementById(prefixM +  parameterIdArray[i]).style.color="";
    }
    // swap constant / parametr displaying of PI constants
    document.getElementById('Speed_PIparal').style.display = "";
    document.getElementById('Speed_PIparal_manual').style.display = "none";
    
    // set manual tuning enablin to parameter
    parent.document.getElementById(prefixM + 'SLOOP_PI_MAN_EN').innerHTML = 0;
  }  
  
  clickCalculateSloop();
  // in basic mode, precalculate paramters
  if(getActiveMode()===0)      basicModeCalcSLoop();
}

/***************************************************************************//*!
*
* @brief  Unified function updating constants on active tab
* @param   
* @return 
* @remarks 
******************************************************************************/
function updateTab_SLoop()
{
   // update constants
   clickCalculateSloop();
}

/***************************************************************************//*!
* 
******************************************************************************
* End of code
******************************************************************************/
