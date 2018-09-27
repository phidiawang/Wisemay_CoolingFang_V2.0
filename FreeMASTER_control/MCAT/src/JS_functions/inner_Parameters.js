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
* @file   inner_Parameters.js
*
* @brief  Parameters tab engine
*
******************************************************************************/

/******************************************************************************
* List of functions
******************************************************************************
*  initLoadFormParamValues()
*  writeParametersHTMLOutput(prefix,xmlObject)
*  writeParametersHeaderOutput(str)
*  writeFMScalesHTMLOutput(prefix,xmlObject)
*  writeFMScalesHeaderOutput(str)
*  updateTab_Paramters() - callback function
*******************************************************************************/

/***************************************************************************//*!
/***************************************************************************//*!
*
* @brief  The function loads values from inner storage table to forms based
*         on parameter ID
* @param   
* @return 
* @remarks 
******************************************************************************/
 function initLoadFormParamValues()
 {
   
    // in basic mode, precalculate paramters
    if(getActiveMode()==0)
      basicModeCalcParam();
  
     
     
    // mandatory input parameters
    copyParent2InnerValById("Rs");
    copyParent2InnerValById("Ld");
    copyParent2InnerValById("Lq");
    copyParent2InnerValById("ke");         
    copyParent2InnerValById("pp");
    copyParent2InnerValById("J");
   
    copyParent2InnerValById("I_ph");
    copyParent2InnerValById("U_ph");
    copyParent2InnerValById("N_nom");
    
    copyParent2InnerValById("I_max");
    
    copyParent2InnerValById("UDC_max");
    
    // precalculated or manualy added
    copyParent2InnerValById("UDC_trip");
    copyParent2InnerValById("UDC_under");
    copyParent2InnerValById("UDC_over");
    copyParent2InnerValById("IPH_over");
    
    copyParent2InnerValById("Temp_over");
    copyParent2InnerValById("TEMP_max");
    
    copyParent2InnerValById("N_max"); 
    copyParent2InnerValById("U_max");
    
    if(testActiveTab('Sensorless'))
        copyParent2InnerValById("E_max");
    
    copyParent2InnerValById("kt");
    
    copyParent2InnerValById("ALIGN_U");
    copyParent2InnerValById("ALIGN_I");
    copyParent2InnerValById("ALIGN_T");
    
    
    if(testVarValue('Alignment','Voltage'))
    {
      document.getElementById("Volt_align").style.display = "";
      document.getElementById("Curr_align").style.display = "none";
    }
    else
    {
      document.getElementById("Volt_align").style.display = "none";
      document.getElementById("Curr_align").style.display = "";
    }
    // enable button enabling
    ReloadStoreButtonsOnOff(1);
    
    
    
    //calculate constants
    clickCalculateParam();
}

/***************************************************************************//*!
*
* @brief   Mark the Labels in the Fieldsets that's going to be updated
* @param   
* @return  None
* @remarks 
******************************************************************************/
function markUpdateParamField()
{
    var obj = document.getElementById("Alignment").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabelred';

    document.getElementById("ParamsUpdateFrm").title = "Red-headline constants will be updated to MCU on click";
    
}

/***************************************************************************//*!
* @brief   UnMark the Labels in the Fieldsets that's going to be updated
* @param   
* @return  None
* @remarks 
******************************************************************************/
function unmarkUpdateParamField()
{
    var obj = document.getElementById("Alignment").getElementsByTagName('legend')[0];
    obj.className = 'fontControlLabel';
}

/***************************************************************************//*!
* @brief   Reload and Store button - hint appears on mouse over the button
* @param   
* @return  None
* @remarks 
******************************************************************************/
function reloadParamField()
{
    document.getElementById("ReloadData").title = "Reloading input parameters from an MCAT external file";
}

