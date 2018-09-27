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
* @file   inner_PoSpeBemfDQ.js
*
* @brief  BEMF Observer engine
*
******************************************************************************/
/******************************************************************************
* List of functions
******************************************************************************
* initLoadFormBemfDQ() - init Sensorless page paramters and constants  
* clickCalculateBemfDQ() - calculates control constants based on input parameters
* clickUpdateBemfDQFM() - update selected variables in FreeMASTER application
* writeBemfDQHTMLOutput(prefix,xmlObject) - write selected constants to output preview page 
* writeBemfDQHeaderOutput(str) - write selected constants to output header file
*******************************************************************************/

/***************************************************************************//*!
*
* @brief  The function loads values from inner storage table to forms based
*         on parameter ID   
* @param   
* @return 
* @remarks 
******************************************************************************/
function initLoadFormBemfDqObsvr()
{
   // document.getElementById("M1_STARTUP_RAMP").disabled = true;
    var valType        = parent.document.getElementById("Arithmetic").innerText;
    
   // in basic mode, precalculate paramters
   if(getActiveMode()===0)
      basicModeCalcPoSpeBEMF();
   
   //Fill the input parameters
   copyParent2InnerValById("BEMF_DQ_F0");   
   copyParent2InnerValById("BEMF_DQ_Att");

   copyParent2InnerValById("TO_F0");   
   copyParent2InnerValById("TO_Att");
   
   copyParent2InnerValById("STARTUP_RAMP");   
   copyParent2InnerValById("STARTUP_CURRENT");
   copyParent2InnerValById("STARTUP_MERG_SPEED_1");   
   
    copyParent2InnerValById("STARTUP_MERG_SPEED_2");
   //Only for Carcassonne
   //var prefixM = getActiveMotor();
   //document.getElementById(prefixM+"STARTUP_MERG_COEFF").disabled = true;   
   
    if(valType ==='Float'){
     document.getElementById("row_BEMF_shift").style.display = 'none';
     document.getElementById("row_TO_Integ_NShift").style.display = 'none';        
    }    
   
   if(testVarValue('BemfController','Parallel'))
   {
       
     document.getElementById("BemfPIpar").style.display = "";
     document.getElementById("BemfPIpar").style.display = "";
     document.getElementById("BemfPIrec").style.display = "none";
     document.getElementById("BemfPIrec").style.display = "none";
     
     document.getElementById("ToPI_par").style.display = "";
     document.getElementById("ToPI_rec").style.display = "none";
     
        // Do not need to display shift values if Float arrithmetic selected
        if(valType ==='Float'){
         document.getElementById("row_BEMF_DQ_Kp_sh").style.display = 'none';
         document.getElementById("row_BEMF_DQ_Ki_sh").style.display = 'none';        
         document.getElementById("row_TO_Kp_sh").style.display = 'none';
         document.getElementById("row_TO_Ki_sh").style.display = 'none';       
        }       
    }
   else
   {
       
     document.getElementById("BemfPIpar").style.display = "none";
     document.getElementById("BemfPIpar").style.display = "none";
     document.getElementById("BemfPIrec").style.display = "";
     document.getElementById("BemfPIrec").style.display = "";
     
     document.getElementById("ToPI_par").style.display = 'none';
     document.getElementById("ToPI_rec").style.display = "";
     
        // Do not need to display shift values if Float arrithmetic selected
        if(valType ==='Float'){
         document.getElementById("row_BEMF_DQ_sh").style.display = 'none';
         document.getElementById("row_TO_Nsh").style.display = 'none';
        }        
   }
   
   // enable button enabling
   ReloadStoreButtonsOnOff(1);
   //calculate constants
   clickCalculateBemfDqObsrv();
}

/***************************************************************************//*!
*
* @brief   Mark the Labels in the Fieldsets that's going to be updated
* @param   
* @return  None
* @remarks 
******************************************************************************/
function markUpdateSLSField()
{
    var obj = document.getElementById("DQbemfObs").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';
    var obj = document.getElementById("BemfPIpar").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';
    var obj = document.getElementById("BemfPIrec").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';      
    var obj = document.getElementById("ToPI_par").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';
    var obj = document.getElementById("ToPI_rec").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';    
    var obj = document.getElementById("ToIntegparam").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';
    var obj = document.getElementById("OLstartUp").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';    
    
    
    document.getElementById("BemfObsrvUpdateFrm").title = "Red-legend constants will be updated to MCU on click"
}

/***************************************************************************//*!
* @brief   UnMark the Labels in the Fieldsets that's going to be updated
* @param   
* @return  None
* @remarks 
******************************************************************************/
function unmarkUpdateSLSField()
{
    var obj = document.getElementById("DQbemfObs").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';
    var obj = document.getElementById("BemfPIpar").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';
    var obj = document.getElementById("BemfPIrec").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';    
    var obj = document.getElementById("ToPI_par").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';
    var obj = document.getElementById("ToPI_rec").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';    
    var obj = document.getElementById("ToIntegparam").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';
    var obj = document.getElementById("OLstartUp").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';     
    
}

