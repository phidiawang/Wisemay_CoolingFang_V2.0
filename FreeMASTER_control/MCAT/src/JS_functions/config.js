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
* @file   config.js
*
* @brief  MCAT tool main configuration file
*
******************************************************************************/

/******************************************************************************
* List of functions
******************************************************************************
* innnerHTMLonLoad() - initializes inner HTML page onLoad event
* selectMotor(motorNumber)  - select new active motor according to motorNumber
* getActiveMotor() - return active motor
* marChangedInput(varID) - change color of modified input form
* checkChangedVars(param) - find all inputs with change background color
* setActivePage() - set new active HTML module page
* build_multi_motor_selector (...) - creates multiply motor switch on the main page
* build_parameter_line(....) - add HTML code of new parameter input
* build_divider_line(title) - add a seperation line with optional title
* build_constant_line(...)  - add HTML code of new constant input
* build_control_structure_line(...) - add HTML code of new control line  in CtrlStructurePage.html
* checkIt(id) - check input characters put into Inputs
* checkItCS(id) - check input characters put into Inputs - Control structure
* calc_WE_max(state) - call or close Form of speed calcultor
* calc_ke(state) - call or close Form of BEMF constant calculator
* 
*******************************************************************************/

var tabHTMLFiles = [
        "", // Introduction
        "inner_MID.html", // Measurement
        "inner_Parameters.html", // Parameters
        "inner_CLoop.html", // Current Loop
        "inner_SLoop.html",  // Speed Loop
        "inner_PoSpeSensor.html", // PoSpes Sensors
        "inner_PoSpeBemfDQ.html", // Sensorless
        "inner_CtrlStructure.html",  // Cascade
        "inner_OutputHeader.html",   // Output File
        ""    // App Control
      ];
/***************************************************************************//*!
*
* @brief   The function initializes inner HTML page onLoad event
* @param   
* @return  None
* @remarks 
******************************************************************************/
function innerHTMLonload()
{
    var motorSelected = getActiveMotor();
    var checkBoxModeObj = document.getElementById("checkBoxMode");
}

/***************************************************************************//*!
*
* @brief   The function selects active motor
* @param   motorNumber - active motor number
* @return  None
* @remarks 
******************************************************************************/
function selectMotor(motorNumber)
{
  var activePage  = document.getElementById('mainFrame');

  var Motor1RadioObj = document.getElementById("Motor1Radio");
  var Motor2RadioObj = document.getElementById("Motor2Radio");
  var Motor3RadioObj = document.getElementById("Motor3Radio");    
  
  var tabMotor1Obj = document.getElementById("tabMotor1");
  var tabMotor2Obj = document.getElementById("tabMotor2");
  var tabMotor3Obj = document.getElementById("tabMotor3"); 
  
  var menuObj = document.getElementById("menu");
  var liObject = parent.document.getElementById('tabMotor'+[motorNumber]).getElementsByTagName('a');
  
  for (var i = 0; i < liObject.length; ++i)
  	{
 	    if (0 === i)   liObject[i].className = "active";
 	    else           liObject[i].className = "";
 	  }         
    
  var valDec = new Array(4);
   valDec[1] = 0;
   valDec[2] = 0;
   valDec[3] = 0;
    
   var liObject         = document.getElementById('tabMotor'+[motorNumber]).getElementsByTagName('a');
   valDec[motorNumber]  = parent.document.getElementById('M'+[motorNumber]+'_TabManager').innerHTML ;
        
   for(var i=0;i<9;i++)
    {
      if(((valDec[motorNumber])>>>i)&1)  liObject[i].style.display = '';
      else                               liObject[i].style.display = 'none';
    }  

    //motor 1
    if(motorNumber==1)
    { 
      activePage.src = defaultPageMotor1;

      tabMotor1Obj.style.display='';
      tabMotor2Obj.style.display='none';  
      tabMotor3Obj.style.display='none';      
      menuObj.style.backgroundColor='rgb(53,58,63)';
      
      Motor1RadioObj.checked = true;
      Motor2RadioObj.checked = false; 
      Motor3RadioObj.checked = false;        
     }  
    
     // motor 2
    if(motorNumber==2)  
    {  
      activePage.src = defaultPageMotor2;
      
      tabMotor1Obj.style.display='none';
      tabMotor2Obj.style.display='';  
      tabMotor3Obj.style.display='none';  
      menuObj.style.backgroundColor='rgb(26,75,92)';
      
      Motor1RadioObj.checked = false;
      Motor2RadioObj.checked = true; 
      Motor3RadioObj.checked = false;            
     }
     
     // motor 3
    if(motorNumber==3)  
    {  
      activePage.src = defaultPageMotor3;
      
      tabMotor1Obj.style.display='none';
      tabMotor2Obj.style.display='none';  
      tabMotor3Obj.style.display='';  
      menuObj.style.backgroundColor='rgb(53,80,16)';

      Motor1RadioObj.checked = false;
      Motor2RadioObj.checked = false; 
      Motor3RadioObj.checked = true;  
     }
  
     // return the background style for control page tab
      liObject[9].style.backgroundColor = liObject[1].style.backgroundColor;
 } 
 
