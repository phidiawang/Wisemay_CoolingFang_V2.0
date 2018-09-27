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
* @file   inner_CLoop.js
*
* @brief  Current control loop engine
*
******************************************************************************/
/******************************************************************************
* List of functions
******************************************************************************
* initLoadFormCloop() - init Current Loop control page paramters and constants  
* clickCalculateCloop() - calculates control constants based on input parameters
* clickUpdateCloopFM() - update selected variables in FreeMASTER application
* writeCLoopHTMLOutput(prefix,xmlObject) - write selected constants to output preview page 
* writeCLoopHeaderOutput(str,prefix) - write selected constants to output header file
* updateTab_CLoop() - callback function 
*******************************************************************************/


/***************************************************************************//*!
*
* @brief   The function loads values from inner storage table to forms based
*         on parameter ID
* @param   
* @return 
* @remarks 
******************************************************************************/
function initLoadFormCloop()
{
   var valType        = parent.document.getElementById("Arithmetic").innerText;
  
    // in basic mode, precalculate paramters
    if(getActiveMode()===0)
    {
      basicModeCalcCLoop();
    }

     if(testVarValue('FFw_CL','Zero Cancellation'))
   {
     // Id of fieldset for both D and Q axis zero cancelation
     document.getElementById("Daxis_ZC").style.display = "";
     document.getElementById("Qaxis_ZC").style.display = "";
   } 
   else
   {
     document.getElementById("Daxis_ZC").style.display = "none";
     document.getElementById("Qaxis_ZC").style.display = "none";   
   } 
   
   if(testVarValue('Ccontroller','Parallel'))
   {
    document.getElementById("Daxis_PIparal").style.display = "";
    document.getElementById("Daxis_PIrecur").style.display = "none";   
    document.getElementById("Qaxis_PIparal").style.display = "";
    document.getElementById("Qaxis_PIrecur").style.display = "none";
     
       if(valType ==='Float'){
        document.getElementById("row_D_Kp_sh").style.display = 'none';
        document.getElementById("row_D_Ki_sh").style.display = 'none';        
        document.getElementById("row_Q_Kp_sh").style.display = 'none';
        document.getElementById("row_Q_Ki_sh").style.display = 'none';
       }
   }
   else
   {
     document.getElementById("Daxis_PIparal").style.display = "none";
     document.getElementById("Daxis_PIrecur").style.display = "";
     document.getElementById("Qaxis_PIparal").style.display = "none";
     document.getElementById("Qaxis_PIrecur").style.display = "";
     
     if(valType ==='Float'){
         document.getElementById("row_D_Nsh").style.display = 'none';
         document.getElementById("row_Q_Nsh").style.display = 'none';           
     }
   }   
   
   copyParent2InnerValById("CLOOP_Ts");      
   copyParent2InnerValById("CLOOP_F0");   
   copyParent2InnerValById("CLOOP_Att");
   copyParent2InnerValById("CLOOP_LIM");
   copyParent2InnerValById("UDC_FCUT");

   //document.getElementById("Arithmetic").innerText = parent.document.getElementById("Arithmetic").innerText;
  // enable button enabling
   ReloadStoreButtonsOnOff(1);
     
   //calculate constants
   clickCalculateCloop();
  
}

/***************************************************************************//*!
* @brief   Mark the Labels in the Fieldsets that's going to be updated
* @param   
* @return  None
* @remarks 
******************************************************************************/
function markUpdateCLField()
{
    var obj = document.getElementById("Daxis_PIparal").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';
    var obj = document.getElementById("Qaxis_PIparal").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';  
    var obj = document.getElementById("Daxis_PIrecur").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';
    var obj = document.getElementById("Qaxis_PIrecur").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';      
    var obj = document.getElementById("Daxis_ZC").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';
    var obj = document.getElementById("Qaxis_ZC").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';    
    
    document.getElementById("CurrUpdateFrm").title = "Red-headline constants will be updated to MCU on click";
}
/***************************************************************************//*!
* @brief   UnMark the Labels in the Fieldsets that's going to be updated
* @param   
* @return  None
* @remarks 
******************************************************************************/
function unmarkUpdateCLField()
{
    var obj = document.getElementById("Daxis_PIparal").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';
    var obj = document.getElementById("Qaxis_PIparal").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';  
    var obj = document.getElementById("Daxis_PIrecur").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';
    var obj = document.getElementById("Qaxis_PIrecur").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';    
    var obj = document.getElementById("Daxis_ZC").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';
    var obj = document.getElementById("Qaxis_ZC").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';       
}

