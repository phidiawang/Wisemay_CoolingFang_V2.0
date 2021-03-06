/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/******************************************************************************
* List of functions
******************************************************************************
* initLoadFormCascade() - init Cascade page paramters and constants  
* clickUpdateCtrlStruc() - calculates control constants based on input parameters
* writeCascadeHTMLOutput(prefix,xmlObject) - write selected constants to output preview page 
* writeCascadeHeaderOutput(str) - write selected constants to output header file
*******************************************************************************/

/* Global variables */
var xmlDoc = loadXMLDoc("xml_files/FM_params_list.xml");   
var Timer_object;
var pospeArray  =   new Array(4); 
var MotorPrefix;
var controlMethodId;

var k_factor_max  = 175;
var k_factor_min  = 25;
/***************************************************************************//*!
* @brief   The function check XML field ti not empty and try to read FM variable
* @param    
* @return  
* @remarks 
*******************************************************************************/   
function checkXMLvar()
{
  var tempXMLVar;
  // names of XML field used in CtrlScructure
  var xmlElements = new Array ('ControlStructureMethod', 
                               'onoff',
                               'SCALAR_VHZ_FACTOR_GAIN',
                               'Freq_req',
                               'Ud_req',
                               'Uq_req',
                               'Id_req',
                               'Iq_req',
                               'Speed_req');

  var errorFMread = '';
  var errorXMLfield = '';
  
    // check defined XML fields 
   for(var j=0;j<xmlElements.length;j++){
    tempXMLVar = xmlDoc.getElementsByTagName(MotorPrefix+ xmlElements[j])[0];
  
   if(tempXMLVar.childNodes.length!=0)
   {
     if(!(pcm.ReadVariable(tempXMLVar.childNodes[0].nodeValue)))
        errorFMread = errorFMread + '\n "' + tempXMLVar.childNodes[0].nodeValue + '"';
   }     
   else // XML field empty
     errorXMLfield = errorXMLfield + '\n"' +MotorPrefix+ xmlElements[j] + '" ';
   } 

   if(errorXMLfield!='')
     alert('Error: Empty XML field: '+ errorXMLfield); 
     
   if(errorFMread!='')
     alert('Read error of FM variables: '+ errorFMread);  
   
   if((errorXMLfield!='')||(errorFMread!=''))
    return (false);
   else       
    return (true);    
}
/***************************************************************************//*!
*
* @brief   The function creates code of for output constant
* @param   
* @return  None
* @remarks 
******************************************************************************/ 


// init load
function initLoadFormCascade()
{
    var objectCCS    = document.getElementById('ControlStructureTable').offsetHeight;
        
    document.getElementById('stateControlField').style.height = (objectCCS+10) + 'px';
    document.getElementById('ccsField').style.height = (objectCCS+10) + 'px';
    
    var obj = document.getElementById('V/rpm_factor');
    obj.title = obj.title + '\n'+ 'Max_factor = ' +k_factor_max.toString() + '% \n'+ 'Min_factor = ' +k_factor_min.toString()+'%';
    
    if(document.getElementById(MotorPrefix + 'scalar_ctrl_Input2_Um'))
    document.getElementById(MotorPrefix + 'scalar_ctrl_Input2_Um').disabled = true; 
        
    MotorPrefix = getActiveMotor();

    if(!pcm.IsCommPortOpen())
    {
       //  sensorTypeSelectInit();
      //alert("Communication is stopped.\nPress Ctrl+K to start the communication");
    }
    else
    {
        //get the prefix of active motor
       // MotorPrefix = getActiveMotor();

        reference_val = xmlDoc.getElementsByTagName([MotorPrefix+ "onoff"])[0];
        reference_val_1 = reference_val.childNodes[0].nodeValue;
        pcm.SubscribeVariable(reference_val_1, 1000);

        reference_val_2 = xmlDoc.getElementsByTagName([MotorPrefix+ "states"])[0].getAttribute("FreemasterName");
        pcm.SubscribeVariable(reference_val_2, 500);
        
        reference_val = xmlDoc.getElementsByTagName([MotorPrefix+ "ControlStructureMethod"])[0];
        reference_val_3 = reference_val.childNodes[0].nodeValue;
        pcm.SubscribeVariable(reference_val_3, 1500);

        reference_val = xmlDoc.getElementsByTagName([MotorPrefix+ "ControlStructurePoSpe"])[0];
        
        // check whether the parameter Mx_ControlStructurePoSpe is filled in *.xml
        if(reference_val.childNodes.length!==0){
            reference_val_4 = reference_val.childNodes[0].nodeValue;
            pcm.SubscribeVariable(reference_val_4, 2000);
        }        
        else{
            reference_val_4 = 0;
        }

      // basic mode, disable some inputs
      // in basic mode, precalculate paramters
      if(getActiveMode()===0)
      {
         //disable U/rad control
         disableInputParamBox(MotorPrefix+'scalar_ctrl_Input2'); 
         //disable d-axis voltage control
         disableInputParamBox(MotorPrefix+'volt_ctrl_Input1');
         //disable d-axis current control
         disableInputParamBox(MotorPrefix+'current_ctrl_Input1');
      }         
      
      // check all XML variables and proper FM communication
      //checkXMLvar();
  
      sensorTypeSelectInit();
      OnOff_Input(reference_val_1);
      CascadeStruc_Input(reference_val_3);
     // updateCCStextField(controlMethodId,reference_val_5,'Input1');
      //updateCCStextField(controlMethodId,reference_val_6,'Input2');
      
      Event1_OnVariableChanged(reference_val_2);
    } 
    

    
}   