/***************************************************************************//*!
*
* @brief   The function return number of active motor
* @param   
* @return  motor number
* @remarks 
******************************************************************************/
function getActiveMotor()
{
    var object1     = null;
    var object2     = null;
    var object3     = null;
    
    object1 = parent.document.getElementById("Motor1Radio");
    object2 = parent.document.getElementById("Motor2Radio");
    object3 = parent.document.getElementById("Motor3Radio");
    
    if(object1)
    {  
      if(object1.checked)
      {
        return 'M1_';
      }
      else if(object2.checked)
      {
        return 'M2_';
      }
      else if(object3.checked)
      {
        return 'M3_';
      }  
    }
    else
    {
      return '';
    }
}

/***************************************************************************//*!
*
* @brief   The function return number of active motor
* @param   
* @return  motor number
* @remarks 
******************************************************************************/
function getActiveMode()
{
    if(parent.document.getElementById("idTunningMode").value==1)
      return 1;
    else
      return 0;  
}

/***************************************************************************//*!
*
* @brief   The function return number of active motor
* @param   
* @return  motor number
* @remarks 
******************************************************************************/
function setActiveMode()
{
    var object = null;
    var activePage = parent.document.getElementById('mainFrame');
    var activeMode = parent.document.getElementById("idTunningMode").value;
    var motorTab = getActiveMotor();
    
    if (motorTab=="M1_")
        motorTab = "tabMotor1";         
    
    if (motorTab=="M2_")
        motorTab = "tabMotor2";
            
    if (motorTab=="M3_")
        motorTab = "tabMotor3";
    
    objectMode = parent.document.getElementById("Mode");
    if(objectMode)
    {
      if(activeMode==1)
          objectMode.innerHTML='Expert';
      else 
          objectMode.innerHTML='Basic';
    
      // store Setting
      paramFileWriteData("Setting_");
    
          
      //  change active menu item
      var liObject = parent.document.getElementById(motorTab).getElementsByTagName('a');
      for (var i = 0; i < liObject.length; ++i)
    	{
  	    if (liObject[i].className == "active")
            if (tabHTMLFiles[i]!="")
            {
                activePage.src = tabHTMLFiles[i];
            }  
  	  }  
    }
}
 
/***************************************************************************//*!
*
* @brief   The function mark background color of input elemements where value 
*          were changed
* @param   formName - name of Form section on active control page
*          varLabel - input box where changed was done
* @return  None
* @remarks 
******************************************************************************/
function markChangedInput(varID)
{
    var object     = null;
    //get active motor to selct proper prefix
    var prefixM = getActiveMotor();

    // add prefix to var ID
    if(prefixM!='')
      var paramTableID = 'paramTable'+prefixM;
    
    object      = document.getElementById(varID);
    
    // change color only of editable parmateters
    if(!(object.readOnly))
    { 
      if(document.getElementById("StoreData") != undefined)
      {
        document.getElementById("StoreData").disabled = false;
        document.getElementById("StoreData").className = "fButtonsEnabled";
        }
        
      if(document.getElementById("ReloadData") != undefined)
      {
        document.getElementById("ReloadData").disabled = false;  
        document.getElementById("ReloadData").className = "fButtonsEnabled";  
        }
        
      // store new value to main tab
      parent.document.getElementById(varID).innerHTML = object.value;
        
      // change input form bacground to see that value was changed
      object.style.background = 'rgb(250,183,153)';
      //object.style.background = '#FAB799';
      parent.document.getElementById(varID).style.color="red"; 
      // change color of paramter tab DIV to reflect modified input
      parent.document.getElementById(paramTableID).style.color="red";
    } 

    // update active tab constants
    updateTab();
} 