/***************************************************************************//*!
* @brief   Reload and Store button - hint appears on mouse over the button
* @param   
* @return  None
* @remarks 
******************************************************************************/
function reloadCLField()
{
    document.getElementById("ReloadData").title = "Reloading input parameters from an MCAT external file";
}

function storeCLField()
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

function basicModeCalcCLoop()
{
    var Rs            = getParentHtmlValue("Rs");
    var Lq            = getParentHtmlValue("Lq");
    var Ld            = getParentHtmlValue("Ld");
    var Ts            = getParentHtmlValue("CLOOP_Ts");
    var Ls;
    var Overshoot_dem = 20; // [%] 
    var Overshoot_err = 1;
    
    
    
    if (Ld>Lq)    Ls = Lq;
    else          Ls = Ld;
    
    if(testVarValue('FFw_CL','Zero Cancellation'))
    {
      var Att       = 1/Math.sqrt(2);
      var f0_min    = Math.round(Rs/(Ls*4*Math.PI*Att)+1);
      var w0_cal_0  = f0_min*2*Math.PI;

      while(Math.abs(Overshoot_err)>0.0001)
        {
          w0_cal  = w0_cal_0 + 0.9*Overshoot_err/Math.abs(Overshoot_err);
          w_d     = w0_cal*Math.sqrt(1-Math.pow(Att,2));
          tgt     = (-w_d*Ls)/(Rs-Att*Ls*w0_cal);
          
          if (tgt>0) t_ust = Math.atan(tgt)/w_d;
          else       t_ust = (Math.atan(tgt)+Math.PI)/w_d;            
          
          Overshoot_cal = Rs-Rs*Math.exp(-w0_cal*Att*t_ust)*(Math.cos(w_d*t_ust) + (Att*w0_cal-Math.pow(w0_cal,2)*Ls/Rs)*Math.sin(w_d*t_ust)/w_d);
          Overshoot_err = (1+Overshoot_dem/100)*Rs - Overshoot_cal;
          w0_cal_0  = w0_cal;
        }      

      f0_calc         = Math.round(w0_cal/(2*Math.PI)); 
      CLoop_bandwidth = (f0_min<f0_calc) ? f0_calc:f0_min;
      switchParam2BasicMode("CLOOP_Att",Math.round(Att*1000)/1000);      
    }
    else
    {
      var f0_min  = Math.round(Rs/(Ls*4*Math.PI)+1);
      var f0_calc = Math.round(((Overshoot_dem/100)*Rs + Rs)/(4*Math.PI*Ls));

      CLoop_bandwidth =  (f0_min<f0_calc) ? f0_calc:f0_min;
      switchParam2BasicMode("CLOOP_Att",1);            
    }
      
    // replace and disable params
    switchParam2BasicMode("CLOOP_F0",CLoop_bandwidth);
    switchParam2BasicMode("CLOOP_LIM",90);
    switchParam2BasicMode("CLOOP_Ts",Ts);
    switchParam2BasicMode("UDC_FCUT",100);
}