function storeParamField()
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
function basicModeCalcParam()
{
    var prefixM = getActiveMotor();
    
    var UDCB_max      = getParentHtmlValue("UDC_max");
    var ke            = getParentHtmlValue("ke");
    var N_nom_max     = getParentHtmlValue("N_nom");
    var I_nom         = getParentHtmlValue("I_ph");
    var U_nom         = getParentHtmlValue("U_ph");
    var Imax          = getParentHtmlValue("I_max");
    var pp            = getParentHtmlValue("pp");
    var J             = getParentHtmlValue("J");
    var Rs            = getParentHtmlValue("Rs");
    var TEMPmax       = getParentHtmlValue("TEMP_max");
    var TEMPover      = getParentHtmlValue("Temp_over");
    
    
    // calculated input parameters
    UDCB_trip = Math.round(UDCB_max*0.8*10)/10;
    UDCB_under = Math.round(UDCB_max*0.4*10)/10;
    UDCB_over = Math.round(UDCB_max*0.8*10)/10;
    if(Imax>I_nom)      IPH_over = Math.round(I_nom*0.8*10)/10;
    else                IPH_over = Math.round(Imax*0.8*10)/10;

    TEMP_over_sc = TEMPover/TEMPmax;

    if(TEMP_over_sc<1){}
    else{
        document.getElementById(prefixM + "Temp_over").value =  TEMPmax-1;
        parent.document.getElementById(prefixM+"Temp_over").innerHTML = (TEMPmax-1).toString();
    }

    N_max =   Math.round(1.1*N_nom_max*10)/10;
    E_scale = Math.round(1.1*ke*N_max*pp*2*Math.PI/60*100)/100;
    Kt = Math.round(ke*Math.sqrt(2/3)*100000)/100000;
    //Kt = (0.5).toFixed(1);
    U_align = Math.round(U_nom*0.1*10)/10;
    I_align = Math.round(I_nom*0.1*10)/10;
    T_align = Math.round(J*Rs/ke/Kt/2*100000)/100000;
    
    // replace and disable params
    switchParam2BasicMode("UDC_trip",UDCB_trip);
    switchParam2BasicMode("UDC_under",UDCB_under);
    switchParam2BasicMode("UDC_over",UDCB_over);
    switchParam2BasicMode("IPH_over",IPH_over);    
    
    switchParam2BasicMode("N_max",N_max);
    
    if(testActiveTab('Sensorless'))
        switchParam2BasicMode("E_max",E_scale);
    switchParam2BasicMode("kt",Kt);
    switchParam2BasicMode("ALIGN_U",U_align);
    switchParam2BasicMode("ALIGN_I",I_align);
  //  switchParam2BasicMode("ALIGN_T",T_align);
    
    // disable button FRM Update
    document.getElementById("ParamsUpdateFrm").disabled = true;
    document.getElementById("ParamsUpdateFrm").className = "fButtonsDisabled";

}

