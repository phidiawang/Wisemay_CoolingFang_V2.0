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
* @file   inner_PoSpeSensor.js
*
* @brief  Position and Speed engine
* 
******************************************************************************/
/******************************************************************************
* List of functions
******************************************************************************
* initLoadFormPoSpe() - init Position and Speed page paramters and constants  
* clickCalculatePoSpe() - calculates control constants based on input parameters
* clickUpdatePoSpeFM() - update selected variables in FreeMASTER application
* writePoSpeHTMLOutput(prefix,xmlObject) - write selected constants to output preview page 
* writePoSpeHeaderOutput(str) - write selected constants to output header file
*******************************************************************************/
/***************************************************************************//*!
*
* @brief  The function loads values from inner storage table to forms based
*         on parameter ID 
* @param   
* @return 
* @remarks 
******************************************************************************/
function initLoadFormPoSpe()
{
   var valType        = parent.document.getElementById("Arithmetic").innerText;
   //get active motor to selct proper prefix
   var prefixM = getActiveMotor();

    // add prefix to var ID
    if(prefixM!='')
       var PositionType = parent.document.getElementById(prefixM + 'PospeFbck').innerText;

    // in basic mode, precalculate paramters
    if(getActiveMode()==0) basicModeCalcPoSpe();
   
   copyParent2InnerValById("ENC_P");
   copyParent2InnerValById("RES_PP");

   copyParent2InnerValById("POSPE_Ts");
   copyParent2InnerValById("ATO_RES_F0");   
   copyParent2InnerValById("ATO_RES_Att");
   copyParent2InnerValById("ATO_ENC_F0");   
   copyParent2InnerValById("ATO_ENC_Att");
   
   // by default hide both sensor modules
   document.getElementById("Encoder").style.display = "none";
   document.getElementById("Resolver").style.display = "none";
   document.getElementById("Encoder_TO_input").style.display = "none";
   document.getElementById("Resolver_TO_input").style.display = "none";   
   document.getElementById("Resolver_PoSpe_PIrecur").style.display = "none";
   document.getElementById("Encoder_PoSpe_PIrecur").style.display = "none";
   
   // by default disable the Paralel PI in Sensor tab, Paralel form is not suported in AMMCLIb
   document.getElementById("Resolver_PoSpe_PIparal").style.display = "none";    
    
    //encoder
    if((PositionType>>>0)&1){
        document.getElementById("Encoder").style.display = "block";
        document.getElementById("Encoder_PoSpe_PIrecur").style.display = "block";
        document.getElementById("Encoder_TO_input").style.display = "block";

        // Disable shift values for Float implementation
        if(valType ==='Float')
        document.getElementById("row_ATO_ENC_NSh").style.display = 'none';        
    }
    // resolver
    if((PositionType>>>1)&1){
        document.getElementById("Resolver").style.display = "block";
        document.getElementById("Resolver_PoSpe_PIrecur").style.display = "block"; 
        document.getElementById("Resolver_TO_input").style.display = "block"; 

        // Disable shift values for Float implementation
        if(valType ==='Float')
        document.getElementById("row_ATO_RES_NSh").style.display = 'none';        
    }

    // Disable shift values for Float implementation
    if(valType ==='Float')
    document.getElementById("row_Integ_NShift").style.display = 'none';
       
   // enable button enabling
   ReloadStoreButtonsOnOff(1);
   
   //calculate constants
   clickCalculatePoSpe();
}

/***************************************************************************//*!
*
* @brief   Mark the Labels in the Fieldsets that's going to be updated
* @param   
* @return  None
* @remarks 
******************************************************************************/
function markUpdatePospeField()
{
    var obj = document.getElementById("Resolver_PoSpe_PIrecur").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';
    var obj = document.getElementById("Encoder_PoSpe_PIrecur").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';    
    var obj = document.getElementById("PoSpe_Integ").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';      
    
    document.getElementById("PoSpeUpdateFrm").title = "Red-headline constants will be updated to MCU on click"
}