/***************************************************************************//*!
*
* @brief  The function calculates ouput constans based on input parameters  
* @param   
* @return  None
* @remarks 
******************************************************************************/
function clickCalculateCloop()
{
    var fo    = getParentHtmlValue("CLOOP_F0");
    var Att   = getParentHtmlValue("CLOOP_Att");
    var Ts    = getParentHtmlValue("CLOOP_Ts");       
    var Rs    = getParentHtmlValue("Rs");
    var Ld    = getParentHtmlValue("Ld");
    var Lq    = getParentHtmlValue("Lq");
    var Ulim  = getParentHtmlValue("CLOOP_LIM");
    var Imax  = getParentHtmlValue("I_max");
    var UDCmax        = getParentHtmlValue("UDC_max");
    
   // var Umax  = getParentHtmlValue("U_max"); 
   Umax = UDCmax;
    
    var IIRxCoefsScaleType     = parent.document.getElementById("IIRxCoefsScale").innerText;
    //var Umax          = Math.round(UDCmax/UmaxCoeff*10)/10;  
            
   var aritType     = parent.document.getElementById("Arithmetic").innerText;
    
    // current controller limit in percentage of DC_BUS voltage actual
    Ulim_out = Math.round(Ulim/100*100)/100;

    // self-checking of Att value, it must be in a range (0.5 - 2)
    if (Att<0.5){
      alert("Entered value of Damping factor cannot be less than: 0.5 ");
      var prefixM = getActiveMotor();
      Att = 0.5;
      document.getElementById(prefixM + "CLOOP_Att").value=Att;      
      parent.document.getElementById(prefixM + "CLOOP_Att").innerHTML=Att;      
      }
   if (Att>2){
      alert("Entered value of Damping factor cannot be more than: 2 ");
      var prefixM = getActiveMotor();
      Att = 2;
      document.getElementById(prefixM + "CLOOP_Att").value=Att;      
      parent.document.getElementById(prefixM + "CLOOP_Att").innerHTML=Att;      
      }

    // self-checking of F0 value, it cannot be less than F0_min calculated from Kp equation
    if (Ld>Lq)    Ls = Lq;
    else          Ls = Ld;
    
    var f0_min = Rs/(4*Att*Math.PI*Ls);
    
    if (fo<f0_min){
      fo = Math.round(f0_min);
      alert("Entered value of Natural frequency F0 cannot be less than: " + Math.round(f0_min));
      var prefixM = getActiveMotor();
      document.getElementById(prefixM + "CLOOP_F0").value=Math.round(f0_min+1);
      parent.document.getElementById(prefixM + "CLOOP_F0").innerHTML=Math.round(f0_min+1);      
       }

      ////// PARALLEL PI CONTROLLER TYPE ///////

      //////////////////////// D axis PI controller ///////////////////////////////	
      
      // Pole-placement method for PI parameters calculation
      D_Kps = 2*Att*2*Math.PI*fo*Ld-Rs;
      D_Kis = Math.pow((2*Math.PI*fo),2)*Ld;
      
      // Billinear discretization method, from "s" to "z" domain
      D_Kpz = D_Kps;
      D_Kiz = D_Kis*Ts/2;
     
      // Normalization of PI constants
      D_Kpz_f = D_Kpz*Imax/Umax; 
      D_Kiz_f = D_Kiz*Imax/Umax;
      
      // Scaling the PI constants into the <-1,1) range  
      D_Kp_gain     = getScale(D_Kpz_f);
      D_Ki_gain     = getScale(D_Kiz_f);
      
      D_Kp_shift    = getScaleShift(D_Kpz_f);      
      D_Ki_shift    = getScaleShift(D_Kiz_f);

      // Double-check the fractional range 
      testFracValRange("D_Kp_gain",D_Kp_gain);
      testFracValRange("D_Ki_gain",D_Ki_gain);
      
      ///// ************** RECCURENT PI CONTROLLER TYPE ***************** ///////
      // PIrec constants calculated from PIp constants, "z" domain
      D_CC1z =  D_Kps + D_Kis*Ts/2;
      D_CC2z =  -D_Kps + D_Kis*Ts/2;
      	
      // Normalization of PI constants
      D_CC1_f = D_CC1z*Imax/Umax;
      D_CC2_f = D_CC2z*Imax/Umax;
    
      // scale shift
      if ((Math.abs(D_CC1_f)<1) && (Math.abs(D_CC2_f)<1))   
          D_Nshift = 0;
      else
      {
        if (Math.abs(D_CC1_f) > Math.abs(D_CC2_f))
            D_Nshift = getScaleShift(D_CC1_f); 
        else
            D_Nshift = getScaleShift(D_CC2_f);                 
      }

      D_CC1_gain = D_CC1_f/Math.pow(2,D_Nshift);
      D_CC2_gain = D_CC2_f/Math.pow(2,D_Nshift);
      testFracValRange("D_CC1_gain",D_CC1_gain);
      testFracValRange("D_CC2_gain",D_CC2_gain,1);
      
      // Zero cancelation block in feedforward path of the current control loop
      // Zero-cross cancelation filter constants
      D_ZC_B0_fl = D_Kis*Ts/(D_Kps+D_Kis*Ts);
      D_ZC_B1_fl = 0;
      D_ZC_A1_fl = -D_Kps/(D_Kps+D_Kis*Ts);
      
      //////////////////////// Related to Q axis ///////////////////	
      // Pole-placement method for PI parameters calculation
      Q_Kps = 2*Att*2*Math.PI*fo*Lq-Rs;
      Q_Kis = Math.pow((2*Math.PI*fo),2)*Lq;	
    		
      // Billinear discretization method, from "s" to "z" domain
      Q_Kpz = Q_Kps;
      Q_Kiz = Q_Kis*Ts/2;
      
      // Normalization of PI constants
      Q_Kpz_f = Q_Kpz*Imax/Umax; 
      Q_Kiz_f = Q_Kiz*Imax/Umax;
      
      // Ssaling the PI constants into the <-1,1) range 
      Q_Kp_gain     = getScale(Q_Kpz_f);
      Q_Ki_gain     = getScale(Q_Kiz_f);
      
      Q_Kp_shift    = getScaleShift(Q_Kpz_f);      
      Q_Ki_shift    = getScaleShift(Q_Kiz_f);
 
      testFracValRange("Q_Kp_gain",Q_Kp_gain);
      testFracValRange("Q_Ki_gain",Q_Ki_gain);  
      
      ///// ************** RECCURENT PI CONTROLLER TYPE ***************** ///////
      // PIrec constants calculated from PIp constants, "z" domain
      Q_CC1z = (Q_Kps + Q_Kis*Ts/2);
      Q_CC2z = (-Q_Kps + Q_Kis*Ts/2);
    
    // Normalization of PI parameters
      Q_CC1_f = Q_CC1z*Imax/Umax;
      Q_CC2_f = Q_CC2z*Imax/Umax;
    
      // scale shift
      if ((Math.abs(Q_CC1_f)<1) && (Math.abs(Q_CC2_f)<1))  
          Q_Nshift = 0;
      else
      {
        if (Math.abs(Q_CC1_f) > Math.abs(Q_CC2_f))
//            Q_Nshift = Math.ceil(Math.log(Math.abs(Q_CC1f))/Math.log(2));
            Q_Nshift = getScaleShift(Q_CC1_f); 
        else
            //Q_Nshift = Math.ceil(Math.log(Math.abs(Q_CC2f))/Math.log(2));        
            Q_Nshift = getScaleShift(Q_CC2_f);                 
      }
      
      Q_CC1_gain = Q_CC1_f/Math.pow(2,Q_Nshift);
      Q_CC2_gain = Q_CC2_f/Math.pow(2,Q_Nshift);
     
      testFracValRange("Q_CC1_gain",Q_CC1_gain);
      testFracValRange("Q_CC2_gaint",Q_CC2_gain,1);
      
      // Zero-cross cancelation filter constants
      Q_ZC_B0_fl = Q_Kis*Ts/(Q_Kps+Q_Kis*Ts);
      Q_ZC_B1_fl = 0;
      Q_ZC_A1_fl = -Q_Kps/(Q_Kps+Q_Kis*Ts);

      if(aritType!=='Float')
      {
        D_ZC_B0_f_out = D_ZC_B0_fl/IIRxCoefsScaleType;
        D_ZC_B1_f_out = D_ZC_B1_fl/IIRxCoefsScaleType;
        D_ZC_A1_f_out = D_ZC_A1_fl/IIRxCoefsScaleType;
        
        Q_ZC_B0_f_out = Q_ZC_B0_fl/IIRxCoefsScaleType;
        Q_ZC_B1_f_out = Q_ZC_B1_fl/IIRxCoefsScaleType;
        Q_ZC_A1_f_out = Q_ZC_A1_fl/IIRxCoefsScaleType;        
      }
      else
      {
        D_ZC_B0_f_out = D_ZC_B0_fl;
        D_ZC_B1_f_out = D_ZC_B1_fl;
        D_ZC_A1_f_out = D_ZC_A1_fl;
        
        Q_ZC_B0_f_out = Q_ZC_B0_fl;
        Q_ZC_B1_f_out = Q_ZC_B1_fl;
        Q_ZC_A1_f_out = Q_ZC_A1_fl;        
      }
  
     // If CURRENT LOOP tab is active ******************************************
      if(document.getElementById("CLoop") !== null)
      {
        ////// RECCURENT PI CONTROLLER TYPE ///////
        setInnerHtmlValue("D_CC1",D_CC1_gain,D_CC1z);
        setInnerHtmlValue("D_CC2",D_CC2_gain,D_CC2z);
        setInnerHtmlValue("D_Nsh",D_Nshift,'N/A');
        
        setInnerHtmlValue("Q_CC1",Q_CC1_gain,Q_CC1z);
        setInnerHtmlValue("Q_CC2",Q_CC2_gain,Q_CC2z);
        setInnerHtmlValue("Q_Nsh",Q_Nshift,'N/A');
    
        ////// PARALLEL PI CONTROLLER TYPE ///////
        setInnerHtmlValue("D_Kp_g",D_Kp_gain,D_Kpz);
        setInnerHtmlValue("D_Ki_g",D_Ki_gain,D_Kiz);        
        setInnerHtmlValue("D_Kp_sh",D_Kp_shift,'N/A');
        setInnerHtmlValue("D_Ki_sh",D_Ki_shift,'N/A');
        
        setInnerHtmlValue("Q_Kp_g",Q_Kp_gain,Q_Kpz);
        setInnerHtmlValue("Q_Ki_g",Q_Ki_gain,Q_Kiz);  
        setInnerHtmlValue("Q_Kp_sh",Q_Kp_shift,'N/A');
        setInnerHtmlValue("Q_Ki_sh",Q_Ki_shift,'N/A');
    
       // Zero cancelation
        setInnerHtmlValue("D_ZC_B0",D_ZC_B0_f_out,D_ZC_B0_f_out);
        setInnerHtmlValue("D_ZC_B1",D_ZC_B1_f_out,D_ZC_B1_f_out);
        setInnerHtmlValue("D_ZC_A1",D_ZC_A1_f_out,D_ZC_A1_f_out);
          
        setInnerHtmlValue("Q_ZC_B0",Q_ZC_B0_f_out,Q_ZC_B0_f_out);
        setInnerHtmlValue("Q_ZC_B1",Q_ZC_B1_f_out,Q_ZC_B1_f_out);
        setInnerHtmlValue("Q_ZC_A1",Q_ZC_A1_f_out,Q_ZC_A1_f_out);               
      }      
  
      // If HEADER FILE tab is active ********************************************
      if(document.getElementById("HeaderFileTab") !== null)
      {
        setInnerHtmlValueAsText("CLOOP_LIMIT",0,Ulim_out, Ulim_out);
        
        if(testVarValue('Ccontroller','Parallel')) // parallel type of PI controller
        {
            ////// PARALLEL PI CONTROLLER TYPE ///////
            setInnerHtmlValueAsText("D_KP_GAIN",0,D_Kp_gain,D_Kpz);
            setInnerHtmlValueAsText("D_KI_GAIN",0,D_Ki_gain,D_Kiz);
            setInnerHtmlValueAsText("D_KP_SHIFT",1,D_Kp_shift,'N/A');
            setInnerHtmlValueAsText("D_KI_SHIFT",1,D_Ki_shift,'N/A');
            
            setInnerHtmlValueAsText("Q_KP_GAIN",0,Q_Kp_gain,Q_Kpz);
            setInnerHtmlValueAsText("Q_KI_GAIN",0,Q_Ki_gain,Q_Kiz);        
            setInnerHtmlValueAsText("Q_KP_SHIFT",1,Q_Kp_shift,'N/A');
            setInnerHtmlValueAsText("Q_KI_SHIFT",1,Q_Ki_shift,'N/A');     
         }
         else // reccurent type of PI controller
         {
            ////// RECCURENT PI CONTROLLER TYPE ///////
            setInnerHtmlValueAsText("D_NSHIFT",1,D_Nshift,'N/A');
            setInnerHtmlValueAsText("D_CC1SC",0,D_CC1_gain,D_CC1z);
            setInnerHtmlValueAsText("D_CC2SC",0,D_CC2_gain,D_CC2z);
            
            setInnerHtmlValueAsText("Q_NSHIFT",1,Q_Nshift,'N/A');
            setInnerHtmlValueAsText("Q_CC1SC",0,Q_CC1_gain,Q_CC1z);
            setInnerHtmlValueAsText("Q_CC2SC",0,Q_CC2_gain,Q_CC2z);
         }
          
         if(testVarValue('FFw_CL','Zero Cancellation'))
         {
            // Zero cancelation
            setInnerHtmlValueAsText("D_ZC_B0",0,D_ZC_B0_f_out,D_ZC_B0_f_out);
            setInnerHtmlValueAsText("D_ZC_B1",0,D_ZC_B1_f_out,D_ZC_B1_f_out);
            setInnerHtmlValueAsText("D_ZC_A1",0,D_ZC_A1_f_out,D_ZC_A1_f_out);
            
            setInnerHtmlValueAsText("Q_ZC_B0",0,Q_ZC_B0_f_out,Q_ZC_B0_f_out);
            setInnerHtmlValueAsText("Q_ZC_B1",0,Q_ZC_B1_f_out,Q_ZC_B1_f_out);
            setInnerHtmlValueAsText("Q_ZC_A1",0,Q_ZC_A1_f_out,Q_ZC_A1_f_out);
         }        
      }  
      
  //  } // end if(fo<fmin)  
} 