/***************************************************************************//*!
*
* @brief   The function set new control page in defined iFrame
* @param   pageName - name of required HTML to be shown
*          iFrame - iFrame name
* @return  None
* @remarks 
******************************************************************************/
function setActivePage(tabMotorId, pageName,liNumber) 
{
    var activePage = document.getElementById('mainFrame');
    var status = false;
    
    // set new page if it's allowed   
    activePage.src = pageName;
    
    //  change active menu item
    if(liNumber < 10){
      var liObject = parent.document.getElementById(tabMotorId).getElementsByTagName('a');
      for (var i = 0; i < liObject.length; ++i)
    	{
  	    if (liNumber === i)
  		     liObject[i].className = "active";
  	    else
                     liObject[i].className = "";
  	  }  
    }
}   
 
/***************************************************************************//*!
*
* @brief   The function creates multi-motor selector
* @param   
* @return  None
* @remarks 
******************************************************************************/ 
function build_multi_motor_selector()
{
 var select_font_size = 11.5;
 var select_width = 170;
 var select_height = 25;
 
 var select_top = 51.5;
 
 var top_text_margin = (select_height-select_font_size)/2-1;
 var top_radio_margin = (select_height-20)/2;
 
 var select_left_2nd = 180;
 var select_left_3rd = 360;
 
 var radio_left_2nd = select_left_2nd + select_width;
 var radio_left_3rd = select_left_3rd + select_width;;
 
   var string = "<>";
    // motor 1
      string = string + "<div id =\"Motor1Tab\" style=\"font-size:"+select_font_size+"px; font-family: Arial; color:white; background-color: rgb(53,58,63); height: "+select_height+"px; \n\
                        width:"+select_width+"px; position: absolute; left:0px; top:"+select_top+"px\">";    
      string = string + "<input checked type=\"radio\" name=\"Motor1Radio\" id=\"Motor1Radio\" style=\"cursor:pointer; transform:scale(0.8); position:absolute; left:80%; top:"+top_radio_margin+"px; \"\n\
                            onFocus=\"blur(selectMotor(1))\" value=\"1\">";
      string = string + "<label for=\"Motor1Radio\" id=\"Motor1Label\" style=\"position: relative; left: 15%; top:"+top_text_margin+"px\">Motor1: PMSM</labe>"
      string = string + "</div>";
    
    // motor 2 
      string = string + "<div id =\"Motor2Tab\" style=\"display:none; font-size:"+select_font_size+"px; font-family: Arial; color:white; background-color: rgb(26,75,92); height: "+select_height+"px; \n\
                        width:"+select_width+"px; position: absolute; left:"+select_left_2nd+"px; top:"+select_top+"px\">";  
      string = string + "<input type=\"radio\" name=\"Motor2Radio\" id=\"Motor2Radio\" style=\"cursor:pointer; transform:scale(0.8); position:absolute; left:80%; top:"+top_radio_margin+"px; \"\n\
                            onFocus=\"blur(selectMotor(2))\" value=\"2\" >";
      string = string + "<label for=\"Motor2Radio\" id=\"Motor2Label\" style=\"position: relative; left: 15%; top:"+top_text_margin+"px\">Motor2: PMSM</labe>"
      string = string + "</div>";
     
    // motor 3
      string = string + "<div id =\"Motor3Tab\" style=\"display:none; font-size:"+select_font_size+"px; font-family: Arial; color:white; background-color: rgb(53,80,16); height: "+select_height+"px; \n\
                        width:"+select_width+"px; position: absolute; left:"+select_left_3rd+"px; top:"+select_top+"px\">";    
      string = string + "<input type=\"radio\" name=\"Motor3Radio\" id=\"Motor3Radio\" style=\"cursor:pointer; transform:scale(0.8); position:absolute; left:80%; top:"+top_radio_margin+"px; \" \n\
                            onFocus=\"blur(selectMotor(3))\" value=\"3\">";
      string = string + "<label for=\"Motor3Radio\" id=\"Motor3Label\" style=\"position: relative; left: 15%; top:"+top_text_margin+"px\">Motor3: PMSM</labe>"
      string = string + "</div>";     
    
      //string = string + "</form>";
     
   
    // tuning mode selector
      string = string + "<div id =\"idModeSelector\" style=\" font-size: "+select_font_size+"px; font-family: Arial; color:black; background-color: rgb(195,199,204); height: "+select_height+"px; width: 160px; position: absolute; left: 541px; top: "+select_top+"px;\">";    
      string = string + "<font style=\"padding-left: 0.2cm; font-size: "+select_font_size+"px; position: relative; left: 0px; top: "+top_text_margin+"px; \">Tuning Mode:</font>";
      string = string + "<select id=\"idTunningMode\"  onChange =\"setActiveMode()\"  size=\"1\" style=\" border:0px; width:65px; font-style: italic; font-size: "+select_font_size+"px; position: relative; left: 10px; top: "+top_text_margin+"px;\">";  
      string = string + "<option value=\"0\">   Basic</option>"; 
      string = string + "<option value=\"1\">   Expert</option></select>";
      string = string + "</div>";
          
    return string;
}  
/***************************************************************************//*!
* build_control_structure_line_with_selector( varID, lineName,inputLabel1, unit1, inputComment1)
* @brief   The function creates code of input parameter
* @param   varLabel - visible label of pramater
*          varID    - HTML unique ID
*          varUnit  - input parameter Unit                                                                                                                        
*          valComment - help text which is active MouseOn event on varLabel
*          inObj - optional input object
*          inObjDescr - descritpion of optional input object
* @return  None
* @remarks 
******************************************************************************/        
function build_parameter_line( varLabel, varID, varUnit, varComment)
{
    var text_font_size = 11;
    var value_font_size = 10.5;        
            
    var string = "<tr>";  
    
    var onchange = "";  
    var varIDprefix="";
    var varUnitField = "";
    
    if(varUnit!=='')
      varUnitField = '[' + varUnit + ']';    
    //get active motor to selct proper prefix
    var prefixM = getActiveMotor();
    
    // add prefix to var ID
    if(prefixM!=='')
      varIDprefix = prefixM + varID; 
  
    // parameter name + comment when mouse moves over
    string = string + "<div id=\"row_"+varID+"\" style=\"height:18px; overflow: hidden;\"> ";
    string = string + "<div id=\"parText"+varLabel+"\" style=\"float:left; width:50%; font-family:Arial; font-size:"+text_font_size+"px; padding-left:0.3cm; \" >" + varLabel + "</div>";
    // next column
    string = string + "<div style=\"float:left; width:58px;\"><input type=\"text\" style=\" border-width: 0px; float:left;  text-align:right; font-size:"+value_font_size+"px;\" id=\"" + varIDprefix + "\" \n\
                        onkeydown=\"return checkEnterPress(event,id)\" onblur=\"return checkIt(id)\" onchange =\"markChangedInput('" + varIDprefix + "');  \n\
                        \"name=\"" + varLabel + "\"size=\"6\" value=\"0\" title=\"" + varComment + "\"></div>";
      // add param unit
   string = string + "<div  style=\"float:left; font-family: Arial; padding-left:0.1cm; font-size:"+text_font_size+"px;\">" + varUnitField + "</div>";
   string = string + "</div>";

    // end table
    string = string + "</tr>";
  	return string;
}