/***************************************************************************//*!
* @brief   UnMark the Labels in the Fieldsets that's going to be updated
* @param   
* @return  None
* @remarks 
******************************************************************************/
function unmarkUpdatePospeField()
{
    var obj = document.getElementById("Resolver_PoSpe_PIrecur").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';
    var obj = document.getElementById("Encoder_PoSpe_PIrecur").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';    
    var obj = document.getElementById("PoSpe_Integ").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel'    
}

/***************************************************************************//*!
* @brief   Reload and Store button - hint appears on mouse over the button
* @param   
* @return  None
* @remarks 
******************************************************************************/
function reloadPospeField()
{
    document.getElementById("ReloadData").title = "Reloading input parameters from an MCAT external file";
}

function storePospeField()
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
function basicModeCalcPoSpe()
{
    var Ts  = getParentHtmlValue("POSPE_Ts");
    
    // replace and disable params
    switchParam2BasicMode("POSPE_Ts",Ts);
    switchParam2BasicMode("ATO_RES_F0",150);
    switchParam2BasicMode("ATO_RES_Att",1);
    switchParam2BasicMode("ATO_ENC_F0",150);
    switchParam2BasicMode("ATO_ENC_Att",1);
}

/***************************************************************************//*!
*
* @brief  The function calculates ouput constans based on input parameters   
* @param   
* @return  None
* @remarks 
******************************************************************************/
function clickCalculatePoSpe()
{
    var POSPE_Ts        = getParentHtmlValue("POSPE_Ts");
    var ATO_RES_F0      = getParentHtmlValue("ATO_RES_F0");
    var ATO_RES_Att     = getParentHtmlValue("ATO_RES_Att");       
    var ATO_ENC_F0      = getParentHtmlValue("ATO_ENC_F0");
    var ATO_ENC_Att     = getParentHtmlValue("ATO_ENC_Att");       
    
    var RES_PP          = getParentHtmlValue("RES_PP");
    var ENC_P           = getParentHtmlValue("ENC_P");
    var pp              = getParentHtmlValue("pp");
    var Nmax            = getParentHtmlValue("N_max");
    var Wmax            = 2*Math.PI*pp*Nmax/60;
    
///////////////////////////////////////////////
///////// RESOLVER ATO calculation///////////			
   
    // Pole-placement method for PI parameters calculation
    ATO_RES_Kps = 2*ATO_RES_Att*2*Math.PI*ATO_RES_F0;	
    ATO_RES_Kis = Math.pow((2*Math.PI*ATO_RES_F0),2);

    // Billinear discretization method, from "s" to "z" domain
    ATO_RES_Kpz = ATO_RES_Kps;	
    ATO_RES_Kiz = ATO_RES_Kis*POSPE_Ts/2;
    
    // Normalization of PI constants
    ATO_RES_Kpz_f = ATO_RES_Kpz*Math.PI/Wmax;	
    ATO_RES_Kiz_f = ATO_RES_Kiz*Math.PI/Wmax;
		
    // Scaling the PI constants into the <-1,1) range 
    ATO_RES_Kp_gain     = getScale(ATO_RES_Kpz_f);
    ATO_RES_Ki_gain     = getScale(ATO_RES_Kiz_f);

    ATO_RES_Kp_shift    = getScaleShift(ATO_RES_Kpz_f);      
    ATO_RES_Ki_shift    = getScaleShift(ATO_RES_Kiz_f);    
    
    ///// ************** RECCURENT PI CONTROLLER TYPE ***************** ///////
    // PIrec constants calculated from PIp constants, "z" domain
    ATO_RES_CC1z =  ATO_RES_Kps + ATO_RES_Kis*POSPE_Ts/2;
    ATO_RES_CC2z =  -ATO_RES_Kps + ATO_RES_Kis*POSPE_Ts/2;

    // Normalization of PI constants
    ATO_RES_CC1f = ATO_RES_CC1z*Math.PI/Wmax;
    ATO_RES_CC2f = ATO_RES_CC2z*Math.PI/Wmax;
    
    // scale shift
    if ((Math.abs(ATO_RES_CC1f)<1) && (Math.abs(ATO_RES_CC2f)<1)){
        ATO_RES_Nshift = 0;
    }
    else{
      if (Math.abs(ATO_RES_CC1f) > Math.abs(ATO_RES_CC2f))
            ATO_RES_Nshift =  getScaleShift(ATO_RES_CC1f); 
      else  ATO_RES_Nshift =  getScaleShift(ATO_RES_CC2f);       
    }

    ATO_RES_CC1_gain = ATO_RES_CC1f/Math.pow(2,ATO_RES_Nshift);
    ATO_RES_CC2_gain = ATO_RES_CC2f/Math.pow(2,ATO_RES_Nshift);
    
    // Resolver pole-pairs in Frac format
    RES_PPsc = getScaleShift(RES_PP);
    RES_PPfr = getScale(RES_PP);
    
///////////////////////////////////////////////    
////////// ENCODER ATO calculation///////////			
   
    // Pole-placement method for PI parameters calculation
    ATO_ENC_Kps = 2*ATO_ENC_Att*2*Math.PI*ATO_ENC_F0;	
    ATO_ENC_Kis = Math.pow((2*Math.PI*ATO_ENC_F0),2);

    // Billinear discretization method, from "s" to "z" domain
    ATO_ENC_Kpz = ATO_ENC_Kps;	
    ATO_ENC_Kiz = ATO_ENC_Kis*POSPE_Ts/2;
    
    // Normalization of PI constants
    ATO_ENC_Kpz_f = ATO_ENC_Kpz*Math.PI/Wmax;	
    ATO_ENC_Kiz_f = ATO_ENC_Kiz*Math.PI/Wmax;
		
    // Scaling the PI constants into the <-1,1) range 
    ATO_ENC_Kp_gain     = getScale(ATO_ENC_Kpz_f);
    ATO_ENC_Ki_gain     = getScale(ATO_ENC_Kiz_f);

    ATO_ENC_Kp_shift    = getScaleShift(ATO_ENC_Kpz_f);      
    ATO_ENC_Ki_shift    = getScaleShift(ATO_ENC_Kiz_f);    
    
    ///// ************** RECCURENT PI CONTROLLER TYPE ***************** ///////
    // PIrec constants calculated from PIp constants, "z" domain
    ATO_ENC_CC1z =  ATO_ENC_Kps + ATO_ENC_Kis*POSPE_Ts/2;
    ATO_ENC_CC2z =  -ATO_ENC_Kps + ATO_ENC_Kis*POSPE_Ts/2;

    // Normalization of PI constants
    ATO_ENC_CC1f = ATO_ENC_CC1z*Math.PI/Wmax;
    ATO_ENC_CC2f = ATO_ENC_CC2z*Math.PI/Wmax;
    
    // scale shift
    if ((Math.abs(ATO_ENC_CC1f)<1) && (Math.abs(ATO_ENC_CC2f)<1)){
        ATO_ENC_Nshift = 0;
    }
    else{
      if (Math.abs(ATO_ENC_CC1f) > Math.abs(ATO_ENC_CC2f))
            ATO_ENC_Nshift =  getScaleShift(ATO_ENC_CC1f); 
      else  ATO_ENC_Nshift =  getScaleShift(ATO_ENC_CC2f);       
    }

    ATO_ENC_CC1_gain = ATO_ENC_CC1f/Math.pow(2,ATO_ENC_Nshift);
    ATO_ENC_CC2_gain = ATO_ENC_CC2f/Math.pow(2,ATO_ENC_Nshift);    
   
  //  testFracValRange("ATO_Kp_gain",ATO_Kp_gain);
    //testFracValRange("ATO_Ki_gain",ATO_Ki_gain);

	  //	ATO_Nsh   = ATO_Nshift;
  /*  testFracValRange("ATO_RES_CC1_gain",ATO_RES_CC1_gain);
    testFracValRange("ATO_RES_CC2_gain",ATO_RES_CC2_gain);
    testFracValRange("ATO_ENC_CC1_gain",ATO_ENC_CC1_gain);
    testFracValRange("ATO_ENC_CC2_gain",ATO_ENC_CC2_gain);*/
    

    // Integrator in ATO calculation - it is always same for both sensors
    Kint = Wmax*POSPE_Ts/Math.PI/2

    if (Kint>=(1-1/Math.pow(2,31)))   Kint_sc = Math.ceil(Math.log(Math.abs(Kint))/Math.log(2));
    else                              Kint_sc = 0;

    Int_Nsh  = Kint_sc;
    Int_C1   = Kint/Math.pow(2,Kint_sc);

    // ATO Integral constant - float implementation
    Kint = POSPE_Ts/2;

    // If Sensors tab is active ******************************************
    if(document.getElementById("PoSpe") !== null)
    {
      setInnerHtmlValue("ATO_RES_CC1",ATO_RES_CC1_gain,ATO_RES_CC1z);
      setInnerHtmlValue("ATO_RES_CC2",ATO_RES_CC2_gain,ATO_RES_CC2z);
      setInnerHtmlValue("ATO_RES_NSh",ATO_RES_Nshift,'N/A' );      
      setInnerHtmlValue("ATO_ENC_CC1",ATO_ENC_CC1_gain,ATO_ENC_CC1z);
      setInnerHtmlValue("ATO_ENC_CC2",ATO_ENC_CC2_gain,ATO_ENC_CC2z);
      setInnerHtmlValue("ATO_ENC_NSh",ATO_ENC_Nshift,'N/A' );      
             
      setInnerHtmlValue("Integ_g",Int_C1,Kint);
    }
   
    // If HEADER FILE tab is active ********************************************
    if(document.getElementById("HeaderFileTab") !== null)
    {	
      var PositionType = parent.document.getElementById(prefixM + 'PospeFbck').innerText;
      
      // Encoder
      if((PositionType>>>0)&1)
      {
        setInnerHtmlValueAsText("POSPE_ENC_NSHIFT",2,ATO_ENC_Nshift,'N/A');
        setInnerHtmlValueAsText("POSPE_ENC_CC1",0,ATO_ENC_CC1_gain,ATO_ENC_CC1z);
        setInnerHtmlValueAsText("POSPE_ENC_CC2",0,ATO_ENC_CC2_gain,ATO_ENC_CC2z);      
        setInnerHtmlValueAsText("POSPE_ENC_INTEG_GAIN",0,Int_C1,Kint);
        setInnerHtmlValueAsText("POSPE_ENC_INTEG_SC",1,Int_Nsh);          
        setInnerHtmlValueAsText("POSPE_ENC_PULSES",1,ENC_P,ENC_P);
      }
      
      // Resolver
      if((PositionType>>>1)&1)
      {       
        setInnerHtmlValueAsText("POSPE_RES_NSHIFT",2,ATO_RES_Nshift,'N/A');
        setInnerHtmlValueAsText("POSPE_RES_CC1",0,ATO_RES_CC1_gain,ATO_RES_CC1z);
        setInnerHtmlValueAsText("POSPE_RES_CC2",0,ATO_RES_CC2_gain,ATO_RES_CC2z);      
        setInnerHtmlValueAsText("POSPE_RES_INTEG_GAIN",0,Int_C1,Kint);
        setInnerHtmlValueAsText("POSPE_RES_INTEG_SC",1,Int_Nsh);          
        setInnerHtmlValueAsText("POSPE_RES_PP_GAIN",0,RES_PPfr,RES_PP);
        setInnerHtmlValueAsText("POSPE_RES_PP_SC",2,RES_PPsc,'N/A');            
      }
    }
  } 