//OnVariableChanged event generated by FreeMASTER
function Event1_OnVariableChanged(IDsubscribedVariable)
{
    switch(IDsubscribedVariable){
        case reference_val_1:
            // On/Off control
            OnOff_Input(IDsubscribedVariable);
            break;
        case reference_val_2:
            // Application state update 
            StateMachine(IDsubscribedVariable); 
            //powerClickInput(IDsubscribedVariable);
            break;
        case reference_val_3:
            // Cascade control structure select
            CascadeStruc_Input(IDsubscribedVariable);
            break;
        case reference_val_4:
            // Cascade control structure select
            sensorTypeInput(IDsubscribedVariable);
            break;   
        case reference_val_5:
            // Input text field update - fisrt row
            updateCCStextField(controlMethodId,IDsubscribedVariable,'Input1');
            break;   
        case reference_val_6:
            // Input text field update - second row
            updateCCStextField(controlMethodId,IDsubscribedVariable,'Input2');
            break;              
        default:
    }
}

/***************************************************************************//*!
*
* @brief   On-Off toggle button routine
* @param   None
* @return  None
* @remarks 
******************************************************************************/ 
/* ------------------------ Read from Freemaster --------------------------- */         
function OnOff_Input(elementId){
      var object1     = document.getElementById('sw_app_onoff');
      
      if(pcm.ReadVariable(elementId)){      
      var ValueState  = pcm.LastVariable_vValue; 
        if(ValueState===1){
                            object1.className = 'appOn';}
        else{               object1.className = 'appOff';}
      }
} 
    
/* ------------------ On-Off toggle button click routine - ----------------- */      
function OnOff_Click(){
  var retMsg;
  var on_off=xmlDoc.getElementsByTagName([MotorPrefix]+"onoff");
  
  var object  = document.getElementById('sw_app_onoff');
  var object2 = document.getElementById('textApplicationState');
          
  if(object2.className !== 'appStateBox_Button')
  {
    if(pcm.ReadVariable(on_off[0].childNodes[0].nodeValue)){
  	var onoffvar = pcm.LastVariable_vValue;
  	if(onoffvar === 0){
              onoffvar = 1;
              object.className    = "appOn";}
          else{
              onoffvar = 0;
              object.className    = "appOff"; }
      }
   }
		
    succ = pcm.WriteVariable(on_off[0].childNodes[0].nodeValue, onoffvar, retMsg);
}  

/***************************************************************************//*!
* @brief   update the text input fields in control page based on the Freemaster values
* @param   None
* @return  None
* @remarks 
******************************************************************************/ 
function updateCCStextField(methodId, elementId, inputNo){
    textControlType = conversionNo2Ctrl(methodId);
      var Motor_pp      = getParentHtmlValue("pp");
      
     // alert(methodId);
    if(pcm.ReadVariable(elementId)){
        
        switch (methodId){
        case 0:
            if(inputNo==='Input1')
                document.getElementById(MotorPrefix + 'scalar_ctrl_Input1').value = (pcm.LastVariable_vValue*60/2/Math.PI/Motor_pp).toFixed(2);            
            break;
        case 1:
            if(inputNo==='Input1')
                document.getElementById(MotorPrefix + 'volt_ctrl_Input1').value = pcm.LastVariable_vValue.toFixed(1); 
            else
                document.getElementById(MotorPrefix + 'volt_ctrl_Input2').value = pcm.LastVariable_vValue.toFixed(1); 
            break;
        case 2:
            if(inputNo==='Input1')
                document.getElementById(MotorPrefix + 'current_ctrl_Input1').value = pcm.LastVariable_vValue.toFixed(1);            
            else
                document.getElementById(MotorPrefix + 'current_ctrl_Input2').value = pcm.LastVariable_vValue.toFixed(1);            
            break;
        case 3:
            if(inputNo==='Input1')
                document.getElementById(MotorPrefix + 'speed_ctrl_Input1').value = pcm.LastVariable_vValue.toFixed(0);            
            break;
            
        }
    }
}