/***************************************************************************//*!
* build_parameter_line_SL( varLabel, varID, varUnit, varComment)
* @brief   The function creates parameter line in Speed Loop tab
* @param   varLabel - visible label of pramater
*          varID    - HTML unique ID
*          varUnit  - input parameter Unit                                                                                                                        
*          valComment - help text which is active MouseOn event on varLabel
* @return  string
* @remarks 
******************************************************************************/        
function build_parameter_line_SL( varLabel, varID, varUnit, varComment)
{
    var text_font_size = 11;
    var value_font_size = 10.5;     
    
    var string = "<tr>";  
	  var onchange = "";  
    var varIDprefix="";
    var varUnitField = "";
    
    if(varUnit!=='')
      varUnitField = '[' + varUnit + ']';    
    //get active motor to selct proper prefix
    var prefixM = getActiveMotor();
    
    // add prefix to var ID
    if(prefixM!=='')
      varIDprefix = prefixM + varID; 
	
    // parameter name + comment when mouse moves over
    string = string + "<div id=\"row_"+varID+"\" style=\"height:20px; overflow: hidden;\"> ";
    string = string + "<div id=\"parText"+varLabel+"\" style=\"float:left; width:50%; font-family:Arial; font-size:"+text_font_size+"px; padding-left:0.3cm; \" >" + varLabel + "</div>";
    // next column
    string = string + "<div style=\"float:left; width:58px;\"><input type=\"text\" style=\" border-width: 0px; float:left;  text-align:right; font-size:"+value_font_size+"px;\" id=\"" + varIDprefix + "\" \n\
                        onkeydown=\"return checkEnterPress(event,id)\" onblur=\"return checkIt(id)\" onchange =\"markChangedInput('" + varIDprefix + "');  \n\
                        \"name=\"" + varLabel + "\"size=\"10\" value=\"0\" title=\"" + varComment + "\"></div>";
      // add param unit
   string = string + "<div  style=\"float:left; font-family: Arial; padding-left:0.1cm; font-size:"+text_font_size+"px;\">" + varUnitField + "</div>";
   string = string + "</div>";
   
   string = string + "</tr>";
  	return string;
}