/***************************************************************************//*!
*
* @brief   update variables in FreeMASTER application
* @param   
* @return  None
* @remarks 
******************************************************************************/
function clickUpdatePoSpeFM()
{
  if(!pcm.IsCommPortOpen())
  {
      alert("Communication is stopped.\nPress Ctrl+K to start the communication");
  }
  else
  {
    xmlDoc=loadXMLDoc("xml_files\\FM_params_list.xml"); 
    var errorArray = [];
    var MotorPrefix = getActiveMotor();
    
    // calculate actual constant values 
    clickCalculatePoSpe();
    var aritType     = parent.document.getElementById("Arithmetic").innerText; 
    
    PositionType = Number(parent.document.getElementById(MotorPrefix + 'PospeFbck').innerText);

    // if encoder available
    if ((PositionType>>>0)&1){
        errorArray.push(UpdateFMVariable(xmlDoc,'ATO_ENC_CC1',ATO_ENC_CC1_gain,ATO_ENC_CC1z));
        errorArray.push(UpdateFMVariable(xmlDoc,'ATO_ENC_CC2',ATO_ENC_CC2_gain,ATO_ENC_CC2z));
        errorArray.push(UpdateFMVariable(xmlDoc,'INTEG_ENC_G',Int_C1,Kint));  
        
        if (aritType!=='Float'){
            
            errorArray.push(UpdateFMVariable(xmlDoc,'ATO_ENC_NSHIFT',ATO_ENC_Nshift));
            errorArray.push(UpdateFMVariable(xmlDoc,'INTEG_ENC_SC',Int_Nsh));
        }
    }
    // if resolver available
    if ((PositionType>>>1)&1){
        errorArray.push(UpdateFMVariable(xmlDoc,'ATO_RES_CC1',ATO_RES_CC1_gain,ATO_RES_CC1z));
        errorArray.push(UpdateFMVariable(xmlDoc,'ATO_RES_CC2',ATO_RES_CC2_gain,ATO_RES_CC2z));
        errorArray.push(UpdateFMVariable(xmlDoc,'INTEG_RES_G',Int_C1,Kint));
        
        if (aritType!=='Float'){
            errorArray.push(UpdateFMVariable(xmlDoc,'ATO_RES_NSHIFT',ATO_RES_Nshift));
            errorArray.push(UpdateFMVariable(xmlDoc,'INTEG_RES_SC',Int_Nsh));
        }
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
function writePoSpeSensorHTMLOutput(prefix,xmlObject)
{ 
    var PositionType = parent.document.getElementById(prefixM + 'PospeFbck').innerText;

    // Position & Speed module
    document.write(HTML_write_blank_line());     
    document.write(HTML_write_comment_line("Position & Speed Sensors Module","",""));
    document.write(HTML_write_comment_line_dash()); 
    document.write(HTML_write_comment_line("Loop sample time","ATO_Ts",""));    
     
    // Resolver
    if((PositionType>>>1)&1)
    {    
        document.write(HTML_write_blank_line());  
        document.write(HTML_write_comment_line("Resolver ATO Loop bandwidth","ATO_RES_F0",""));
        document.write(HTML_write_comment_line("Resolver ATO Loop attenuation","ATO_RES_Att",""));    
        document.write(HTML_write_define_line_number(prefix,0,"POSPE_RES_CC1",xmlObject));
        document.write(HTML_write_define_line_number(prefix,0,"POSPE_RES_CC2",xmlObject));
        document.write(HTML_write_define_line_number(prefix,1,"POSPE_RES_NSHIFT",xmlObject));        

        document.write(HTML_write_define_line_number(prefix,0,"POSPE_RES_INTEG_GAIN",xmlObject));
        document.write(HTML_write_define_line_number(prefix,1,"POSPE_RES_INTEG_SC",xmlObject));

        document.write(HTML_write_define_line_number(prefix,0,"POSPE_RES_PP_GAIN",xmlObject));
        document.write(HTML_write_define_line_number(prefix,1,"POSPE_RES_PP_SC",xmlObject));       
        
        copyParent2HeaderCfgById('ATO_RES_F0','ATO_RES_F0',' [Hz]',true);
        copyParent2HeaderCfgById('ATO_RES_Att','ATO_RES_Att',' [-]',true);        
    }    
    
    if((PositionType>>>0)&1) // Encoder     
    {
        document.write(HTML_write_blank_line());     
        document.write(HTML_write_comment_line("Encoder ATO Loop bandwidth","ATO_ENC_F0",""));
        document.write(HTML_write_comment_line("Encoder ATO Loop attenuation","ATO_ENC_Att",""));        

        document.write(HTML_write_define_line_number(prefix,0,"POSPE_ENC_CC1",xmlObject));
        document.write(HTML_write_define_line_number(prefix,0,"POSPE_ENC_CC2",xmlObject));
        document.write(HTML_write_define_line_number(prefix,1,"POSPE_ENC_NSHIFT",xmlObject));        

        document.write(HTML_write_define_line_number(prefix,0,"POSPE_ENC_INTEG_GAIN",xmlObject));
        document.write(HTML_write_define_line_number(prefix,1,"POSPE_ENC_INTEG_SC",xmlObject));

        document.write(HTML_write_define_line_number(prefix,0,"POSPE_ENC_PULSES",xmlObject));

        copyParent2HeaderCfgById('ATO_ENC_F0','ATO_ENC_F0',' [Hz]',true);
        copyParent2HeaderCfgById('ATO_ENC_Att','ATO_ENC_Att',' [-]',true);
    }
    
    copyParent2HeaderCfgById('ATO_Ts','CLOOP_Ts',' [sec]',true);

    clickCalculatePoSpe();
    
}

/***************************************************************************//*!
* @brief  The function reads values from input forms, scales them and write 
*         to output file form
* @param   
* @return 
* @remarks 
******************************************************************************/
function writePoSpeSensorHeaderOutput(str)
{
   var PositionType = parent.document.getElementById(prefixM + 'PospeFbck').innerText;
  
   str = write_blank_lines(str,1);     
   str = write_comment_text(str,'Position & Speed Sensors Module','');
   str = write_comment_text(str,'Loop sample time','ATO_Ts');
    
   if((PositionType>>>0)&1) // Encoder
   {
    str = write_comment_line_dash(str);
    str = write_comment_text(str,'Encoder Loop Bandwidth','ATO_ENC_F0');    
    str = write_comment_text(str,'Encoder Loop Attenuation','ATO_ENC_Att');
    // Position & Speed module
    str = write_define_line_number(str,'POSPE_ENC_NSHIFT');
    str = write_define_line_number(str,'POSPE_ENC_CC1');
    str = write_define_line_number(str,'POSPE_ENC_CC2');
    str = write_define_line_number(str,'POSPE_ENC_INTEG_GAIN');
    str = write_define_line_number(str,'POSPE_ENC_INTEG_SC');       
    str = write_define_line_number(str,'POSPE_ENC_PULSES');
   }
      // Resolver
   if((PositionType>>>1)&1)
   {       
    str = write_comment_line_dash(str);
    str = write_comment_text(str,'Resolver Loop Bandwidth','ATO_RES_F0');    
    str = write_comment_text(str,'Resolver Loop Attenuation','ATO_RES_Att');
    // Position & Speed module
    str = write_define_line_number(str,'POSPE_RES_NSHIFT');
    str = write_define_line_number(str,'POSPE_RES_CC1');
    str = write_define_line_number(str,'POSPE_RES_CC2');
    str = write_define_line_number(str,'POSPE_RES_INTEG_GAIN');
    str = write_define_line_number(str,'POSPE_RES_INTEG_SC'); 
    str = write_define_line_number(str,'POSPE_RES_PP_GAIN');
    str = write_define_line_number(str,'POSPE_RES_PP_SC');     
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
function updateTab_PoSpe()
{
   // update constants
   clickCalculatePoSpe();
}
/***************************************************************************//*!
* 
******************************************************************************
* End of code
******************************************************************************/
    