function clickUpdateCloopFM()
{
  if(!pcm.IsCommPortOpen())
  {
      alert("Communication is stopped.\nPress Ctrl+K to start the communication");
  }
  else
  {
    xmlDoc=loadXMLDoc("xml_files\\FM_params_list.xml");
    var errorArray = [];   
    
    var aritType     = parent.document.getElementById("Arithmetic").innerText;
        
  //  errorArray.push(UpdateFMVariable(xmlDoc,'CL_LIMIT',Ulim_out,Ulim_out));
    
    if(testVarValue('Ccontroller','Parallel')) // parallel type of PI controller
    {
        errorArray.push(UpdateFMVariable(xmlDoc,'D_Kp_g',D_Kp_gain,D_Kpz));
        errorArray.push(UpdateFMVariable(xmlDoc,'D_Ki_g',D_Ki_gain,D_Kiz));
        
        if (aritType!=='Float')
        {
        errorArray.push(UpdateFMVariable(xmlDoc,'D_Kp_sc',D_Kp_shift));
        errorArray.push(UpdateFMVariable(xmlDoc,'D_Ki_sc',D_Ki_shift));
        }
     }
     else // reccurent type of PI controller
     {
        if (aritType!=='Float')
        errorArray.push(UpdateFMVariable(xmlDoc,'D_NSHIFT',D_Nshift));
        errorArray.push(UpdateFMVariable(xmlDoc,'D_CC1SC',D_CC1_gain,D_CC1z));
        errorArray.push(UpdateFMVariable(xmlDoc,'D_CC2SC',D_CC2_gain,D_CC2z));
     }
     
     // Zero cancelation filter enable
     if(testVarValue('FFw_CL','Zero Cancellation'))
     {
        errorArray.push(UpdateFMVariable(xmlDoc,'D_ZC_B0',D_ZC_B0_f_out,D_ZC_B0_f_out));
        errorArray.push(UpdateFMVariable(xmlDoc,'D_ZC_A1',D_ZC_A1_f_out,D_ZC_A1_f_out));
        errorArray.push(UpdateFMVariable(xmlDoc,'D_ZC_B1',D_ZC_B1_f_out,D_ZC_B1_f_out));        
     }   
     
     
      //////////////////////////////////////////////////////////////////////////////////
     
     if(testVarValue('Ccontroller','Parallel')) // parallel type of PI controller
     {
        errorArray.push(UpdateFMVariable(xmlDoc,'Q_Kp_g',Q_Kp_gain,Q_Kpz));
        errorArray.push(UpdateFMVariable(xmlDoc,'Q_Ki_g',Q_Ki_gain,Q_Kiz));
        
        if (aritType!=='Float')
        {
        errorArray.push(UpdateFMVariable(xmlDoc,'Q_Kp_sc',Q_Kp_shift));
        errorArray.push(UpdateFMVariable(xmlDoc,'Q_Ki_sc',Q_Ki_shift));
        }
     }
     else // reccurent type of PI controller
     {
        if (aritType!=='Float')
        errorArray.push(UpdateFMVariable(xmlDoc,'Q_NSHIFT',Q_Nshift));
        errorArray.push(UpdateFMVariable(xmlDoc,'Q_CC1SC',Q_CC1_gain,Q_CC1z));
        errorArray.push(UpdateFMVariable(xmlDoc,'Q_CC2SC',Q_CC2_gain,Q_CC2z));
     }
     
     // Zero cancelation filter enable
     if(testVarValue('FFw_CL','Zero Cancellation'))
     {
        errorArray.push(UpdateFMVariable(xmlDoc,'Q_ZC_B0',Q_ZC_B0_f_out,Q_ZC_B0_f_out));
        errorArray.push(UpdateFMVariable(xmlDoc,'Q_ZC_A1',Q_ZC_A1_f_out,Q_ZC_A1_f_out));
        errorArray.push(UpdateFMVariable(xmlDoc,'Q_ZC_B1',Q_ZC_B1_f_out,Q_ZC_B1_f_out));        
     } 
    
    //alert(errorArray);
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
function writeCLoopHTMLOutput(prefix,xmlObject)
{
      // Current Loop Control
      document.write(HTML_write_blank_line());              
      document.write(HTML_write_comment_line("Current Loop Control","",""));
      document.write(HTML_write_comment_line_dash());       
      
      document.write(HTML_write_comment_line("Loop bandwidth","CLOOP_F0",""));
      document.write(HTML_write_comment_line("Loop attenuation","CLOOP_Att",""));
      document.write(HTML_write_comment_line("Loop sample time","CLOOP_Ts",""));
      document.write(HTML_write_blank_line());
      document.write(HTML_write_define_line_number(prefix,0,"CLOOP_LIMIT",xmlObject));
      
      // D - axis
      document.write(HTML_write_blank_line()); 
      document.write(HTML_write_comment_line("D - axis parameters","",""));
      
      if(testVarValue('Ccontroller','Parallel'))
      {
        document.write(HTML_write_define_line_number(prefix,0,"D_KP_GAIN",xmlObject));
        document.write(HTML_write_define_line_number(prefix,1,"D_KP_SHIFT",xmlObject));
        document.write(HTML_write_define_line_number(prefix,0,"D_KI_GAIN",xmlObject));
        document.write(HTML_write_define_line_number(prefix,1,"D_KI_SHIFT",xmlObject)); 
      }
      else
      {
        document.write(HTML_write_define_line_number(prefix,0,"D_CC1SC",xmlObject));
        document.write(HTML_write_define_line_number(prefix,0,"D_CC2SC",xmlObject));
        document.write(HTML_write_define_line_number(prefix,1,"D_NSHIFT",xmlObject));        
      }
  
      if(testVarValue('FFw_CL','Zero Cancellation'))
      {              
        document.write(HTML_write_define_line_number(prefix,0,"D_ZC_B0",xmlObject));
        document.write(HTML_write_define_line_number(prefix,0,"D_ZC_B1",xmlObject));
        document.write(HTML_write_define_line_number(prefix,0,"D_ZC_A1",xmlObject));
      }      
        
      // Q - axis
      document.write(HTML_write_blank_line());                              
      document.write(HTML_write_comment_line("Q - axis parameters","",""));
     
      if(testVarValue('Ccontroller','Parallel'))
      {
        document.write(HTML_write_define_line_number(prefix,0,"Q_KP_GAIN",xmlObject));
        document.write(HTML_write_define_line_number(prefix,1,"Q_KP_SHIFT",xmlObject));
        document.write(HTML_write_define_line_number(prefix,0,"Q_KI_GAIN",xmlObject));
        document.write(HTML_write_define_line_number(prefix,1,"Q_KI_SHIFT",xmlObject)); 
      }
      else
      {
        document.write(HTML_write_define_line_number(prefix,0,"Q_CC1SC",xmlObject));
        document.write(HTML_write_define_line_number(prefix,0,"Q_CC2SC",xmlObject));
        document.write(HTML_write_define_line_number(prefix,1,"Q_NSHIFT",xmlObject));        
      }
                   
      if(testVarValue('FFw_CL','Zero Cancellation'))
      {              
        document.write(HTML_write_define_line_number(prefix,0,"Q_ZC_B0",xmlObject));
        document.write(HTML_write_define_line_number(prefix,0,"Q_ZC_B1",xmlObject));
        document.write(HTML_write_define_line_number(prefix,0,"Q_ZC_A1",xmlObject));
      } 
      
      copyParent2HeaderCfgById('CLOOP_F0','CLOOP_F0',' [Hz]',true);
      copyParent2HeaderCfgById('CLOOP_Att','CLOOP_Att',' [-]',true);
      copyParent2HeaderCfgById('CLOOP_Ts','CLOOP_Ts',' [sec]',true);
      clickCalculateCloop();

}
 
/***************************************************************************//*!
*
* @brief  The function reads values from input forms, scales them and write 
*         to output file form
* @param   
* @return 
* @remarks 
******************************************************************************/
function writeCLoopHeaderOutput(str) 
{
     str = write_blank_lines(str,1);     
     str = write_comment_text(str,'Current Loop Control','');
     str = write_comment_line_dash(str);
     str = write_comment_text(str,'Loop Bandwidth','CLOOP_F0');    
     str = write_comment_text(str,'Loop Attenuation','CLOOP_Att');
     str = write_comment_text(str,'Loop sample time','CLOOP_Ts');
     str = write_comment_line_dash(str);
   
     str = write_comment_text(str,'Current Controller Output Limit ','','');
     str = write_define_line_number(str,'CLOOP_LIMIT');
      
     //D-axis controller
     if(testVarValue('Ccontroller','Parallel'))
     {
        str = write_comment_text(str,'D-axis Controller - Parallel type','','');
        str = write_define_line_number(str,'D_KP_GAIN'); 
        str = write_define_line_number(str,'D_KP_SHIFT');
        str = write_define_line_number(str,'D_KI_GAIN');
        str = write_define_line_number(str,'D_KI_SHIFT');
      }
      else
      {
        str = write_comment_text(str,'D-axis Controller - Recurrent type','','');      
        str = write_define_line_number(str,'D_NSHIFT');
        str = write_define_line_number(str,'D_CC1SC');
        str = write_define_line_number(str,'D_CC2SC');
      }
      
      if(testVarValue('FFw_CL','Zero Cancellation'))
      {              
        str = write_define_line_number(str,'D_ZC_B0');
        str = write_define_line_number(str,'D_ZC_B1');
        str = write_define_line_number(str,'D_ZC_A1');
      }      
        
      // Q - axis
      if(testVarValue('Ccontroller','Parallel'))
     {
        str = write_comment_text(str,'Q-axis Controller - Parallel type','','');
        str = write_define_line_number(str,'Q_KP_GAIN'); 
        str = write_define_line_number(str,'Q_KP_SHIFT');
        str = write_define_line_number(str,'Q_KI_GAIN');
        str = write_define_line_number(str,'Q_KI_SHIFT');
      }
      else
      {
        str = write_comment_text(str,'Q-axis Controller - Recurrent type','','');
        str = write_define_line_number(str,'Q_NSHIFT');
        str = write_define_line_number(str,'Q_CC1SC');
        str = write_define_line_number(str,'Q_CC2SC');
      }
      
      if(testVarValue('FFw_CL','Zero Cancellation'))
      {              
        str = write_define_line_number(str,'Q_ZC_B0');
        str = write_define_line_number(str,'Q_ZC_B1');
        str = write_define_line_number(str,'Q_ZC_A1');
      }
      
    return str;  
}
/***************************************************************************//*!
*
* @brief  Unified function updating constants on active tab
* @param   
* @return 
* @remarks 
******************************************************************************/
function updateTab_CLoop()
{
   // update constants
   clickCalculateCloop();
}


/***************************************************************************//*!
* 
******************************************************************************
* End of code
******************************************************************************/