/***************************************************************************//*!
*
* @brief   The function divides line with optional title
* @param   title - text shown in empty line (optional)
*          
* @return  None
* @remarks 
******************************************************************************/ 
function build_divider_line(title)
{
    var string = "<tr>";

    string = string + "<td colspan=\"7\" align=\"center\" style=\"padding-left:0.3cm\">";
    string = string + "<div class=\"fontControlLabelSet\">&nbsp" + title + " </div>";             
    string = string + "</td></tr>";

    return string;
}

/***************************************************************************//*!
*
* @brief   The function creates code of for output constant
* @param   varLabel - visible label of pramater
*          varID -  constant unique ID
*          valComment - help text which is active MouseOn event on varLabel
* @return  None
* @remarks 
******************************************************************************/ 
function build_constant_line( varLabel, varID, valComment)
{
   var string = "<tr >";

   string = string + "<div id=\"row_"+varID+"\" style=\"height:20px; overflow: hidden;\"> ";
   string = string + "<div id=\"constText"+varLabel+"\" style=\"float:left; width:50%; font-family: Arial; font-size: 11px; padding-left:0.3cm\">" + varLabel + "</div>";
   string = string + "<div style=\" float:left; width:55px;\"><input disabled type=\"text\" style=\" border-width: 0px; float:left; disable:true; text-align:right; font-family: Arial; background-color:#EEEEED; \n\
                        font-size: 10.5px;\" id=\"" + varID + "\" name=\"" + varLabel + "\"size=\"10\" value=\"0\" title=\"" + valComment + "\"></div>";

   string = string + "</div></tr>";
   return string;
}

/***************************************************************************//*!
*
* @brief   The function creates code of for output constant with unit
* @param   varLabel - visible label of pramater
*          varID -  constant unique ID
*          valComment - help text which is active MouseOn event on varLabel
*          varUnit - variable unit
* @return  None
* @remarks 
******************************************************************************/ 
function build_constant_line_unit( varLabel, varID, valComment, varUnit)
{
    var string = "<tr>";
    var onchange = "";
    var varUnitField = "";
    
    if(varUnit!=='')
      varUnitField = '[' + varUnit + ']';
     
    //string = string + "<td align=\"left\" valign=\"top\" width=1> </td>";
    string = string + "<td align=\"left\" valign=\"middle\" width=45% style=\"font-family: Arial; font-size: 11px; padding-left:0.3cm\"> <label id = \"constText" + varLabel + "\"  >" + varLabel + "</label> </td>";
    
    string = string + "<td valign=\"top\" width=30%>";  
    string = string + "<div style=\"float:left; width:10px;\"><input type=\"text\" style=\"text-align:right; font-family: Arial; background-color=rgb(195,199,204); \n\
                        font-size: 12px;\" id=\"" + varID + "\" name=\"" + varLabel + "\"size=\"5\" value=\"0\" title=\"" + valComment + "\"></div>";
    string = string + "<td valign=\"center\" width=\"20%\" style=\"font-family: Arial; font-size: 11px;\">" + varUnitField + "</td>";
    string = string + "</td></tr>";
    return string;
}