/***************************************************************************//*!
* @brief   Control Structure select -  button click/update routine
* @param   None
* @return  None
* @remarks 
******************************************************************************/ 
function CascadeStruc_Input(elementId){
  var textControlType;

  for(var i=0;i<4;i++){
    // switch-off all switches EN/DIS in the Application Control Structure page
    CascadeMethods(i,'Disable');
    
    // disable all input text fields in the Application Control Structure page by default
    // and set all fields to zero
    textControlType = conversionNo2Ctrl(i);                     
    document.getElementById(MotorPrefix + textControlType +'_Input1').disabled = true;
    document.getElementById(MotorPrefix + textControlType +'_Input1').value = 0;
    
    if(document.getElementById(MotorPrefix + textControlType +'_Input2')){
        document.getElementById(MotorPrefix + textControlType +'_Input2').disabled = true; 
        
    if(textControlType==='scalar_ctrl'){
        var k_factor = Number(parent.document.getElementById(MotorPrefix+'SCALAR_Factor').innerText);
       
        document.getElementById(MotorPrefix + textControlType +'_Input2').value = k_factor;
        
        document.getElementById(MotorPrefix+'ScalarUp').disabled = false;                                            
        document.getElementById(MotorPrefix+'ScalarDown').disabled = false;            
        document.getElementById(MotorPrefix+'ScalarUp').className = 'UpDownButton_en';
        document.getElementById(MotorPrefix+'ScalarDown').className = 'UpDownButton_en'; 
        }
    else
        document.getElementById(MotorPrefix + textControlType +'_Input2').value = 0;
    
        document.getElementById(MotorPrefix+'ScalarUp').disabled = true;
        document.getElementById(MotorPrefix+'ScalarDown').disabled = true;            
        document.getElementById(MotorPrefix+'ScalarUp').className = 'UpDownButton_dis';
        document.getElementById(MotorPrefix+'ScalarDown').className = 'UpDownButton_dis';     
    }   
  }     

  //Enable Position/Speed button by default
    CascadeMethods(4,'Enable');
    
    if(pcm.ReadVariable(elementId)){
        // get control method ID raw value from freemaster
       controlMethodId = pcm.LastVariable_vValue;
   
        //Enable selected Control Method button
       CascadeMethods(controlMethodId,'Enable');
       
       // enable appropriate input text field according to selected control method
       textControlType = conversionNo2Ctrl(controlMethodId);                     
       document.getElementById(MotorPrefix + textControlType +'_Input1').disabled = false;    
       
       if(document.getElementById(MotorPrefix + textControlType +'_Input2'))
       document.getElementById(MotorPrefix + textControlType +'_Input2').disabled = false;          
       
       switch(controlMethodId)
        {
        case 0: 
            //Disable Position/Speed button in Scalar Mode
            CascadeMethods(4,'Disable');

            reference_val = xmlDoc.getElementsByTagName([MotorPrefix+ "Freq_req"])[0];
            reference_val_5 = reference_val.childNodes[0].nodeValue;
            pcm.SubscribeVariable(reference_val_5, 1500);

            reference_val = xmlDoc.getElementsByTagName([MotorPrefix+ "SCALAR_VHZ_FACTOR_GAIN"])[0];
            reference_val_6 = reference_val.childNodes[0].nodeValue;
            pcm.SubscribeVariable(reference_val_6, 1500);    

            document.getElementById(MotorPrefix+'ScalarUp').disabled = false;                                            
            document.getElementById(MotorPrefix+'ScalarDown').disabled = false;            
            document.getElementById(MotorPrefix+'ScalarUp').className = 'UpDownButton_en';
            document.getElementById(MotorPrefix+'ScalarDown').className = 'UpDownButton_en'; 
        break;

        case 1: 
           reference_val = xmlDoc.getElementsByTagName([MotorPrefix+ "Ud_req"])[0];
           reference_val_5 = reference_val.childNodes[0].nodeValue;
           pcm.SubscribeVariable(reference_val_5, 1500);
            
           reference_val = xmlDoc.getElementsByTagName([MotorPrefix+ "Uq_req"])[0];
           reference_val_6 = reference_val.childNodes[0].nodeValue;
           pcm.SubscribeVariable(reference_val_6, 1500);    
        break;

        case 2: 
           reference_val = xmlDoc.getElementsByTagName([MotorPrefix+ "Id_req"])[0];
           reference_val_5 = reference_val.childNodes[0].nodeValue;
           pcm.SubscribeVariable(reference_val_5, 1500);
            
           reference_val = xmlDoc.getElementsByTagName([MotorPrefix+ "Iq_req"])[0];
           reference_val_6 = reference_val.childNodes[0].nodeValue;
           pcm.SubscribeVariable(reference_val_6, 1500);    
        break;

        case 3: 
           reference_val = xmlDoc.getElementsByTagName([MotorPrefix+ "Speed_req"])[0];
           reference_val_5 = reference_val.childNodes[0].nodeValue;
           pcm.SubscribeVariable(reference_val_5, 1500);
           
           
           // Unsubscribe all second text fields for non-speed control 
           reference_val = xmlDoc.getElementsByTagName([MotorPrefix+ "SCALAR_VHZ_FACTOR_GAIN"])[0].childNodes[0].nodeValue;
           pcm.UnSubscribeVariable(reference_val); 
           reference_val = xmlDoc.getElementsByTagName([MotorPrefix+ "Uq_req"])[0].childNodes[0].nodeValue;
           pcm.UnSubscribeVariable(reference_val); 
           reference_val = xmlDoc.getElementsByTagName([MotorPrefix+ "Iq_req"])[0].childNodes[0].nodeValue;
           pcm.UnSubscribeVariable(reference_val);   
        break;

      default:
      }
   
    }
}

function CascadeMethods(methodId, endisStatus){
     var object = new Array(5); 
     
    object[0] = document.getElementById([MotorPrefix]+'scalar_ctrl');
    object[1] = document.getElementById([MotorPrefix]+'volt_ctrl');
    object[2] = document.getElementById([MotorPrefix]+'current_ctrl');      
    object[3] = document.getElementById([MotorPrefix]+'speed_ctrl');
    object[4] = document.getElementById([MotorPrefix]+'pospe_ctrl'); 
    
    // Enable/disable the En/Dis button in the CCS workspace
    if(endisStatus==='Enable'){
        object[methodId].className    = "switch_on";
        object[methodId].style.color  = "white";
        object[methodId].innerHTML    = "ENABLED";         
    }
    else{
        object[methodId].className    = "switch_off";
        object[methodId].style.color  = "gray";
        object[methodId].innerHTML    = "DISABLED";         
    }
    
    // Enable/disable the sensor type selector based on the control method
    if(object[4].innerHTML !== "ENABLED")  
            document.getElementById(MotorPrefix+'pospe_ctrl_Select').disabled = true;
    else    document.getElementById(MotorPrefix+'pospe_ctrl_Select').disabled = false;
            
}

/***************************************************************************//*!
*
* @brief   Sensor type selector init routine - according to parent doc. table
* @param   
* @return  None
* @remarks 
******************************************************************************/     
function sensorTypeSelectInit(){
 var optionObject;
 var selectedSensor;
 var j = 0;
  
 for(var i=0;i<5;i++){ pospeArray[i] = i;}
   // read from main page table
   selectedSensor =  parent.document.getElementById(MotorPrefix+'PospeFbck').innerHTML;
   // read object by ID from CtrlStructurePage
   optionObject = document.getElementById(MotorPrefix + "pospe_ctrl_Select");
 
   for(var i=0;i<5;i++)
   {
     pospeArray[i] = j;
     if (((selectedSensor>>>[i])&1) !== 1){
         optionObject.remove(j);}
     else{
         j++;}
   }
}
 
 function sensorTypeInput(elementId){
     if(pcm.ReadVariable(elementId)){
       document.getElementById(MotorPrefix +'pospe_ctrl_Select').selectedIndex = pcm.LastVariable_vValue;
     }
 }