/***************************************************************************//*!
* @brief   Reload and Store button - hint appears on mouse over the button
* @param   
* @return  None
* @remarks 
******************************************************************************/
function reloadSslsField()
{
    document.getElementById("ReloadData").title = "Reloading input parameters from an MCAT external file";
}

function storeSslsField()
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
function basicModeCalcPoSpeBEMF()
{
    var Nnom          = getParentHtmlValue("N_nom");
    
    speedMerging = Math.ceil(Nnom*0.1);
    
    // replace and disable params
    switchParam2BasicMode("BEMF_DQ_F0",150);
    switchParam2BasicMode("BEMF_DQ_Att",1);
    
    switchParam2BasicMode("TO_F0",10);
    switchParam2BasicMode("TO_Att",1);
    
    switchParam2BasicMode("STARTUP_MERG_SPEED_1",speedMerging);
    switchParam2BasicMode("STARTUP_MERG_SPEED_2",speedMerging);

}

/***************************************************************************//*!
*
* @brief  The function calculates ouput constans based on input parameters   
* @param   
* @return  None
* @remarks 
******************************************************************************/

/* --------------- Spee parameters routine ---------------- */
function clickCalculateBemfDqObsrv()
{
    var retMsg;
    
    var prefixM       = getActiveMotor();
    var BEMF_DQ_f0    = getParentHtmlValue("BEMF_DQ_F0");
    var BEMF_DQ_att   = getParentHtmlValue("BEMF_DQ_Att");
    var TO_f0         = getParentHtmlValue("TO_F0");
    var TO_att        = getParentHtmlValue("TO_Att");
    var Ts            = getParentHtmlValue("CLOOP_Ts");
    var SLOOP_Ts      = getParentHtmlValue("SLOOP_Ts");
    var Rs            = getParentHtmlValue("Rs");
    var Ld            = getParentHtmlValue("Ld");
    var Lq            = getParentHtmlValue("Lq");
    var ke            = getParentHtmlValue("ke");      
    var UDCmax        = getParentHtmlValue("UDC_max");
    
    // all voltages in the application are scale by DC bus max voltage
    //var Umax          = getParentHtmlValue("U_max");
    Umax = UDCmax;
    
    var Imax          = getParentHtmlValue("I_max");
    var Nmax          = getParentHtmlValue("N_max");
    
    var Emax          = getParentHtmlValue("E_max");
    var pp            = getParentHtmlValue("pp");
    var RampStartUp   = getParentHtmlValue("STARTUP_RAMP");
    var IstartUp      = getParentHtmlValue("STARTUP_CURRENT");
    var Nmerging1     = getParentHtmlValue("STARTUP_MERG_SPEED_1");
    var Nmerging2     = getParentHtmlValue("STARTUP_MERG_SPEED_2");
    var IIRxCoefsScaleType     = parent.document.getElementById("IIRxCoefsScale").innerText;
      
    //var Emax          = ke*Wmax; 
    var ThetaMax      = Math.PI;  
    var ERRmax        = 1;
    var Wmax        = 2*Math.PI*pp*Nmax/60;
    
    var valType     = parent.document.getElementById("Arithmetic").innerText;

    /* BEMF-DQ observer constants // BWE implementation                          */
    /*I_gain = Math.ceil((Ld/(Ld+Ts*Rs))*1000000000000)/1000000000000;
    U_gain = Math.ceil(Ts/(Ld+Ts*Rs)*1000000000000)/1000000000000;
    E_gain = Math.ceil(Ts/(Ld+Ts*Rs)*1000000000000)/1000000000000;
    WI_gain = Math.ceil(Lq*Ts/(Ld+Ts*Rs)*1000000000000)/1000000000000;*/
    
    /* DQ-Bemf observer constants (AMMCLib 1.1.7 and higher) // BIL implementation */
    I_gain_z = (2*Ld-Ts*Rs)/(2*Ld+Ts*Rs);
    U_gain_z = Ts/(2*Ld+Ts*Rs);
    E_gain_z = Ts/(2*Ld+Ts*Rs);
    WI_gain_z = Lq*Ts/(2*Ld+Ts*Rs);
        
    /* BEMF-DQ observer calculation scales */
    I_scaled = I_gain_z;
    U_scaled = U_gain_z*(Umax/Imax);
    E_scaled = E_gain_z*(Emax/Imax);
    WI_scaled = WI_gain_z*Wmax;

    //Max_scaled = Math.max(Math.max(Math.max(I_scaled,U_scaled),E_scaled),WI_scaled);
    Max_scaled = Math.max(Math.max(WI_scaled,U_scaled),E_scaled);

    if(Max_scaled>1)        Ksc_plant_shift = getScaleShift(Max_scaled);
    else                    Ksc_plant_shift = 0;
    
    I_gain = I_scaled;
    U_gain = U_scaled*Math.pow(2,-Ksc_plant_shift);
    E_gain = E_scaled*Math.pow(2,-Ksc_plant_shift);
    WI_gain = WI_scaled*Math.pow(2,-Ksc_plant_shift);
    
    testFracValRange("I_scaled",I_gain);
    testFracValRange("U_scaled",U_gain);
    testFracValRange("E_scaled",E_gain);
    testFracValRange("WI_scaled",WI_gain);    
    
    // BEMF DQ observer PI controller connstants 
    Bemf_DQ_Kps = 2*BEMF_DQ_att*2*Math.PI*BEMF_DQ_f0*Ld-Rs;
    Bemf_DQ_Kis = Ld*Math.pow(2*Math.PI*BEMF_DQ_f0,2);
    
    // Billinear discretization method, from "s" to "z" domain
    Bemf_DQ_Kpz = Bemf_DQ_Kps;
    Bemf_DQ_Kiz = Bemf_DQ_Kis*Ts/2;
    
    // Normalization of PI constants
    Bemf_DQ_Kpz_f = Bemf_DQ_Kpz*(Imax/Emax);
    Bemf_DQ_Kiz_f = Bemf_DQ_Kiz*(Imax/Emax);
    
    // Scaling the Bemf observer PI constants into the <-1,1) range  
    Bemf_DQ_Kp_gain = getScale(Bemf_DQ_Kpz_f);
    Bemf_DQ_Ki_gain = getScale(Bemf_DQ_Kiz_f);

    Bemf_DQ_Kp_shift = getScaleShift(Bemf_DQ_Kpz_f);
    Bemf_DQ_Ki_shift = getScaleShift(Bemf_DQ_Kiz_f);
    
   /* BEMF DQ observer constants for recurrent PI controller */
    Bemf_DQ_CC1z    = Bemf_DQ_Kpz + Bemf_DQ_Kiz;
    Bemf_DQ_CC2z    = -Bemf_DQ_Kpz + Bemf_DQ_Kiz;
    
    Bemf_DQ_CC1_f  = Bemf_DQ_CC1z*(Imax/Emax);
    Bemf_DQ_CC2_f  = Bemf_DQ_CC2z*(Imax/Emax);

    /* BEMF DQ scales for recurrent PI controller*/
    if(Math.abs(Bemf_DQ_CC1_f)>1 || Math.abs(Bemf_DQ_CC2_f)>1)
    {
     Bemf_DQ_CCx_shift = getScaleShift(Math.max(Math.abs(Bemf_DQ_CC1_f),Math.abs(Bemf_DQ_CC2_f)));
    }
    else     Bemf_DQ_CCx_shift = 0;

    Bemf_DQ_CC1_gain = Bemf_DQ_CC1_f*Math.pow(2,-Bemf_DQ_CCx_shift);
    Bemf_DQ_CC2_gain = Bemf_DQ_CC2_f*Math.pow(2,-Bemf_DQ_CCx_shift);
    
   /* Tracking Observer observer constants */
    TO_Kps = 2*TO_att*2*Math.PI*TO_f0;
    TO_Kis = Math.pow(2*Math.PI*TO_f0,2);
    
    TO_Kpz = TO_Kps;
    TO_Kiz = TO_Kis*Ts/2;
    
    TO_Kpz_f = TO_Kpz*(ERRmax/Wmax);
    TO_Kiz_f = TO_Kiz*(ERRmax/Wmax);
    
   
    /* TO scales */
    // proportional
    if(TO_Kpz_f<1) TO_Kp_shift = -Math.ceil(Math.log(Math.abs(1/TO_Kpz_f))/Math.log(2)-1);
    else          TO_Kp_shift = Math.ceil(Math.log(Math.abs(TO_Kpz_f))/Math.log(2));
    
    TO_Kp_gain = Math.round(TO_Kpz_f*Math.pow(2,-TO_Kp_shift)*1000000000000)/1000000000000;
    testFracValRange("TO_Kp_gain",TO_Kp_gain); 
   
    // integral
    if(TO_Kiz_f<1) TO_Ki_shift = -Math.ceil(Math.log(Math.abs(1/TO_Kiz_f))/Math.log(2)-1);
    else          TO_Ki_shift = Math.ceil(Math.log(Math.abs(TO_Kiz_f))/Math.log(2));
    
    TO_Ki_gain = Math.round(TO_Kiz_f*Math.pow(2,-TO_Ki_shift)*1000000000000)/1000000000000;
    testFracValRange("TO_Ki_gain",TO_Ki_gain); 
    
      /* BEMF DQ observer constants for recurrent PI controller */

    TO_CC1z    = TO_Kpz + TO_Kiz;
    TO_CC2z    = -TO_Kpz + TO_Kiz;

    TO_CC1_f  = TO_CC1z*(Math.PI/Wmax);
    TO_CC2_f  = TO_CC2z*(Math.PI/Wmax);

    /* BEMF DQ scales for recurrent PI controller*/
    if(Math.abs(TO_CC1_f)>1 || Math.abs(TO_CC2_f)>1)
    {
     TO_CCx_shift = Math.ceil(Math.log(Math.max(Math.abs(TO_CC1_f),Math.abs(TO_CC2_f)))/Math.log(2));
     TO_CC1_gain = Math.round(TO_CC1_f*Math.pow(2,-TO_CCx_shift)*1000000000000)/1000000000000;
     TO_CC2_gain = Math.round(TO_CC2_f*Math.pow(2,-TO_CCx_shift)*1000000000000)/1000000000000;
    }
    else
    {
     TO_CCx_shift = 0;
     TO_CC1_gain = TO_CC1_f;
     TO_CC2_gain = TO_CC2_f;

     TO_CC1_gain = Math.round(TO_CC1_gain*Math.pow(2,-TO_CCx_shift)*1000000000000)/1000000000000;
     TO_CC2_gain = Math.round(TO_CC2_gain*Math.pow(2,-TO_CCx_shift)*1000000000000)/1000000000000;
    }
    
    // theta
    TO_Theta_z = Ts/2;
    TO_Theta_fix = TO_Theta_z*Wmax/ThetaMax;
    
    if(TO_Theta_fix<1)    TO_Theta_shift = -Math.ceil(Math.log(Math.abs(1/TO_Theta_fix))/Math.log(2)-1);
    else                TO_Theta_shift = Math.ceil(Math.log(Math.abs(TO_Theta_fix))/Math.log(2));
    
    // Shift value must be zero, MCLib integrator has difficulties to make shifting
    TO_Theta_shift = 0;
    
    TO_Theta_gain = Math.round(TO_Theta_fix*Math.pow(2,-TO_Theta_shift)*1000000000000)/1000000000000;
    testFracValRange("TO_Theta_gain",TO_Theta_gain); 
    
    //Start-up incremental ramp coeffs - calculated in Speed loop
    rampStartUpInc_Flt      = Math.round(RampStartUp*2*Math.PI*pp/60*SLOOP_Ts*100000)/100000;
    rampStartUpInc_Fix      = Math.round(rampStartUpInc_Flt/Wmax*10000000)/10000000;
        
    currentStartUp    =  IstartUp;
    currentStartUp_f  =  Math.round(IstartUp/Imax*1000000000000)/1000000000000;
    speedMerging1_f   =  Math.round(Nmerging1/Nmax*1000000000000)/1000000000000;
    speedMerging1     = Nmerging1;
    speedMerging2_f   =  Math.round(Nmerging2/Nmax*1000000000000)/1000000000000;
    speedMerging2     = Nmerging2;    
    
  // merginCoeff_f     = Math.round((mergingCoeff/100)*(60/(pp*Nmerging))/Ts/2/32768*1000000000000)/1000000000000;
    testFracValRange("currentStartUp_f",currentStartUp_f); 
    testFracValRange("speedMerging1_f",speedMerging1_f);
    testFracValRange("speedMerging2_f",speedMerging2_f);
    //testValRange("Merging Coeff",merginCoeff_f,1/32767,1); 
    
    // Observer speed output IIR filter
    // Cut off frequency is 80% of half of SPEED LOOP frequency
    TO_W_IIR_cutoff_freq = 1/(2*SLOOP_Ts)*0.8; 
    TO_W_IIR_B0_fl = Math.round((2*Math.PI*TO_W_IIR_cutoff_freq*Ts)/(2+(2*Math.PI*TO_W_IIR_cutoff_freq*Ts))*1000000000000)/1000000000000; 
    TO_W_IIR_B1_fl = Math.round((2*Math.PI*TO_W_IIR_cutoff_freq*Ts)/(2+(2*Math.PI*TO_W_IIR_cutoff_freq*Ts))*1000000000000)/1000000000000;
    TO_W_IIR_A1_fl = Math.round((2*Math.PI*TO_W_IIR_cutoff_freq*Ts-2)/(2+(2*Math.PI*TO_W_IIR_cutoff_freq*Ts))*1000000000000)/1000000000000;
    TO_W_IIR_B0_out =  Math.round(TO_W_IIR_B0_fl/IIRxCoefsScaleType*1000000000000)/1000000000000;
    TO_W_IIR_B1_out =  Math.round(TO_W_IIR_B1_fl/IIRxCoefsScaleType*1000000000000)/1000000000000;
    TO_W_IIR_A1_out =  Math.round(TO_W_IIR_A1_fl/IIRxCoefsScaleType*1000000000000)/1000000000000;
    
    testFracValRange("TO_W_IIR_B0_out",TO_W_IIR_B0_out,1);
    testFracValRange("TO_W_IIR_B1_out",TO_W_IIR_B1_out,1);
    testFracValRange("TO_W_IIR_A1_out",TO_W_IIR_A1_out,1);

    // If Sensorless tab is active ******************************************
    if(document.getElementById("BemfDqObsrv") !== null)
    {
        // write values to forms
        setInnerHtmlValue("I_scale",I_gain,I_gain_z);
        setInnerHtmlValue("U_scale",U_gain,U_gain_z);
        setInnerHtmlValue("E_scale",E_gain,E_gain_z);  
        setInnerHtmlValue("WI_scale",WI_gain,WI_gain_z);
        setInnerHtmlValue("BEMF_shift",Ksc_plant_shift,'N/A');
       
        // fill the Parallel PI controller constants
        setInnerHtmlValue("BEMF_DQ_Kp_g",Bemf_DQ_Kp_gain,Bemf_DQ_Kpz);
        setInnerHtmlValue("BEMF_DQ_Ki_g",Bemf_DQ_Ki_gain,Bemf_DQ_Kiz);
        setInnerHtmlValue("BEMF_DQ_Kp_sh",Bemf_DQ_Kp_shift,'N/A');
        setInnerHtmlValue("BEMF_DQ_Ki_sh",Bemf_DQ_Ki_shift,'N/A');
                
        // fill the Recurrent PI controller constants
        setInnerHtmlValue("BEMF_DQ_CC1",Bemf_DQ_CC1_gain,Bemf_DQ_CC1z);
        setInnerHtmlValue("BEMF_DQ_CC2",Bemf_DQ_CC2_gain,Bemf_DQ_CC2z);        
        setInnerHtmlValue("BEMF_DQ_sh",Bemf_DQ_CCx_shift,'N/A');        
       
        setInnerHtmlValue("TO_Kp_g",TO_Kp_gain,TO_Kpz);
        setInnerHtmlValue("TO_Ki_g",TO_Ki_gain,TO_Kiz);
        
        setInnerHtmlValue("TO_CC1_g",TO_CC1_gain,TO_CC1z);
        setInnerHtmlValue("TO_CC2_g",TO_CC2_gain,TO_CC2z);
        setInnerHtmlValue("TO_Nsh",TO_CCx_shift,'N/A');
        
        setInnerHtmlValue("TO_Integ_C1",TO_Theta_gain, TO_Theta_z);
        setInnerHtmlValue("TO_Integ_NShift",TO_Theta_shift, 'N/A');
        
   }
    
    // If HEADER FILE tab is active ********************************************
    if(document.getElementById("HeaderFileTab") !== null)
    {	
      // write values to forms in current Html page
      setInnerHtmlValueAsText("I_SCALE",0,I_gain,I_gain_z);
      setInnerHtmlValueAsText("U_SCALE",0,U_gain,U_gain_z);
      setInnerHtmlValueAsText("E_SCALE",0,E_gain,E_gain_z);
      setInnerHtmlValueAsText("WI_SCALE",0,WI_gain,WI_gain_z);
      setInnerHtmlValueAsText("K_SHIFT",1,Ksc_plant_shift);
      
      if(testVarValue('BemfController','Parallel'))
      {
      setInnerHtmlValueAsText("BEMF_DQ_KP_GAIN",0,Bemf_DQ_Kp_gain,Bemf_DQ_Kpz);
      setInnerHtmlValueAsText("BEMF_DQ_KP_SHIFT",1,Bemf_DQ_Kp_shift,'N/A');
      setInnerHtmlValueAsText("BEMF_DQ_KI_GAIN",0,Bemf_DQ_Ki_gain,Bemf_DQ_Kiz);
      setInnerHtmlValueAsText("BEMF_DQ_KI_SHIFT",1,Bemf_DQ_Ki_shift,'N/A');
      setInnerHtmlValueAsText("TO_KP_GAIN",0,TO_Kp_gain,TO_Kpz);
      setInnerHtmlValueAsText("TO_KP_SHIFT",1,TO_Kp_shift);
      setInnerHtmlValueAsText("TO_KI_GAIN",0,TO_Ki_gain,TO_Kiz);
      setInnerHtmlValueAsText("TO_KI_SHIFT",1,TO_Ki_shift);
      }
      else
      {
      setInnerHtmlValueAsText("BEMF_DQ_CC1_GAIN",0,Bemf_DQ_CC1_gain,Bemf_DQ_CC1z);
      setInnerHtmlValueAsText("BEMF_DQ_CC2_GAIN",0,Bemf_DQ_CC2_gain,Bemf_DQ_CC2z);
      setInnerHtmlValueAsText("BEMF_DQ_NSHIFT",1,Bemf_DQ_CCx_shift);
      setInnerHtmlValueAsText("TO_CC1_GAIN",0,TO_CC1_gain,TO_CC1z);
      setInnerHtmlValueAsText("TO_CC2_GAIN",0,TO_CC2_gain,TO_CC2z);
      setInnerHtmlValueAsText("TO_NSHIFT",1,TO_CCx_shift);
      }
      
      setInnerHtmlValueAsText("TO_THETA_GAIN",0,TO_Theta_gain,TO_Theta_z);
      setInnerHtmlValueAsText("TO_THETA_SHIFT",1,TO_Theta_shift);
      /*setInnerHtmlValueAsText("TO_SPEED_IIR_B0",0,TO_W_IIR_B0_out,TO_W_IIR_B0_out);
      setInnerHtmlValueAsText("TO_SPEED_IIR_B1",0,TO_W_IIR_B1_out,TO_W_IIR_B1_out);
      setInnerHtmlValueAsText("TO_SPEED_IIR_A1",0,TO_W_IIR_A1_out,TO_W_IIR_A1_out); */
      
      if(valType=='Frac16')
       setInnerHtmlValueAsText("OL_START_RAMP_INC",7,rampStartUpInc_Fix,rampStartUpInc_Flt);
      else
       setInnerHtmlValueAsText("OL_START_RAMP_INC",0,rampStartUpInc_Fix,rampStartUpInc_Flt);
   
      setInnerHtmlValueAsText("OL_START_I",0,currentStartUp_f, IstartUp);
      setInnerHtmlValueAsText("MERG_SPEED_TRH_1",0,speedMerging1_f,Nmerging1);
      setInnerHtmlValueAsText("MERG_SPEED_TRH_2",0,speedMerging2_f, Nmerging2);
    }   
 }
 