/***************************************************************************//*!
*
* @brief   The function creates code of control structure line
* @param   varID - ID of inut form
*          varLabel - visible label of pramater
*          inputLabel1  - label above first input form
*          inputLabel2  - label above second input form
*          valComment1 - help text which is active Mouse over event on input 1
*          valComment1 - help text which is active Mouse over event on input 2
* @return  None
* @remarks 
******************************************************************************/ 
function build_control_structure_line( varID, lineName,inputLabel1, unit1, inputLabel2, unit2, inputComment1,inputComment2)
{
    var string = "<tr>";
    var varIDprefix="";    
    
//    <button class="button" id = "buttonApply" style="width: 100px; height: 35px; float: right; position: relative; right: 10px;">APPLY</button>
    
    //get active motor to selct proper prefix
    var prefixM = getActiveMotor();
    // add prefix to var ID
    if(prefixM!=='')
      varIDprefix = prefixM + varID;    
	 
    string = string + "<td  valign=\"center\"><div class=\"fontControlLabelS1\" style=\"padding-left:0.1cm\">" + lineName + "</div></td>";             
    string = string + "<td rowspan =\"2\" id=\"" + varIDprefix + "\" onClick=\"Ctrl_Structure_click(id)\" class=\"switch_off\">DISABLED</td>";
      
    if(inputLabel2!=="")                                                                           
    {
      string = string + "<td valign=\"center\"><div class=\"fontControlLabelS\" style=\"padding-left:0.1cm\" title=\"" + inputComment1 + "\">" + inputLabel1 + "</div></td>"; 
      string = string + "<td valign=\"center\"> <input  type = \"text\", style=\" font-size:10px; text-align:right;\" maxlength=\"6\" size=\"6\" id = \"" + varIDprefix + "_Input1\" \n\
                        onkeydown=\"return checkEnterPressCtrlStruc(event,id)\" onblur=\"return checkItCS(id)\" name=\"" + inputLabel1 + "\" > </td>";
      string = string + "<td  valign=\"center\"><div class=\"fontControlLabelS\">" + unit1 + "</div></td>";
    }
    else
    {
      string = string + "<td rowspan =\"2\" valign=\"center\"><div class=\"fontControlLabelS\" style=\"padding-left:0.1cm\" title=\"" + inputComment1 + "\">" + inputLabel1 + "</div></td>"; 
      string = string + "<td rowspan =\"2\"  valign=\"center\"> <input  type = \"text\", style=\" font-size:10px; text-align:right;\" maxlength=\"6\" size=\"6\" id = \"" + varIDprefix + "_Input1\" \n\
                        onkeydown=\"return checkEnterPressCtrlStruc(event,id)\" onblur=\"return checkItCS(id)\" name=\"" + inputLabel1 + "\"  > </td>";
      string = string + "<td rowspan =\"2\"  valign=\"center\"><div class=\"fontControlLabelS\">" + unit1 + "</div></td>";
    }
     
     string = string + "</tr>";
     string = string + "<tr>";
                              
    string = string + "<td  valign=\"center\" style=\"text-align: center;\"><input type=\"button\" id=\"" + varIDprefix + "\" value=\"view\" onclick=\"clickCntStrImage(id)\" class=\"ctrlStrucView\"></td>";
     if(inputLabel2!=="")
     {
        string = string + "<td  w valign=\"center\"><div class=\"fontControlLabelS\" style=\"padding-left:0.1cm\" title=\"" + inputComment2 + "\">" + inputLabel2 + "</div></td>";
        string = string + "<td  valign=\"center\"> <input  type = \"text\" style=\" font-size:10px; text-align:right;\" maxlength=\"6\" size=\"6\" id = \"" + varIDprefix + "_Input2\"  \n\
                           onkeydown=\"return checkEnterPressCtrlStruc(event,id)\" onblur=\"return checkItCS(id)\" name=\"" + inputLabel2 + "\" > </td>";
        string = string + "<td  valign=\"center\"><div class=\"fontControlLabelS\">" + unit2 + "</div></td>";
    }
     
     

    string = string + "</tr>"; 
 
  	return string;
}