/***************************************************************************//*!
* @brief   The function converts the Number to String form, according to selected control method
* @param   inPointer - number representating the selected ctrl method 
* @return  string of selected control method
* @remarks 
*******************************************************************************/   
function conversionNo2Ctrl(inPointer)
{
    var arithmeticArray=new Array(4);
    arithmeticArray[0] = "scalar_ctrl";
    arithmeticArray[1] = "volt_ctrl";
    arithmeticArray[2] = "current_ctrl";
    arithmeticArray[3] = "speed_ctrl";    

    return arithmeticArray[inPointer];     
} 

/***************************************************************************//*!
* @brief   The function converts the Number to String form, according to selected reference signals
* @param   inPointer - number representating the selected ctrl method 
* @return  string of selected reference signals
* @remarks 
*******************************************************************************/
function conversionXml2Variables(inPointer)
{
    var referencesArray=new Array(8);
    referencesArray[0] = "SCALAR_VHZ_FACTOR_GAIN";
    referencesArray[1] = "Freq_req";
    referencesArray[2] = "Ud_req";
    referencesArray[3] = "Uq_req";    
    referencesArray[4] = "Id_req";
    referencesArray[5] = "Iq_req";    
    referencesArray[6] = "Speed_req";
    
    return referencesArray[inPointer];     
}

/***************************************************************************//*!
*
* @brief   Change of the cascade control structure method - according to click
* @param   selectedIndex - index of selected method
* @return  None
* @remarks 
******************************************************************************/ 
function sensorTypeChange(selectedIndex)
{
    var retMsg;                                                                               
    var prefixM = getActiveMotor();  
    var PospeRegisterVal = xmlDoc.getElementsByTagName([prefixM]+"ControlStructurePoSpe")[0];

    if(PospeRegisterVal.childNodes.length!==0)
        succ = pcm.WriteVariable(PospeRegisterVal.childNodes[0].nodeValue, Number(selectedIndex), retMsg);  
    else
        alert('This option is not supported because Position and Speed s/w switch not defined in xml file.');
}

/***************************************************************************//*!
*
* @brief   Change of the Id control method - according to selector
* @param   optionNo - number of selected method
* @return  None
* @remarks 
******************************************************************************/ 
function IdMethodChange(optionNo)
{
    var retMsg;
    var prefixM = getActiveMotor();  
    var CtrlRegisterVal = xmlDoc.getElementsByTagName([prefixM]+"ControlStructureMethod")[0];
    
    succ = pcm.WriteVariable(CtrlRegisterVal.childNodes[0].nodeValue, Number(optionNo)+3, retMsg);
}