/***************************************************************************//*!
*
* @brief   update variables in FreeMASTER application, 
*           IDs selected accroding to FM_params_list.xml
* @param   
* @return  None
* @remarks 
******************************************************************************/
function clickUpdatePoSpeBemfDQFM()
{
   if(!pcm.IsCommPortOpen())
  {
      alert("Communication is stopped.\nPress Ctrl+K to start the communication");
  }
  else
  {
    xmlDoc=loadXMLDoc("xml_files\\FM_params_list.xml"); 
     var errorArray = [];
     
    // // calculate actual constant values
    clickCalculateBemfDqObsrv(); 
    var valType     = parent.document.getElementById("Arithmetic").innerText;
    
    // Update the FreeMASTER values respecting the PI controller implementation 
    errorArray.push(UpdateFMVariable(xmlDoc,'E_scale',E_gain,E_gain_z));
    errorArray.push(UpdateFMVariable(xmlDoc,'I_scale',I_gain,I_gain_z));
    errorArray.push(UpdateFMVariable(xmlDoc,'U_scale',U_gain,U_gain_z));
    errorArray.push(UpdateFMVariable(xmlDoc,'WI_scale',WI_gain,WI_gain_z));
    if(valType!=='Float')
    errorArray.push(UpdateFMVariable(xmlDoc,'Nsh',Ksc_plant_shift));
    
    if(testVarValue('BemfController','Parallel'))
    {
        errorArray.push(UpdateFMVariable(xmlDoc,'BEMF_D_Kp_g',Bemf_DQ_Kp_gain,Bemf_DQ_Kpz));
        errorArray.push(UpdateFMVariable(xmlDoc,'BEMF_D_Ki_g',Bemf_DQ_Ki_gain,Bemf_DQ_Kiz));
        
        if(valType!=='Float'){
        errorArray.push(UpdateFMVariable(xmlDoc,'BEMF_D_Kp_sc',Bemf_DQ_Kp_shift));
        errorArray.push(UpdateFMVariable(xmlDoc,'BEMF_D_Ki_sc',Bemf_DQ_Ki_shift));}
        
        errorArray.push(UpdateFMVariable(xmlDoc,'BEMF_Q_Kp_g',Bemf_DQ_Kp_gain,Bemf_DQ_Kpz));
        errorArray.push(UpdateFMVariable(xmlDoc,'BEMF_Q_Ki_g',Bemf_DQ_Ki_gain,Bemf_DQ_Kiz));
        
        if(valType!=='Float'){
        errorArray.push(UpdateFMVariable(xmlDoc,'BEMF_Q_Kp_sc',Bemf_DQ_Kp_shift));
        errorArray.push(UpdateFMVariable(xmlDoc,'BEMF_Q_Ki_sc',Bemf_DQ_Ki_shift));}
        
        errorArray.push(UpdateFMVariable(xmlDoc,'TO_Kp_g',TO_Kp_gain,TO_Kpz));
        errorArray.push(UpdateFMVariable(xmlDoc,'TO_Ki_g',TO_Ki_gain,TO_Kiz));
        
        if(valType!=='Float'){
        errorArray.push(UpdateFMVariable(xmlDoc,'TO_Kp_sc',TO_Kp_shift));
        errorArray.push(UpdateFMVariable(xmlDoc,'TO_Ki_sc',TO_Ki_shift));}
    }
    else{
        errorArray.push(UpdateFMVariable(xmlDoc,'BEMF_D_CC1_g',Bemf_DQ_CC1_gain,Bemf_DQ_CC1z));
        errorArray.push(UpdateFMVariable(xmlDoc,'BEMF_D_CC2_g',Bemf_DQ_CC2_gain,Bemf_DQ_CC2z));
        
        if(valType!=='Float')
        errorArray.push(UpdateFMVariable(xmlDoc,'BEMF_D_Nsh',Bemf_DQ_CCx_shift));
        
        errorArray.push(UpdateFMVariable(xmlDoc,'BEMF_Q_CC1_g',Bemf_DQ_CC1_gain,Bemf_DQ_CC1z));
        errorArray.push(UpdateFMVariable(xmlDoc,'BEMF_Q_CC2_g',Bemf_DQ_CC2_gain,Bemf_DQ_CC2z));
        
        if(valType!=='Float')
        errorArray.push(UpdateFMVariable(xmlDoc,'BEMF_Q_Nsh',Bemf_DQ_CCx_shift));

        errorArray.push(UpdateFMVariable(xmlDoc,'TO_CC1',TO_CC1_gain,TO_CC1z));
        errorArray.push(UpdateFMVariable(xmlDoc,'TO_CC2',TO_CC2_gain,TO_CC2z));
        
        if(valType!=='Float')
        errorArray.push(UpdateFMVariable(xmlDoc,'TO_Nsh',TO_CCx_shift));    
    }
    errorArray.push(UpdateFMVariable(xmlDoc,'Theta_g',TO_Theta_gain,TO_Theta_z));
    
  
    if(valType!=='Float')
    errorArray.push(UpdateFMVariable(xmlDoc,'Theta_sc',TO_Theta_shift));
    errorArray.push(UpdateFMVariable(xmlDoc,'Startup_Ramp_inc',rampStartUpInc_Fix, rampStartUpInc_Flt));
   // errorArray.push(UpdateFMVariable(xmlDoc,'Startup_Ramp_dec',rampStartUpInc));
    errorArray.push(UpdateFMVariable(xmlDoc,'Startup_I_pos_FM',currentStartUp));
    errorArray.push(UpdateFMVariable(xmlDoc,'Startup_I_neg_FM',-currentStartUp));
    errorArray.push(UpdateFMVariable(xmlDoc,'Startup_N_merging_1',speedMerging1));
    errorArray.push(UpdateFMVariable(xmlDoc,'Startup_N_merging_2',speedMerging2));
   // errorArray.push(UpdateFMVariable(xmlDoc,'Startup_coeff_merging',merginCoeff_f));        

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
function writePoSpeBemfDQHTMLOutput(prefix,xmlObject)
{ 
  // Speed Loop Control
    document.write(HTML_write_blank_line());     
    document.write(HTML_write_comment_line("Sensorless BEMF DQ Observer","",""));
    document.write(HTML_write_comment_line_dash()); 
    document.write(HTML_write_comment_line("Loop bandwidth","BEMF_DQ_F0",""));
    document.write(HTML_write_comment_line("Loop attenuation","BEMF_DQ_Att",""));
    document.write(HTML_write_comment_line("Loop sample time","BEMF_DQ_Ts",""));
    
    document.write(HTML_write_define_line_number(prefix,0,"I_SCALE",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"U_SCALE",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"E_SCALE",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"WI_SCALE",xmlObject));
    document.write(HTML_write_define_line_number(prefix,1,"K_SHIFT",xmlObject));
    
    if(testVarValue('BemfController','Parallel'))
    {
    document.write(HTML_write_define_line_number(prefix,0,"BEMF_DQ_KP_GAIN",xmlObject));
    document.write(HTML_write_define_line_number(prefix,1,"BEMF_DQ_KP_SHIFT",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"BEMF_DQ_KI_GAIN",xmlObject));
    document.write(HTML_write_define_line_number(prefix,1,"BEMF_DQ_KI_SHIFT",xmlObject));
    document.write(HTML_write_blank_line());     
    document.write(HTML_write_comment_line("Sensorless TO Observer","",""));    
    document.write(HTML_write_define_line_number(prefix,0,"TO_KP_GAIN",xmlObject));
    document.write(HTML_write_define_line_number(prefix,1,"TO_KP_SHIFT",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"TO_KI_GAIN",xmlObject));
    document.write(HTML_write_define_line_number(prefix,1,"TO_KI_SHIFT",xmlObject));
    }
    else
    {
    document.write(HTML_write_define_line_number(prefix,0,"BEMF_DQ_CC1_GAIN",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"BEMF_DQ_CC2_GAIN",xmlObject));
    document.write(HTML_write_define_line_number(prefix,1,"BEMF_DQ_NSHIFT",xmlObject));
    document.write(HTML_write_blank_line());     
    document.write(HTML_write_comment_line("Sensorless TO Observer","",""));
    document.write(HTML_write_define_line_number(prefix,0,"TO_CC1_GAIN",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"TO_CC2_GAIN",xmlObject));
    document.write(HTML_write_define_line_number(prefix,1,"TO_NSHIFT",xmlObject));
    }    
    
    document.write(HTML_write_define_line_number(prefix,0,"TO_THETA_GAIN",xmlObject));
    document.write(HTML_write_define_line_number(prefix,1,"TO_THETA_SHIFT",xmlObject));
    
    /*document.write(HTML_write_blank_line());         
    document.write(HTML_write_define_line_number(prefix,0,"TO_SPEED_IIR_B0",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"TO_SPEED_IIR_B1",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"TO_SPEED_IIR_A1",xmlObject));*/
    
    document.write(HTML_write_blank_line());     
    document.write(HTML_write_comment_line("Open Loop start-up ","",""));
    document.write(HTML_write_define_line_number(prefix,0,"OL_START_RAMP_INC",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"OL_START_I",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"MERG_SPEED_TRH_1",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"MERG_SPEED_TRH_2",xmlObject));
    
    
    copyParent2HeaderCfgById('BEMF_DQ_F0','BEMF_DQ_F0',' [Hz]',true);
    copyParent2HeaderCfgById('BEMF_DQ_Att','BEMF_DQ_Att',' [-]',true);
    copyParent2HeaderCfgById('BEMF_DQ_Ts','CLOOP_Ts',' [sec]',true);
    clickCalculateBemfDqObsrv();
}

/***************************************************************************//*!
* @brief  The function reads values from input forms, scales them and write 
*         to output file form
* @param   
* @return 
* @remarks 
******************************************************************************/
function writePoSpeBemfDHeaderOutput(str)
{
   str = write_blank_lines(str,1);     
   str = write_comment_text(str,'Sensorless DQ BEMF Observer and Tracking Observer','');
   str = write_comment_line_dash(str);
   str = write_comment_text(str,'Loop Bandwidth','BEMF_DQ_F0');    
   str = write_comment_text(str,'Loop Attenuation','BEMF_DQ_Att');
   str = write_comment_text(str,'Loop sample time','CLOOP_Ts');
   str = write_comment_line_dash(str);
 
   //Bemf DQ Observer
   str = write_comment_text(str,'DQ Bemf - plant coefficients','','');
   str = write_define_line_number(str,'I_SCALE');
   str = write_define_line_number(str,'U_SCALE');
   str = write_define_line_number(str,'E_SCALE');
   str = write_define_line_number(str,'WI_SCALE');
   str = write_define_line_number(str,'K_SHIFT');   
   
   str = write_blank_lines(str,1);   
   str = write_comment_text(str,'DQ Bemf - PI controller parameters','','');
   str = write_define_line_number(str,'BEMF_DQ_KP_GAIN');
   str = write_define_line_number(str,'BEMF_DQ_KP_SHIFT');
   str = write_define_line_number(str,'BEMF_DQ_KI_GAIN');
   str = write_define_line_number(str,'BEMF_DQ_KI_SHIFT');
   
   str = write_define_line_number(str,'BEMF_DQ_CC1_GAIN');
   str = write_define_line_number(str,'BEMF_DQ_CC2_GAIN');
   str = write_define_line_number(str,'BEMF_DQ_NSHIFT');   
   str = write_blank_lines(str,1);
   
   //Tracking Observer
   str = write_comment_text(str,'Tracking Observer - PI controller parameters','','');
   str = write_define_line_number(str,'TO_KP_GAIN');
   str = write_define_line_number(str,'TO_KP_SHIFT');
   str = write_define_line_number(str,'TO_KI_GAIN');
   str = write_define_line_number(str,'TO_KI_SHIFT');
   str = write_define_line_number(str,'TO_CC1_GAIN');
   str = write_define_line_number(str,'TO_CC2_GAIN');
   str = write_define_line_number(str,'TO_NSHIFT');  
   str = write_comment_text(str,'Tracking Observer - Integrator','','');   
   str = write_define_line_number(str,'TO_THETA_GAIN');
   str = write_define_line_number(str,'TO_THETA_SHIFT');
   
   //Open loop start up
   str = write_blank_lines(str,1);   
   str = write_comment_text(str,'Observer speed output filter','','');
   /*str = write_define_line_number(str,'TO_SPEED_IIR_B0');
   str = write_define_line_number(str,'TO_SPEED_IIR_B1');
   str = write_define_line_number(str,'TO_SPEED_IIR_A1');*/
   
   //Open loop start up
   str = write_blank_lines(str,1);   
   str = write_comment_text(str,'Open loop start-up','','');
   str = write_define_line_number(str,'OL_START_RAMP_INC');
   str = write_define_line_number(str,'OL_START_I');
   str = write_define_line_number(str,'MERG_SPEED_TRH_1');
   str = write_define_line_number(str,'MERG_SPEED_TRH_2');
   
   /**/ 
    return str;
}

/***************************************************************************//*!
*
* @brief  Unified function updating constants on active tab
* @param   
* @return 
* @remarks 
******************************************************************************/
function updateTab_BemfDqObsrv()
{
   // update constants
   clickCalculateBemfDqObsrv();
}

/***************************************************************************//*!
* 
******************************************************************************
* End of code
******************************************************************************/