/////////////////////////////////////////////////////////////////////////////////////////////////
function build_VHz_control_structure_line( varID, lineName,inputLabel1, unit1, inputLabel2, unit2, inputComment1,inputComment2)
{
    var string = "<tr>";
    var varIDprefix="";
                  
    //get active motor to selct proper prefix
    var prefixM = getActiveMotor();
    // add prefix to var ID
    if(prefixM!=='')
      varIDprefix = prefixM + varID; 

    var string = string + "<td rowspan =\"2\" valign=\"center\"><div class=\"fontControlLabelS1\" style=\"padding-left:0.0cm;\">" + lineName + "</div></td>"; 
    var string = string + "<td rowspan =\"3\"><table>";
    var string = string + "<td id=\"" + varIDprefix + "\" onClick=\"Ctrl_Structure_click(id)\" class=\"switch_off\">DISABLED</td>";
    var string = string + "</table></td>";
    var string = string + "<td  valign=\"center\"><div class=\"fontControlLabelS\" style=\"padding-left:0.1cm\" id=\"" + inputLabel1 + "\" title=\"" + inputComment1 + "\">" + inputLabel1 + "</div></td>";
    var string = string + "<td valign=\"center\"  ><div style=\"padding: 0px; margin:0px; display: inline;\">\n\
                          <input type=\"text\", onkeydown=\"return checkEnterPressCtrlStruc(event,id)\" onblur=\"return checkItCS(id)\" style=\"font-size:10px; text-align:right;\"  \n\
                          maxlength=\"6\" size=\"2\" id = \"" + varIDprefix + "_Input2\" ></div>";
    var string = string + "<input type=\"button\" id=\""+prefixM+"ScalarUp\"; value=\"&#x2191\"  onclick=\"clickScalarUpDown(id)\" disabled=\"disabled\"; class=\"UpDownButton_dis\" style=\"width:10px; height:50%;\">";
    var string = string + "<input type=\"button\" id=\""+prefixM+"ScalarDown\"; value=\"&#x2193\"  onclick=\"clickScalarUpDown(id)\" disabled=\"disabled\"; class=\"UpDownButton_dis\" style=\"width:10px; height:50%;\">";
    var string = string + "</td><td><div class=\"fontControlLabelS\">" + unit1 + "</div></td>";
    var string = string + "</tr>";

    // Uq_required line
    var string = string + "<tr>"; 
    var string = string + "<td><div class=\"fontControlLabelS\" title=\"Resulting supply voltage\" style=\"padding-left:0.1cm;\">Uq_req</div></td>";
    var string = string + "<td><input disabled type=\"text\" value=\"0\" style=\"font-size:10px; text-align:right;\" maxlength=\"6\" size=\"6\" id = \"" + varIDprefix + "_Input2_Um\"></td>";
    var string = string + "<td><div class=\"fontControlLabelS\" >[V]</div></td>";
    var string = string + "</tr>"; 
                                
    var string = string + "<tr>";  
    
    var string = string + "<td valign=\"center\" style=\"text-align: center;\"><input type=\"button\" id=\"" + varIDprefix + "\" value=\"view\" onclick=\"clickCntStrImage(id)\" class=\"ctrlStrucView\"></td>";
    var string = string + "<td valign=\"center\"><div class=\"fontControlLabelS\" style=\"padding-left:0.1cm\" title=\"" + inputComment2 + "\">" + inputLabel2 + "</div></td>";    
    var string = string + "<td valign=\"center\"> <input type = \"text\" style=\"font-size:10px; text-align:right;\" maxlength=\"6\" size=\"6\" id = \"" + varIDprefix + "_Input1\"  \n\
                            onkeydown=\"return checkEnterPressCtrlStruc(event,id)\" onblur=\"return checkItCS(id)\" name=\"" + inputLabel2 + "\" ></td>";
    var string = string + "<td><div class=\"fontControlLabelS\" >" + unit2 + "</div></td>";
    var string = string + "</tr>";           
 
    return string; 
}

/***************************************************************************//*!
*
* @brief   The function creates code of for output constant
* @param   varLabel - visible label of pramater
*          varID -  constant unique ID
*          valComment - help text which is active MouseOn event on varLabel
* @return  None                                                                 
* @remarks 
******************************************************************************/ 
function build_control_structure_line_with_selector( varID, lineName,inputLabel1, unit1, inputComment1)
{
    var string = "<tr>";
    var varIDprefix="";
    
    //get active motor to selct proper prefix
    var prefixM = getActiveMotor();
    // add prefix to var ID
    if(prefixM!=='')
      varIDprefix = prefixM + varID;     
	 
    string = string + "<td width=\"100\"  valign=\"center\"><div class=\"fontControlLabelS1\" style=\"padding-left:0.1cm\">" + lineName + "</div></td>";             
    string = string + "<td id=\"" + varIDprefix + "\" class=\"switch_off\" >DISABLED</td>";
  
    string = string + "<td valign=\"center\"><div class=\"fontControlLabelS\" style=\"padding-left:0.1cm\" title=\"" + inputComment1 + "\">" + inputLabel1 + "</div></td>"; 
    string = string + "<td valign=\"center\" ><select style=\"font-size:11px\" id=\"" + varIDprefix + "_Select\" onChange =\"sensorTypeChange(this.selectedIndex)\" size=\"1\">"; 
    string = string + "<option value=\"0\">encoder</option>"; 
    string = string + "<option value=\"1\">resolver</option>";
    string = string + "<option value=\"2\">sensorless</option>";
    string = string + "</select></td>";

    string = string + "</tr>"; 
 
  	return string;
} 