/***************************************************************************//*!
*
* @brief   Cascade control structure selector
* @param   varID - ID of selected control structure
* @return  None
* @remarks 
******************************************************************************/ 
function Ctrl_Structure_click(varID){
    var retMsg;
    var ctrlRegister  = null;
   
    var Nmax          = getParentHtmlValue("N_max");
    var UDCmax        = getParentHtmlValue("UDC_max");
   // var UmaxCoeff     = getParentHtmlValue("UmaxCoeff");
    var Umax          = getParentHtmlValue("U_max");
    var Uphnom        = getParentHtmlValue("U_ph");
    var N_nom         = getParentHtmlValue("N_nom");
    var Motor_pp      = getParentHtmlValue("pp");
//    var Umax          = Math.round(UDCmax/UmaxCoeff*10)/10;
    
    var aritType      = parent.document.getElementById("Arithmetic").innerText;
                                        
    var CtrlRegisterVal  = xmlDoc.getElementsByTagName([MotorPrefix]+"ControlStructureMethod")[0];
    var on_off           = xmlDoc.getElementsByTagName([MotorPrefix]+"onoff")[0];

    // read the state of ON/OFF switch    
    if(pcm.ReadVariable(on_off.childNodes[0].nodeValue));
    {
        var onoffvar = pcm.LastVariable_vValue;
      
        // If ON state, the change of the control structure is not allowed
	if(onoffvar === 1)
        {
            alert("The control structure cannot be changed during the RUN state!"+ '\n' + "Switch off the application.");        
        }
        else // If OFF state is active, the change of the control structure is allowed
        {
            
            if(pcm.ReadVariable(CtrlRegisterVal.childNodes[0].nodeValue)){
                // read currently active control mode
                var CCSmethodVal = pcm.LastVariable_vValue;
                
                // Disable the current active mode - button
                CascadeMethods(CCSmethodVal, 'Disable');

                //Disable Pos/Speed signal button
                CascadeMethods(4, 'Disable');

                // Disable the current active mode - input fields disabled
                textControlType = conversionNo2Ctrl(CCSmethodVal);                     
                document.getElementById(MotorPrefix + textControlType +'_Input1').disabled = true;    

                if(document.getElementById(MotorPrefix + textControlType +'_Input2'))
                document.getElementById(MotorPrefix + textControlType +'_Input2').disabled = true;    
            }
            
           
            // based on the control mode selection generate ctrlRegister value - send to FRM   
            if (varID === MotorPrefix+'scalar_ctrl')    
            {
                ctrlRegister = 0;
                
                k_factor          = Number(parent.document.getElementById(MotorPrefix+'SCALAR_Factor').innerHTML);
                
              // alert(k_factor);
                if(getActiveMode()===0)            
                {
                    // basic mode
                    k_factor = 100;

                    //fix implementation         
                    k_rate_sc         = Uphnom*Nmax*k_factor/(Umax*N_nom);
                    if(k_rate_sc >1)
                        k_rate_shift    = Math.ceil(Math.log(Math.abs(k_rate_sc))/Math.log(2));
                    else
                        k_rate_shift    = 0

                    k_rate_frac       = k_rate_sc*Math.pow(2,-k_rate_shift);

                    //float implementation
                    k_rate_gain    = Uphnom*k_factor/(N_nom*Motor_pp*2*Math.PI/60); 

                    if(aritType==='Float')
                    {
                        document.getElementById(MotorPrefix+'scalar_ctrl_Input2').value = Math.round(k_rate_gain*1000)/1000;
                    }
                    else
                    {
                        document.getElementById(MotorPrefix+'scalar_ctrl_Input2').value = Math.round(k_rate_sc*100)/100;
                    }                                         
                }
                else
                { 
                    document.getElementById(MotorPrefix+'scalar_ctrl_Input2').value = parent.document.getElementById(MotorPrefix+'SCALAR_Factor').innerHTML;
                    
                }    

                //document.getElementById(MotorPrefix+'scalar_ctrl_Input1').value = 0;
                document.getElementById(MotorPrefix+'ScalarUp').disabled = false;                                            
                document.getElementById(MotorPrefix+'ScalarDown').disabled = false;
                
                document.getElementById(MotorPrefix+'ScalarUp').className = 'UpDownButton_en';
                document.getElementById(MotorPrefix+'ScalarDown').className = 'UpDownButton_en';                
            }                              

            if (varID === MotorPrefix+'volt_ctrl')      
            {
                ctrlRegister = 1;
                document.getElementById(MotorPrefix+'volt_ctrl_Input1').value = 0;
                document.getElementById(MotorPrefix+'volt_ctrl_Input2').value = 0;
                document.getElementById(MotorPrefix+'ScalarUp').disabled = true;                                            
                document.getElementById(MotorPrefix+'ScalarDown').disabled = true;
                document.getElementById(MotorPrefix+'ScalarUp').className = 'UpDownButton_dis';
                document.getElementById(MotorPrefix+'ScalarDown').className = 'UpDownButton_dis';
            }                              

            if (varID === MotorPrefix+'current_ctrl')   
            {
                ctrlRegister = 2;
                document.getElementById(MotorPrefix+'current_ctrl_Input1').value = 0;
                document.getElementById(MotorPrefix+'current_ctrl_Input2').value = 0;
                document.getElementById(MotorPrefix+'ScalarUp').disabled = true;                                            
                document.getElementById(MotorPrefix+'ScalarDown').disabled = true;
                
                document.getElementById(MotorPrefix+'ScalarUp').className = 'UpDownButton_dis';
                document.getElementById(MotorPrefix+'ScalarDown').className = 'UpDownButton_dis';              
            }

            if (varID === MotorPrefix+'speed_ctrl')     
            {
                ctrlRegister = 3;
                document.getElementById(MotorPrefix+'ScalarUp').disabled = true;                                            
                document.getElementById(MotorPrefix+'ScalarDown').disabled = true;
                
                document.getElementById(MotorPrefix+'ScalarUp').className = 'UpDownButton_dis';
                document.getElementById(MotorPrefix+'ScalarDown').className = 'UpDownButton_dis';             
            }    

            // write to FRM   
            CascadeMethods(ctrlRegister, 'Enable');
            if(ctrlRegister!==0) CascadeMethods(4, 'Enable');
            
            textControlType = conversionNo2Ctrl(ctrlRegister);                     
            document.getElementById(MotorPrefix + textControlType +'_Input1').disabled = false;    
            if(document.getElementById(MotorPrefix + textControlType +'_Input2'))
            document.getElementById(MotorPrefix + textControlType +'_Input2').disabled = false; 
        


            
            succ = pcm.WriteVariable(CtrlRegisterVal.childNodes[0].nodeValue, ctrlRegister, retMsg);
       }
    }
}

   

/***************************************************************************//*!
*
* @brief   State machine engine
* @param   None
* @return  None
* @remarks 
******************************************************************************/ 
function StateMachine(elementId){
      if(pcm.ReadVariable(elementId))
      {
        var states      = xmlDoc.getElementsByTagName(MotorPrefix+"state"); 
        var ValueState  = pcm.LastVariable_vValue;
        var x           = document.getElementById('textApplicationState');
        
        x.value =  states[ValueState].childNodes[0].nodeValue;  

        if(x.value === 'FAULT' || x.value === 'Fault') // If Fault state
        {  
          var object = document.getElementById('textApplicationState');
          var object2 = document.getElementById('appStateLabel');
          
          
          object.className = 'appStateBox_Button';
          object.disabled  = false;
          
          object2.className = 'appStateLabel_red';
          object2.innerHTML = 'Clear FAULT';
        }      
        else
        {
          var object = document.getElementById('textApplicationState');
          var object2 = document.getElementById('appStateLabel');
          
          object.className = 'appStateBox';
          object.disabled  = true;
          
          object2.className = 'appStateLabel';
          object2.innerHTML = 'Application State';
        }    
      }
}

function ClearFault(){
    var retMsg;
    //var prefixM   = getActiveMotor();
    
    var fltClr = xmlDoc.getElementsByTagName([MotorPrefix]+"FltClr")[0];
    
    if(pcm.ReadVariable(fltClr.childNodes[0].nodeValue))
    {
     succ = pcm.WriteVariable(fltClr.childNodes[0].nodeValue, 1, retMsg);   
    }
      
    }
     