/***************************************************************************//*!
*
* @brief  The function calculates ouput constans based on input parameters   
* @param   
* @return  None
* @remarks 
******************************************************************************/
function clickCalculateParam()
{
    var prefixM = getActiveMotor();
    
    Align_volt        = getParentHtmlValue("ALIGN_U"); //need to be global var
    Align_cur         = getParentHtmlValue("ALIGN_I"); //need to be global var
    
    var CLOOP_Ts      = getParentHtmlValue("CLOOP_Ts");
    var SLOOP_Ts      = getParentHtmlValue("SLOOP_Ts");
    var Align_dur     = getParentHtmlValue("ALIGN_T");
    //var UmaxCoeff     = getParentHtmlValue("UmaxCoeff");
    var Emax          = getParentHtmlValue("E_max");
    var Umax          = getParentHtmlValue("U_max");    
    var UDCtrip       = getParentHtmlValue("UDC_trip"); 
    var Iphnom        = getParentHtmlValue("I_ph");
    var Motor_pp      = getParentHtmlValue("pp");
    var Udc_bus_Fcut  = getParentHtmlValue("UDC_FCUT");
    var IIRxCoefsScaleType     = parent.document.getElementById("IIRxCoefsScale").innerText;
    
    var Imax          = getParentHtmlValue("I_max");
    UDCmax        = getParentHtmlValue("UDC_max");
    Nmax          = getParentHtmlValue("N_max");
    TEMPmax       = getParentHtmlValue("TEMP_max");
    Wmax          = Math.round(Motor_pp*Nmax*2*Math.PI*100/60)/100;
    //Umax          = Math.round(UDCmax/UmaxCoeff*10)/10;
    
    UDCunder      = getParentHtmlValue("UDC_under");
    UDCover       = getParentHtmlValue("UDC_over");
    IPHover       = getParentHtmlValue("IPH_over");
    TEMPover      = getParentHtmlValue("Temp_over");
    Nnom          = getParentHtmlValue("N_nom");
      
   // FM_Umax = Umax;

    Align_volt_sc = Align_volt/Umax;
    testFracValRange("Align_volt_sc",Align_volt_sc); 
    Align_cur_sc = Align_cur/Imax;
    testFracValRange("Align_cur_sc",Align_cur_sc);
    Align_dur_sc =  Math.round(Align_dur/CLOOP_Ts);
    
    UDC_trip_sc     = UDCtrip/UDCmax;
    UDC_under_sc    = UDCunder/UDCmax;
    UDC_over_sc     = UDCover/UDCmax;
    IPH_over_sc     = IPHover/Imax;
    TEMP_over_sc    = TEMPover/TEMPmax;

    // check wether "over" parameter is lower than "max" parameter
    if(TEMP_over_sc<1){}
    else{
        if(document.getElementById("Parameters"))    
            document.getElementById(prefixM + "Temp_over").value =  TEMPmax-1;
        parent.document.getElementById(prefixM+"Temp_over").innerHTML = (TEMPmax-1).toString();
    }
    
    if(IPH_over_sc<1){}
    else{
        if(document.getElementById("Parameters"))    
            document.getElementById(prefixM + "IPH_over").value =  Imax*0.98;
        parent.document.getElementById(prefixM+"IPH_over").innerHTML = (Imax*0.98).toString();
    }
    
    
    N_nom_max_sc    = Nnom/Nmax;
    I_ph_nom_sc     = Iphnom/Imax;
    FREQmax         = (Nmax/60*Motor_pp);

    // get motor pole-pairs scales & shift for FRAC implementation
    Motor_ppsc    = getScaleShift(Motor_pp);      
    Motor_ppfr    = getScale(Motor_pp);
    
    // UDC voltage IIR filter calculation
    UDCB_IIR_cutoff_freq = Udc_bus_Fcut; 
    UDCB_IIR_B0_fl = (2*Math.PI*UDCB_IIR_cutoff_freq*CLOOP_Ts)/(2+(2*Math.PI*UDCB_IIR_cutoff_freq*CLOOP_Ts)); 
    UDCB_IIR_B1_fl = (2*Math.PI*UDCB_IIR_cutoff_freq*CLOOP_Ts)/(2+(2*Math.PI*UDCB_IIR_cutoff_freq*CLOOP_Ts));
    UDCB_IIR_A1_fl = (2*Math.PI*UDCB_IIR_cutoff_freq*CLOOP_Ts-2)/(2+(2*Math.PI*UDCB_IIR_cutoff_freq*CLOOP_Ts));
    UDCB_IIR_B0_out =  UDCB_IIR_B0_fl/IIRxCoefsScaleType;
    UDCB_IIR_B1_out =  UDCB_IIR_B1_fl/IIRxCoefsScaleType;
    UDCB_IIR_A1_out =  UDCB_IIR_A1_fl/IIRxCoefsScaleType;
    testFracValRange("UDCB_IIR_B0_out",UDCB_IIR_B0_out,1);
    testFracValRange("UDCB_IIR_B1_out",UDCB_IIR_B1_out,1);
    testFracValRange("UDCB_IIR_A1_out",UDCB_IIR_A1_out,1);
    
     
    // If Header File Output tab is active ******************************************
    if(document.getElementById("HeaderFileTab") !== null)
    {
    
      setInnerHtmlValueAsText("MOTOR_PP",6,Motor_pp, Motor_pp);
      setInnerHtmlValueAsText("MOTOR_PP_GAIN",3,Motor_ppfr, Motor_ppfr);
      setInnerHtmlValueAsText("MOTOR_PP_SHIFT",2,Motor_ppsc, Motor_ppsc);      
          
      // write maximal scales to forms in Output File HTML page
      setInnerHtmlValueAsText("I_MAX",8,Imax, Imax);
      setInnerHtmlValueAsText("U_DCB_MAX",8,UDCmax, UDCmax);
      setInnerHtmlValueAsText("U_MAX",8,Umax, Umax);
      setInnerHtmlValueAsText("N_MAX",8,Nmax, Nmax);
      setInnerHtmlValueAsText("WEL_MAX",8,Wmax, Wmax);
      setInnerHtmlValueAsText("E_MAX",8,Emax, Emax);
      setInnerHtmlValueAsText("FREQ_MAX",5,FREQmax, FREQmax);
      setInnerHtmlValueAsText("TEMP_MAX",5,TEMPmax, TEMPmax);
      
      setInnerHtmlValueAsText("U_DCB_TRIP",0,UDC_trip_sc, UDCtrip);
      setInnerHtmlValueAsText("U_DCB_UNDERVOLTAGE",0,UDC_under_sc, UDCunder);
      setInnerHtmlValueAsText("U_DCB_OVERVOLTAGE",0,UDC_over_sc, UDCover);
      setInnerHtmlValueAsText("I_PH_OVERCURRENT",0,IPH_over_sc, IPHover);
      setInnerHtmlValueAsText("TEMP_OVER",0,TEMP_over_sc, TEMPover);
     // setInnerHtmlValueAsText("N_MIN",0,N_min_sc, Nmin);
      
      //setInnerHtmlValueAsText("N_NOM",0, N_nom_max_sc, Nnom);
      //setInnerHtmlValueAsText("I_PH_NOM",0,I_ph_nom_sc,Iphnom);
      
      setInnerHtmlValueAsText("FM_FREQ_SCALE",8,FREQmax, FREQmax);
    
      // write values to forms in Output File Html page
      if(testVarValue('Alignment','Voltage'))
        setInnerHtmlValueAsText("ALIGN_VOLTAGE",0,Align_volt_sc, Align_volt);
      else
        setInnerHtmlValueAsText("ALIGN_CURRENT",0,Align_cur_sc, Align_cur);  
      
      setInnerHtmlValueAsText("ALIGN_DURATION",2,Align_dur_sc);
      
      // DCB voltage IIR filter
      setInnerHtmlValueAsText("UDCB_IIR_B0",0,UDCB_IIR_B0_out,UDCB_IIR_B0_fl);
      setInnerHtmlValueAsText("UDCB_IIR_B1",0,UDCB_IIR_B1_out,UDCB_IIR_B1_fl);
      setInnerHtmlValueAsText("UDCB_IIR_A1",0,UDCB_IIR_A1_out,UDCB_IIR_A1_fl);
      
    }  
}
/***************************************************************************//*!
*
* @brief   update variables in FreeMASTER application
* @param   
* @return  None
* @remarks 
******************************************************************************/
function clickUpdateParamFM()
{
    if(!pcm.IsCommPortOpen())
    {
      alert("Communication is stopped.\nPress Ctrl+K to start the communication");
    }
    else
    {
    var errorArray = [];
   
    xmlDoc=loadXMLDoc("xml_files\\FM_params_list.xml"); 
    
    //calculate constants
    clickCalculateParam();
    
    if(testVarValue('Alignment','Voltage'))
      errorArray.push(UpdateFMVariable(xmlDoc,'Align_Voltage',Align_volt,Align_volt));
    else
      errorArray.push(UpdateFMVariable(xmlDoc,'Align_Current',Align_cur,Align_cur_sc));
   
    // alignment duration
    errorArray.push(UpdateFMVariable(xmlDoc,'Align_Duration',Align_dur_sc,Align_dur_sc));
    
    // Scales
      
    // Fault thresholds
    /*TestRangeTrim("N_req", 0, Nmax-1, "rpm");
    TestRangeTrim("N_min", 0, Nmax-1, "rpm");
    TestRangeTrim("N_over", 0, Nmax-1, "rpm");
    TestRangeTrim("UDC_under", 0, UDCmax-1, "V");
    TestRangeTrim("UDC_over", 0, UDCmax-1, "V");
    errorArray.push(UpdateFMVariable(xmlDoc,'N_nom',getParentHtmlValue("N_req"),getParentHtmlValue("N_req")));
    errorArray.push(UpdateFMVariable(xmlDoc,'N_min',getParentHtmlValue("N_min"),getParentHtmlValue("N_min")));
    errorArray.push(UpdateFMVariable(xmlDoc,'N_over',getParentHtmlValue("N_over"),getParentHtmlValue("N_over")));
    errorArray.push(UpdateFMVariable(xmlDoc,'DCB_under',getParentHtmlValue("UDC_under"),getParentHtmlValue("UDC_under")));
    errorArray.push(UpdateFMVariable(xmlDoc,'DCB_over',getParentHtmlValue("UDC_over"),getParentHtmlValue("UDC_over")));*/
    
    // display error message if any error detected
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
function writeParametersHTMLOutput(prefix,xmlObject)
{
    var Udc_bus_Fcut  = getParentHtmlValue("UDC_FCUT");
       
    document.write(HTML_write_blank_line());
    document.write(HTML_write_comment_line("Motor Parameters","",""));
    document.write(HTML_write_comment_line_dash());
    document.write(HTML_write_comment_line("Stator resistance","Rs",""));
    document.write(HTML_write_comment_line("Pole-pair numbers","pp",""));
    document.write(HTML_write_comment_line("Direct axis inductance","Ld",""));
    document.write(HTML_write_comment_line("Quadrature axis inductance","Lq",""));
    document.write(HTML_write_comment_line("Back-EMF constant","ke",""));
    document.write(HTML_write_comment_line("Drive inertia","J",""));
    document.write(HTML_write_comment_line("Nominal current","Iph",""));
    document.write(HTML_write_comment_line("Nominal speed","N_nom",""));    
    
    document.write(HTML_write_blank_line());
    document.write(HTML_write_define_line_number(prefix,2,"MOTOR_PP",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"MOTOR_PP_GAIN",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"MOTOR_PP_SHIFT",xmlObject));     
    document.write(HTML_write_blank_line());
    document.write(HTML_write_comment_line("Application Scales","",""));
    document.write(HTML_write_comment_line_dash());
    document.write(HTML_write_define_line_number(prefix,0,"I_MAX",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"U_DCB_MAX",xmlObject));
    //document.write(HTML_write_define_line_number(prefix,0,"U_MAX",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"N_MAX",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"WEL_MAX",xmlObject));
    //document.write(HTML_write_define_line_number(prefix,0,"FREQ_MAX",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"TEMP_MAX",xmlObject));
    if(testActiveTab('Sensorless'))
      document.write(HTML_write_define_line_number(prefix,0,"E_MAX",xmlObject));
  
    document.write(HTML_write_blank_line());
    document.write(HTML_write_comment_line("Application Fault Triggers","",""));
    document.write(HTML_write_comment_line_dash());    
    document.write(HTML_write_define_line_number(prefix,0,"U_DCB_TRIP",xmlObject));
    
    document.write(HTML_write_define_line_number(prefix,0,"U_DCB_UNDERVOLTAGE",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"U_DCB_OVERVOLTAGE",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"I_PH_OVERCURRENT",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"TEMP_OVER",xmlObject));

    /* DCB voltage filter */
    document.write(HTML_write_blank_line());
    document.write(HTML_write_comment_line("DC Bus voltage IIR1 filter constants","",""));
    document.write(HTML_write_comment_line_dash());
    document.write(HTML_write_comment_line("Cut-off frequency","Udc_Fcur",""));
    document.write(HTML_write_comment_line("Sample time","Udcb_filter",""));       
    document.write(HTML_write_define_line_number(prefix,0,"UDCB_IIR_B0",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"UDCB_IIR_B1",xmlObject));
    document.write(HTML_write_define_line_number(prefix,0,"UDCB_IIR_A1",xmlObject));  
    
    document.write(HTML_write_blank_line());
    document.write(HTML_write_comment_line("Mechanical alignment","",""));
    document.write(HTML_write_comment_line_dash());
    
    // Alignment control              
    document.write(HTML_write_define_line_number(prefix,0,"ALIGN_DURATION",xmlObject));
    if(testVarValue('Alignment','Voltage'))
      document.write(HTML_write_define_line_number(prefix,0,"ALIGN_VOLTAGE",xmlObject));
    else  
      document.write(HTML_write_define_line_number(prefix,0,"ALIGN_CURRENT",xmlObject));
    
    // motor parameters commented
    copyParent2HeaderCfgById('pp','pp',' [-]',true);
    copyParent2HeaderCfgById('Rs','Rs',' [Ohms]',true);
    copyParent2HeaderCfgById('Ld','Ld',' [H]',true);
    copyParent2HeaderCfgById('Lq','Lq',' [H]',true);
    copyParent2HeaderCfgById('ke','ke',' [V.sec/rad]',true);
    copyParent2HeaderCfgById('J','J',' [kg.m2]',true);
    copyParent2HeaderCfgById('Iph','I_ph',' [A]',true);
    copyParent2HeaderCfgById('N_nom','N_nom',' [rpm]',true);    
    copyParent2HeaderCfgById('Udcb_filter','CLOOP_Ts',' [sec]',true);
    copyParent2HeaderCfgById('Udc_Fcur','UDC_FCUT',' [Hz]',true);
    
    //calculate constants
    clickCalculateParam();
}

/***************************************************************************//*!
*
* @brief  The function reads values from input forms, scales them and write 
*         to output file form
* @param   
* @return 
* @remarks 
******************************************************************************/
function writeParametersHeaderOutput(str)
{
     str = write_blank_lines(str,1);     
     str = write_comment_text(str,'Motor Parameters','');
     str = write_comment_line_dash(str);
     str = write_comment_text(str,'Pole-pair number','pp');
     str = write_comment_text(str,'Stator resistance','Rs');    
     str = write_comment_text(str,'Direct axis inductance','Ld');
     str = write_comment_text(str,'Quadrature axis inductance','Lq');
     str = write_comment_text(str,'Back-EMF constant','ke');
     str = write_comment_text(str,'Drive inertia','J');
     str = write_comment_text(str,'Nominal current','Iph');
     str = write_comment_text(str,'Nominal speed','N_nom');
     
     str = write_blank_lines(str,1);     
     str = write_define_line_number(str,'MOTOR_PP');
     str = write_define_line_number(str,'MOTOR_PP_GAIN');
     str = write_define_line_number(str,'MOTOR_PP_SHIFT');     
     
   
     str = write_blank_lines(str,1);
     str = write_comment_text(str,'Application scales','');   
     str = write_comment_line_dash(str);
     str = write_define_line_number(str,'I_MAX');
     str = write_define_line_number(str,'U_DCB_MAX');
     //str = write_define_line_number(str,'U_MAX');
     str = write_define_line_number(str,'N_MAX');
     str = write_define_line_number(str,'WEL_MAX');
     //str = write_define_line_number(str,'FREQ_MAX');
     
     str = write_define_line_number(str,'N_NOM');
     str = write_define_line_number(str,'I_PH_NOM');     
     if(testActiveTab('Sensorless'))
        str = write_define_line_number(str,'E_MAX','');

     str = write_blank_lines(str,1);    
     str = write_comment_text(str,'Application Fault Triggers','');   
     str = write_comment_line_dash(str);

     str = write_define_line_number(str,'U_DCB_TRIP');
     str = write_define_line_number(str,'U_DCB_UNDERVOLTAGE');
     str = write_define_line_number(str,'U_DCB_OVERVOLTAGE');
     str = write_define_line_number(str,'I_PH_OVERCURRENT');
     str = write_define_line_number(str,'TEMP_OVER');
   //  str = write_define_line_number(str,'N_MIN');

     
     str = write_blank_lines(str,1);  
     str = write_comment_text(str,'DC Bus voltage IIR1 filter constants','');
     str = write_comment_line_dash(str);
     str = write_comment_text(str,'Cut-off frequency','Udc_Fcur');
     str = write_comment_text(str,'Sample time','CLOOP_Ts');       
     str = write_comment_line_dash(str);     
     str = write_define_line_number(str,'UDCB_IIR_B0');
     str = write_define_line_number(str,'UDCB_IIR_B1');
     str = write_define_line_number(str,'UDCB_IIR_A1');
    
     str = write_comment_text(str,'Mechanical Alignment',''); 
     str = write_define_line_number(str,'ALIGN_CURRENT');
     str = write_define_line_number(str,'ALIGN_VOLTAGE');
     str = write_define_line_number(str,'ALIGN_DURATION');
     
     return str;
}

/***************************************************************************//*!
*
* @brief  The function reads values from input forms, scales them and write 
*         to output HTML form
* @param   
* @return 
* @remarks 
******************************************************************************/
function writeFMScalesHTMLOutput(prefix,xmlObject)
{
    var prefixM   = getActiveMotor();
    var Motor_pp  = getParentHtmlValue("pp");
    var Nmax      = getParentHtmlValue("N_max");    
    var Umax      = getParentHtmlValue("U_max");    
    var Imax      = getParentHtmlValue("I_max");
    var UDCmax    = getParentHtmlValue("UDC_max");

    Wmax          = Math.round(Motor_pp*Nmax*2*Math.PI*100/60)/100;
    
    UDCunder      = getParentHtmlValue("UDC_under");
    UDCover       = getParentHtmlValue("UDC_over");
    IPHover       = getParentHtmlValue("IPH_over");
    TEMPover      = getParentHtmlValue("Temp_over");    
    
    
    var aritType  = parent.document.getElementById("Arithmetic").innerText; 
   
    // FreeMASTER Scale Variables  
    document.write(HTML_write_blank_line());
    document.write(HTML_write_comment_line("FreeMASTER Scale Variables ","",""));
    document.write(HTML_write_comment_line_dash()); 
    
    if(aritType=='Float')
    {
        document.write(HTML_write_define_line_number(prefix,0,"FM_W_EL_SCALE",xmlObject));
        document.write(HTML_write_define_line_number(prefix,0,"FM_W_MEC_SCALE",xmlObject));
        document.write(HTML_write_define_line_number(prefix,0,"FM_N_EL_SCALE",xmlObject));
        document.write(HTML_write_define_line_number(prefix,0,"FM_N_MEC_SCALE",xmlObject));
        document.write(HTML_write_define_line_number(prefix,0,"FM_TH_DEG_SCALE",xmlObject));


        document.getElementById('FM_W_EL_SCALE').innerHTML    = "(" + Math.round(1000/Motor_pp) + ")";        
        document.getElementById('FM_W_MEC_SCALE').innerHTML   = "(" + Math.round(1000) + ")"; 
        document.getElementById('FM_N_EL_SCALE').innerHTML    = "(" + Math.round(60*1000/2/Math.PI) + ")"; 
        document.getElementById('FM_N_MEC_SCALE').innerHTML   = "(" + Math.round(60*1000/Motor_pp/2/Math.PI) + ")";         
        document.getElementById('FM_TH_DEG_SCALE').innerHTML  = "(" + Math.round(180*1000/Math.PI) + ")";
    }
    else
    {
        document.write(HTML_write_define_line_number(prefix,0,"FM_I_SCALE",xmlObject));
        document.write(HTML_write_define_line_number(prefix,0,"FM_U_SCALE",xmlObject));
        document.write(HTML_write_define_line_number(prefix,0,"FM_U_DCB_SCALE",xmlObject));
        document.write(HTML_write_define_line_number(prefix,0,"FM_W_EL_SCALE",xmlObject));  
        document.write(HTML_write_define_line_number(prefix,0,"FM_N_MEC_SCALE",xmlObject));  
        document.write(HTML_write_define_line_number(prefix,0,"FM_TH_DEG_SCALE",xmlObject));  

        document.getElementById('FM_I_SCALE').innerHTML      = "(" + Math.round(Imax*1000) + ")"; 
        document.getElementById('FM_U_SCALE').innerHTML      = "(" + Math.round(Umax*1000) + ")"; 
        document.getElementById('FM_U_DCB_SCALE').innerHTML  = "(" + Math.round(UDCmax*1000) + ")"; 

        document.getElementById('FM_W_EL_SCALE').innerHTML      = "(" + Math.round(Motor_pp*Nmax*2*Math.PI*1000/60) + ")"; 
        document.getElementById('FM_N_MEC_SCALE').innerHTML     = "(" + Math.round(Nmax*1000) + ")";         
        document.getElementById('FM_TH_DEG_SCALE').innerHTML    = "(" + Math.round(180*1000) + ")";    
    }  
    
    //calculate constants
    clickCalculateParam();
}

/***************************************************************************//*!
*
* @brief  The function reads values from input forms, scales them and write 
*         to output file form
* @param   
* @return 
* @remarks 
******************************************************************************/
function writeFMScalesHeaderOutput(str)
{
     str = write_blank_lines(str,1);    
     str = write_comment_text(str,'FreeMASTER Scale Variables','','');
     str = write_comment_line_dash(str);
     str = write_comment_text(str,'Note: Scaled at input = 1000','','');    
     str = write_comment_line_dash(str);
     
    var aritType  = parent.document.getElementById("Arithmetic").innerText;     
     
    if(aritType==='Float')
    {
     str = write_define_line_number(str,'FM_W_MEC_SCALE');
     str = write_define_line_number(str,'FM_N_EL_SCALE');
     str = write_define_line_number(str,'FM_N_MEC_SCALE');
     str = write_define_line_number(str,'FM_TH_DEG_SCALE'); 
    }
    else
    {
     str = write_define_line_number(str,'FM_I_SCALE');
     str = write_define_line_number(str,'FM_U_SCALE');
     str = write_define_line_number(str,'FM_U_DCB_SCALE');
     str = write_define_line_number(str,'FM_W_EL_SCALE');
     str = write_define_line_number(str,'FM_N_MEC_SCALE');
     str = write_define_line_number(str,'FM_TH_DEG_SCALE');              
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
function updateTab_Parameters()
{
   // update constants
   initLoadFormParamValues();
}

/***************************************************************************//*!
* 
******************************************************************************
* End of code
******************************************************************************/