/***************************************************************************//*!
*
* @brief   The function creates code of for output constant
* @param   varLabel - visible label of pramater
*          varID -  constant unique ID
*          valComment - help text which is active MouseOn event on varLabel
* @return  None                                                                 
* @remarks 
******************************************************************************/ 
function build_line_with_selector(varLabel, varID,varComment)
{
    var string = "<tr>";
    
    //get active motor to selct proper prefix
    var prefixM = getActiveMotor();
    // add prefix to var ID
    if(prefixM!=='')
      varIDprefix = prefixM + varID;     
	 
    // parameter name + comment when mouse moves over
    string = string + "<td align=\"left\" valign=\"middle\" style=\"font-family:Arial; font-size:12px; padding-left:0.4cm\"> <label id = \"parText" + varLabel + "\" title=\"" + varComment + "\" >" + varLabel + "</label> </td>";
 	  // next column
    // input box with event "onchage"
    string = string + "<td  width=\"25%\"  valign=\"center\" style=\"overflow: visible; position: relative;\"><div style=\"margin-right:-100px; width:40px; overflow: visible; position: relative;\"><select style=\"width: 140px; margin: 0px;\" id=\"" + varIDprefix + "\" onChange =\"HWboardSelector(this.value);\" size=\"1\">"; 
    string = string + "<option value=\"0\">TWR-MC-LV3PH</option>"; 
    string = string + "<option value=\"1\">FSL-HV-PS</option>";
    string = string + "<option value=\"2\">User HW</option></select></div></td><td colspan=\"2\"></td>";
    
        
    // end table
    string = string + "</tr>";
  	return string;
    
}  

/***************************************************************************//*!
*
* @brief   The function checks input characters to forms. Enables only numbers
* @param   Event
* @return  true - if number was put
*          false - different character was put
* @remarks 
******************************************************************************/
function checkIt(id) {
    object = document.getElementById(id);
  
    if(isNaN(object.value) || object.value==='') 
    {
        alert("The field '" + object.name + "' accepts numbers only!");
        status = "This field accepts numbers only.";
        //object.style.background = "red";
        object.value = '';
        object.focus();
        return false  
    }
    else
    {
        status = "";
        return true
    }
}       

/***************************************************************************//*!
*
* @brief   The function checks input characters to forms. Enables only numbers
* @param   Event
* @return  true - if number was put
*          false - different character was put
* @remarks 
******************************************************************************/
function checkItCS(id) {      
    object = document.getElementById(id);
           
    if(isNaN(object.value) || object.value==='') 
    {
        alert("The field '" + object.name + "' accepts numbers only!");
        status = "This field accepts numbers only.";
        object.value = '';
        object.focus();
        return false  
    }
    else
    {
        status = "";
        object.blur();
        return true
    }
}

/***************************************************************************//*!
*
* @brief   The function checks pressing of ENTER
* @param   Event
* @return  true - enter was pressed
*          false - different key was pressed
* @remarks 
******************************************************************************/
function checkEnterPress(evt,id) {
    // check enter pressing
    evt = (evt) ? evt : window.event
    var charCode = (evt.which) ? evt.which : evt.keyCode 
    if(charCode==13)
    {   
        object = document.getElementById(id);
        if(isNaN(object.value)) 
        {
          object.blur();
        }
        else
        {
          markChangedInput(id);
          return true
        }
    }
}    

function checkEnterPressCtrlStruc(evt,id) {
    // check enter pressing
    evt = (evt) ? evt : window.event
    var charCode = (evt.which) ? evt.which : evt.keyCode 
    if(charCode==13)
    {   
        object = document.getElementById(id);
        if(isNaN(object.value)) 
        {
          object.blur();          
        }
        else
        {
          object.blur();
          clickUpdateCtrlStruc();
          return true
        }
    }
}

/***************************************************************************//*!
* 
******************************************************************************
* End of code
******************************************************************************/