/***************************************************************************//*!
*
* @brief   chose the image according to selected method
* @param   None
* @return  None
* @remarks               document.getElementById('scalar_ctrl_Input1').value
******************************************************************************/ 
function clickCntStrImage(varID){

    switch(varID)
    {
      case (MotorPrefix+"scalar_ctrl"): 
        setImageDimensions('images/SCcontrol.png',550,280);
        
      break;
      
      case (MotorPrefix+"volt_ctrl"): 
        setImageDimensions('images/Vcontrol.png',380,280);
      break;
      
      case (MotorPrefix+"current_ctrl"): 
        setImageDimensions('images/Ccontrol.png',510,330);
      break;
      
      case (MotorPrefix+"speed_ctrl"): 
        setImageDimensions('images/Wcontrol.png',650,320);
      break;
        
    default:
    }
}  

/***************************************************************************//*!
*
* @brief   Sets the size of iframe window according to displayed image
* @param   None
* @return  None
* @remarks 
******************************************************************************/ 
function setImageDimensions(imPath, inW, inH){
      var object  = document.getElementById('cntrStrucFrameImage');
      var object2 = document.getElementById('cntrStrucFrameButton');
      
      var buttonUP   = document.getElementById(MotorPrefix+'ScalarUp');                                            
      var buttonDOWN = document.getElementById(MotorPrefix+'ScalarDown');      
      
      object.src            = imPath;
      
      object.style.width    = inW.toString()+"px";
      object.style.height   = inH.toString()+"px";   
    
      object.style.top      = "35px";
      object.style.left     = ((700-inW)/2).toString()+"px";
      
      object2.style.width   = "120px";
      object2.style.height  = "25px";  
            
      object2.style.top     = (38 + inH - 30).toString()+"px";
      object2.style.left    = ((700-120)/2).toString()+"px";
      
    object.style.display = "block";
    object2.style.display = "block";
    
    buttonUP.style.visibility = "hidden";
    buttonDOWN.style.visibility = "hidden";    

    object2.src = 'form_buttonCloseWindow.html';      
}   

/***************************************************************************//*!
*
* @brief   Onclick button event - Update FRM values
* @param   None
* @return  None
* @remarks 
******************************************************************************/
function clickUpdateCtrlStruc(){
    var retMsg;
    var writeFRM  = new Array();
    var writeFRMoffset = 0;
    
    MotorPrefix = getActiveMotor();
    var MethodCtrlVal = xmlDoc.getElementsByTagName([MotorPrefix]+"ControlStructureMethod")[0];
     
    
    if(pcm.ReadVariable(MethodCtrlVal.childNodes[0].nodeValue))
      {
        var in_MethodCtrlVal = pcm.LastVariable_vValue;

        if (in_MethodCtrlVal === 0)
        {
            var Nmax          = getParentHtmlValue("N_max");
            var UDCmax        = getParentHtmlValue("UDC_max");
           // var UmaxCoeff     = getParentHtmlValue("UmaxCoeff");
            var Umax          = getParentHtmlValue("U_max");
            var Uphnom        = getParentHtmlValue("U_ph");
            var N_nom         = getParentHtmlValue("N_nom");
            var Motor_pp      = getParentHtmlValue("pp");
            //var Umax          = Math.round(UDCmax/UmaxCoeff*10)/10;
            var Wmax          = 2*Math.PI*Motor_pp*Nmax/60;
            
            
            
            var aritType      = parent.document.getElementById("Arithmetic").innerText;
            //get the prefix of active motor

            // read actual value manualy set
            var k_factor          = (document.getElementById(MotorPrefix+'scalar_ctrl_Input2').value); 
           
            if(k_factor>k_factor_max){
                
                k_factor=k_factor_max;
                document.getElementById(MotorPrefix+'scalar_ctrl_Input2').value = k_factor_max;
            }
            if(k_factor<k_factor_min){
                
                k_factor=k_factor_min;
                document.getElementById(MotorPrefix+'scalar_ctrl_Input2').value = k_factor_min;
            }            
                
            parent.document.getElementById(MotorPrefix+'SCALAR_Factor').innerHTML = k_factor;

            
            if(getActiveMode()===0)            
            {
                // basic mode
                k_factor = 75;
            }
            
            //Float value
            k_rate_gain    = Uphnom*k_factor/100/(N_nom*Motor_pp*2*Math.PI/60); 
          //  alert(k_rate_gain);
            // Scaled value
            k_rate_sc      = k_rate_gain*Wmax/Umax;
            
            //Shift factor
            if(k_rate_sc >1)
                k_rate_shift    = Math.ceil(Math.log(Math.abs(k_rate_sc))/Math.log(2));
            else
                k_rate_shift    = 0;
            
            // Resulting fractional value
            k_rate_frac       = k_rate_sc*Math.pow(2,-k_rate_shift);
                   
            if(aritType==='Float')
            {
                writeFRM[0] = k_rate_gain;
                document.getElementById(MotorPrefix+'scalar_ctrl_Input2').value = k_factor;
                var MCATspeedReq = document.getElementById(MotorPrefix+'scalar_ctrl_Input1').value;
                MCATspeedReq = MCATspeedReq*2*Math.PI*Motor_pp/60;
                var MCATvoltReq = MCATspeedReq*k_rate_gain;;                
                document.getElementById(MotorPrefix+'scalar_ctrl_Input2_Um').value = MCATvoltReq.toFixed(3);
            }
            else
            {
                writeFRM[0] = k_rate_frac;
                writeFRM[1] = k_rate_shift;
                var MCATspeedReq = document.getElementById(MotorPrefix+'scalar_ctrl_Input1').value;
                MCATspeedReq = MCATspeedReq*2*Math.PI*Motor_pp/60/Wmax;
                var MCATvoltReq = Umax*MCATspeedReq*k_rate_frac*Math.pow(2,k_rate_shift);
                document.getElementById(MotorPrefix+'scalar_ctrl_Input2_Um').value = MCATvoltReq.toFixed(3);
            }                          
            
            // Required speed has to be transformed from mechanical rpm to electrical rad format
            writeFRM[2] = Number((document.getElementById(MotorPrefix+'scalar_ctrl_Input1').value))*2*Math.PI*Motor_pp/60;
            
            var writeFRMregisterVal0 = xmlDoc.getElementsByTagName([MotorPrefix]+"SCALAR_VHZ_FACTOR_GAIN");
            var writeFRMregisterVal1 = xmlDoc.getElementsByTagName([MotorPrefix]+"SCALAR_VHZ_FACTOR_SHIFT");
            var writeFRMregisterVal2 = xmlDoc.getElementsByTagName([MotorPrefix]+"Freq_req"); 

        }
        else
         document.getElementById(MotorPrefix+'scalar_ctrl_Input2_Um').value = 0;
        
        if (in_MethodCtrlVal === 1){
             writeFRM[0] = document.getElementById(MotorPrefix+'volt_ctrl_Input1').value;
             writeFRM[1] = document.getElementById(MotorPrefix+'volt_ctrl_Input2').value;
             
             var writeFRMregisterVal0 = xmlDoc.getElementsByTagName([MotorPrefix]+"Ud_req");
             var writeFRMregisterVal1 = xmlDoc.getElementsByTagName([MotorPrefix]+"Uq_req");
        }
        
        if (in_MethodCtrlVal === 2){
             writeFRM[0] = document.getElementById(MotorPrefix+'current_ctrl_Input1').value;
             writeFRM[1] = document.getElementById(MotorPrefix+'current_ctrl_Input2').value;
             
             var writeFRMregisterVal0 = xmlDoc.getElementsByTagName([MotorPrefix]+"Id_req");
             var writeFRMregisterVal1 = xmlDoc.getElementsByTagName([MotorPrefix]+"Iq_req");    
        }
        
        if (in_MethodCtrlVal === 3){
             writeFRM[0] = document.getElementById(MotorPrefix+'speed_ctrl_Input1').value;
             var writeFRMregisterVal0 = xmlDoc.getElementsByTagName([MotorPrefix]+"Speed_req");
        }
        
        if (in_MethodCtrlVal > 3){
             writeFRM[0] = document.getElementById(MotorPrefix+'speed_ctrl_Input1').value;
             var writeFRMregisterVal0 = xmlDoc.getElementsByTagName([MotorPrefix]+"Speed_req");
        }
        
        if (in_MethodCtrlVal<3)
        {
            succ = pcm.WriteVariable(writeFRMregisterVal0[0].childNodes[0].nodeValue, Number(writeFRM[0]), retMsg); 
            if(aritType!=='Float')
                succ = pcm.WriteVariable(writeFRMregisterVal1[0].childNodes[0].nodeValue, Number(writeFRM[1]), retMsg);
            if(in_MethodCtrlVal=== 0)
            {   
                succ = pcm.WriteVariable(writeFRMregisterVal2[0].childNodes[0].nodeValue, Number(writeFRM[2]), retMsg);
            }
        }
        else
             succ = pcm.WriteVariable(writeFRMregisterVal0[0].childNodes[0].nodeValue, Number(writeFRM[0]), retMsg);
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
function writeCascadeHTMLOutput(prefix,xmlObject)
{ 
  var Nmax          = getParentHtmlValue("N_max");
  var UDCmax        = getParentHtmlValue("UDC_max");
 // var UmaxCoeff     = getParentHtmlValue("UmaxCoeff");    
  var Umax          = getParentHtmlValue("U_max");    
  var Uphnom        = getParentHtmlValue("U_ph");
  var N_nom         = getParentHtmlValue("N_nom");
  var Motor_pp      = getParentHtmlValue("pp");
  var CLOOP_Ts      = getParentHtmlValue("CLOOP_Ts");
   var RAMP_Up       = getParentHtmlValue("RAMP_UP");
  var RAMP_Down     = getParentHtmlValue("RAMP_DOWN");
  var PP            = getParentHtmlValue("pp");
  var Wmax          = 2*Math.PI*PP*Nmax/60;  // el. value
  //var Umax          = Math.round(UDCmax/UmaxCoeff*10)/10;
  
  var k_factor_max  = 2;
  
  MotorPrefix = getActiveMotor();
  
  // Control Structure module - scalar control part
  document.write(HTML_write_blank_line());     
  document.write(HTML_write_comment_line("Control Structure Module - Scalar Control","",""));
  document.write(HTML_write_comment_line_dash()); 

  k_factor          = (parent.document.getElementById(MotorPrefix+'SCALAR_Factor').innerHTML);   
 /* //fix implementation         
  k_rate_sc         = Uphnom*Nmax*k_factor/(Umax*N_nom);
                  
  if(k_rate_sc ===1)  k_rate_sc = k_rate_sc + 0.0000001;
    
  k_rate_shift      = Math.ceil(Math.log(Math.abs(k_rate_sc))/Math.log(2));
  k_rate_frac       = Math.round(k_rate_sc*Math.pow(2,-k_rate_shift)*1000000000000)/1000000000000;*/
  
  //float implementation
  //k_rate_gain       = Motor_pp*Uphnom*k_factor/(N_nom);   
  //k_rate_gain   = Uphnom*k_factor/100/(N_nom*Motor_pp*2*Math.PI/60); 
  k_rate_gain   = 60*Uphnom*(k_factor/100)/(N_nom*Motor_pp*2*Math.PI); 
  k_rate_sc     = k_rate_gain*Wmax/Umax;
                  
 // if(k_rate_sc ===1)  k_rate_sc = k_rate_sc + 0.0000001;
    
  //k_rate_shift      = Math.ceil(Math.log(Math.abs(k_rate_sc))/Math.log(2));
  //k_rate_frac       = Math.round(k_rate_sc*Math.pow(2,-k_rate_shift)*1000000000000)/1000000000000;
  
  k_rate_frac     = getScale(k_rate_sc);
  k_rate_shift    = getScaleShift(k_rate_sc); 
  
  
   // alert(k_rate_gain +'\n'+k_rate_shift + '\n'+k_rate_frac + '\n' +k_factor);
  
  /* intergration constant for scalar position calculation */
  Kint = 2*Math.PI*Motor_pp*Nmax/60*CLOOP_Ts/2/Math.PI; 
  if (Kint>=(1-1/Math.pow(2,31)))     Kint_sc = Math.ceil(Math.log(Math.abs(Kint))/Math.log(2));
  else                                Kint_sc = 0;
  
    Int_Nsh  = Kint_sc;
    Int_C1   = Math.round(Kint/Math.pow(2,Kint_sc)*1000000000000)/1000000000000;
    testFracValRange("Int_C1",Int_C1);
   
  // scalar speed ramp Up/Down increments - calculated from Speed Ramp [rpm/sec] to [rad/sec]
  SCrampUp_Flt      = Math.round(RAMP_Up*2*Math.PI*PP/60*CLOOP_Ts*100000)/100000;
  SCrampDown_Flt    = Math.round(RAMP_Down*2*Math.PI*PP/60*CLOOP_Ts*100000)/100000;
  
  SCrampUp_Int      =  Math.round(SCrampUp_Flt/Wmax*100000)/100000;
  SCrampDown_Int    =  Math.round(SCrampDown_Flt/Wmax*100000)/100000;

  testFracValRange("SCrampUp_Int",SCrampUp_Int,1);
  testFracValRange("SCrampDown_Int",SCrampDown_Int,1);   
           
  document.write(HTML_write_define_line_number(prefix,0,"SCALAR_VHZ_FACTOR_GAIN",xmlObject));
  document.write(HTML_write_define_line_number(prefix,1,"SCALAR_VHZ_FACTOR_SHIFT",xmlObject));    
  setInnerHtmlValueAsText("SCALAR_VHZ_FACTOR_GAIN",0,k_rate_frac,k_rate_gain);
  setInnerHtmlValueAsText("SCALAR_VHZ_FACTOR_SHIFT",1,k_rate_shift,'N/A');  
  
  document.write(HTML_write_define_line_number(prefix,0,"SCALAR_INTEG_GAIN",xmlObject));
  document.write(HTML_write_define_line_number(prefix,0,"SCALAR_INTEG_SHIFT",xmlObject));
  setInnerHtmlValueAsText("SCALAR_INTEG_GAIN",3,Int_C1,Int_C1);
  setInnerHtmlValueAsText("SCALAR_INTEG_SHIFT",2,Int_Nsh);   
  
  /* scalar ramp increments */
  document.write(HTML_write_define_line_number(prefix,0,"SCALAR_RAMP_UP",xmlObject));
  document.write(HTML_write_define_line_number(prefix,0,"SCALAR_RAMP_DOWN",xmlObject));
  setInnerHtmlValueAsText("SCALAR_RAMP_UP",0,SCrampUp_Int,SCrampUp_Flt);
  setInnerHtmlValueAsText("SCALAR_RAMP_DOWN",0,SCrampDown_Int,SCrampDown_Flt);
}

/***************************************************************************//*!
* @brief  The function reads values from input forms, scales them and write 
*         to output file form
* @param   
* @return 
* @remarks 
******************************************************************************/
function writeCascadeHeaderOutput(str)
{
   str = write_blank_lines(str,1);     
   str = write_comment_text(str,'Control Structure Module - Scalar Control','');
   str = write_comment_line_dash(str);
 
   var aritType     = parent.document.getElementById("Arithmetic").innerText;
   
   // Cascade module
   str = write_define_line_number(str,'SCALAR_VHZ_FACTOR_GAIN');
   str = write_define_line_number(str,'SCALAR_VHZ_FACTOR_SHIFT');
   str = write_define_line_number(str,'SCALAR_INTEG_GAIN');
   str = write_define_line_number(str,'SCALAR_INTEG_SHIFT');
   
   str = write_define_line_number(str,'SCALAR_RAMP_UP');
   str = write_define_line_number(str,'SCALAR_RAMP_DOWN');
        
   return str;
}

/***************************************************************************//*!
* @brief  The function reads values from input forms, scales them and write 
*         to output file form
* @param   
* @return 
* @remarks 
******************************************************************************/
function clickScalarUpDown(varID)
{
    var IncDec        = 1;
    var k_factor      = Number(document.getElementById(MotorPrefix+'scalar_ctrl_Input2').value);//Number(parent.document.getElementById(prefixM+'SCALAR_Factor').innerHTML);
                
    // Up/Down buttons enabled only in expert mode
    if(getActiveMode()!==0)            
    {
        switch(varID)
        {
         case MotorPrefix+"ScalarUp":
          if (k_factor<k_factor_max) {
            k_factor =  k_factor + IncDec;
            parent.document.getElementById(MotorPrefix+'SCALAR_Factor').innerHTML = k_factor;
            document.getElementById(MotorPrefix+'scalar_ctrl_Input2').value = k_factor;

           }
          break;       
         case MotorPrefix+"ScalarDown":
         if(k_factor>k_factor_min){
            k_factor =  k_factor - IncDec;
            parent.document.getElementById(MotorPrefix+'SCALAR_Factor').innerHTML = k_factor;
            document.getElementById(MotorPrefix+'scalar_ctrl_Input2').value = k_factor;
            }
          break;  
         default: 
        }
    
       clickUpdateCtrlStruc();
    }
}

/***************************************************************************//*!
* 
******************************************************************************
* End of code
******************************************************************************/
