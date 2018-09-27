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
* @file   inner_AppSetting.js
*
* @brief  Application Setting panel functions of MCAT Tool IDE
* 
******************************************************************************/

/******************************************************************************
* List of functions
********************************************************************************
loadInitGeneralSettings()
loadInitFocSettings()
loadInitSensorsSettings()
loadInitTabMenuSettings()
initLoadSettings()
Choose_AppSet_menu_cont(liNo)
focClick()
sensorsClick()
tabMenuClick()
hideTabMenu()
unhideTabMenu()
clickSettingOK()
clickSettingCancel()
build3MotTabMenu()
buildLineSeparator(lineName)
build3MotHeadline()
build3MotDropdown(lineName,id, option)
build3MotCheckbox(lineName)
buildSensorField()
browseDirectory()
dropdownChange(id, value)
checkboxClick(MotorNo)
********************************************************************************/

/*Global variable*/

// An array defining MCAT sheet name. Must be compatible with a menu in MainPage.html
 var tabNames = [ 
    "Introduction",
    "Parameter identification",
    "Parameters",
    "Current Loop",
    "Speed Loop",
    "Sensors",
    "Sensorless",
    "Control Structure",
    "Output File",
    "Application Control"
   ];
   
// An array defining available speed/position sensing approaches  
var sensorsGroup = [ 
   "Encoder",
   "Resolver",
   "Sensorless"];
   
var ApplyButtonValue = 0;

/***************************************************************************//*!
* @function loadInitGeneralSettings()
* @brief    Reads initial settings and set the "General" menu
*******************************************************************************/
function loadInitGeneralSettings(){
    // Initialize "General" sheet in App Setting page menu
    var MotorsNumber    = parent.document.getElementById("MotorsNo").innerText;
    document.getElementById("MotorsNo").options.value = MotorsNumber;
    var ArithmeticType  = parent.document.getElementById("Arithmetic").innerText; 
    document.getElementById("Arithmetic").options.value = ArithmeticType;
    var MotorType       = parent.document.getElementById("M1type").innerText;               
    document.getElementById("M1type").options.value = MotorType;        
}

/***************************************************************************//*!
* @function loadInitFocSettings()
* @brief    Reads initial settings and set the "FOC" menu
*******************************************************************************/
function loadInitFocSettings(){
    for (var i=1;i<4;i++){
        // Initialize "FOC" sheet in App Setting page menu
        var Mx_CcontrollerType      = parent.document.getElementById("M"+[i]+"_Ccontroller").innerText;        
        var Mx_FFw_CLType           = parent.document.getElementById("M"+[i]+"_FFw_CL").innerText;
        var Mx_ScontrollerType      = parent.document.getElementById("M"+[i]+"_Scontroller").innerText;    
        var Mx_FFw_SLType           = parent.document.getElementById("M"+[i]+"_FFw_SL").innerText;    
        var Mx_AlignmentType        = parent.document.getElementById("M"+[i]+"_Alignment").innerText;    
        document.getElementById("M"+[i]+"_Ccontroller").options.value = Mx_CcontrollerType;
        document.getElementById("M"+[i]+"_FFw_CL").options.value = Mx_FFw_CLType;
        document.getElementById("M"+[i]+"_Scontroller").options.value = Mx_ScontrollerType;
        document.getElementById("M"+[i]+"_FFw_SL").options.value = Mx_FFw_SLType;
        document.getElementById("M"+[i]+"_Alignment").options.value = Mx_AlignmentType;   
    }
}

/***************************************************************************//*!
* @function loadInitSensorsSettings()
* @brief    Reads initial settings and set the "Sensors" menu
*******************************************************************************/
function loadInitSensorsSettings(){

    
    for (var i=1;i<4;i++){
        //Initialize "Sensors" sheet in App Setting page menu sensorsGroup
        // Checkbox
        var Mx_PospeFbck  = parent.document.getElementById("M"+[i]+"_PospeFbck").innerText;           
        for (var j=0; j < sensorsGroup.length; j++){
            var Mx_CBPospe = document.getElementById("M"+[i]+"_"+sensorsGroup[j]); 
            if((Mx_PospeFbck>>>j)&1)
                  Mx_CBPospe.checked = true;
            else  Mx_CBPospe.checked = false;  
        }
        // Filter dropdown menu 
        var Mx_PospeFilt            = parent.document.getElementById("M"+[i]+"_WFilt").innerText;   
        document.getElementById("M"+[i]+'_WFilt').options.value = Mx_PospeFilt;
    }
   
}

/***************************************************************************//*!
* @function loadInitTabMenuSettings()
* @brief    Reads initial settings and set the "Tab menu" menu
*******************************************************************************/
function loadInitTabMenuSettings(){
    // Initialize the Tab menu checkboxes in the setting page 
    for (var i=1;i<4;i++){
        //var Mx_TabMenu  = parent.document.getElementById("Tab"+[i]+"manager").innerText;           
        var Mx_TabMenu  = parent.document.getElementById("M"+[i]+"_TabManager").innerText;           
        for (var j=0; j < tabNames.length; j++){
            var Mx_CByObject = document.getElementById("M"+[i]+"_CB"+[j]); 
            if((Mx_TabMenu>>>j)&1)
                  Mx_CByObject.checked = true;
            else  Mx_CByObject.checked = false;
        }
    }
}

/***************************************************************************//*!
* @function initLoadSettings()
* @brief    onload callback function. Reads all setting of the setting page
*******************************************************************************/
 function initLoadSettings()
 {
    loadInitGeneralSettings();
    loadInitFocSettings();
    loadInitSensorsSettings();
    loadInitTabMenuSettings();
    
    ////// Initialization of project path - read from parent doc table
    var pathRelativeFolder =  parent.document.getElementById('ProjectPath').innerHTML;;
    var pathRelativeFolderOutput = "{FM_project_loc} / " + pathRelativeFolder;
  
    if (pathRelativeFolderOutput.length>60)
    {
      for (var i=0;i<60;i++)
      {
          
          if (i>30 && pathRelativeFolderOutput.charAt(i)==='/')
          {
            var fLine = pathRelativeFolderOutput.substring(0,i+1);
            var sLine = pathRelativeFolderOutput.substring(i+1);
            document.getElementById('projectPathWrite1').innerHTML = fLine;
            document.getElementById('secLineProjPath').style.display = '';
            document.getElementById('projectPathWrite2').innerHTML = sLine;         
          }
      }
    }
    else 
    {
      document.getElementById('projectPathWrite1').innerHTML = pathRelativeFolderOutput;
      document.getElementById('projectPathWrite2').innerHTML = '';
    }
}
 
/***************************************************************************//*!
* @function tabMenuClick()
* @brief    Function called on click in vertical menu
* @param    liNo  - the number of the item in the vertical menu of setting page 
* @return   
*******************************************************************************/   
function Choose_AppSet_menu_cont(liNo){
   var divObject;
   var liObject = document.getElementById('AppSet-menu-items').getElementsByTagName('a');

   // go tru all items of v-menu and clear "class" and hide all setting pages
   for (var i=0;i<(liObject.length-1);i++){
    divObject = document.getElementById('vert-menu-'+[i]);
    divObject.style.display = 'none';
    liObject[i].className = "";
   }
   
   // set the class format and setting page visibility according to selected item
   // in the v-menu
   divObject = document.getElementById('vert-menu-'+[liNo]);
   divObject.style.display = '';
   liObject[liNo].className = "active";

    switch (liObject[liNo].innerHTML){
        case "General":
           // generalClick();
            break;
        case "FOC":
            focClick();
            break;
        case "Sensors":
            sensorsClick();
            break;
        case "Tab menu":
            tabMenuClick();
            break;        
    }
}

/***************************************************************************//*!
* @function tabMenuClick()
* @brief    Function executed when "FOC" selected. 
* @param    
* @return   
*******************************************************************************/   
function focClick(){
    var NoMotors    = document.getElementById('MotorsNo'); 
    var MotorLabel  = document.getElementById('FOC_table').getElementsByTagName('td');
    
    var FOCobj  = document.getElementById('FOC_table').getElementsByTagName('select');
   
    MotorLabel[2].style.color = "black";
    MotorLabel[3].style.color = "black";
        
    for (var i=0;i<FOCobj.length;i++){
        FOCobj[i].disabled = false;
    }
    
    loadInitFocSettings();
    
    //set M2/M3 FOC objects and labels according selected number of motors
    if (NoMotors.value !== "Triple")
        for (var i=0;i<(FOCobj.length/3);i++){
            //dual motor application selected
            if(NoMotors.value === "Dual"){
                document.getElementById(FOCobj[3*i+2].id).options.value = 0;
                FOCobj[3*i+2].disabled = true;
                MotorLabel[3].style.color = "#999999";
            }
            //single motor application selected
            else{
                document.getElementById(FOCobj[3*i+1].id).options.value = 0;
                document.getElementById(FOCobj[3*i+2].id).options.value = 0;
                FOCobj[3*i+1].disabled = true;
                FOCobj[3*i+2].disabled = true;                
                MotorLabel[2].style.color = "#999999";
                MotorLabel[3].style.color = "#999999";
            }
        }   
}

/***************************************************************************//*!
* @function tabMenuClick()
* @brief    Function executed when "Tab menu" selected. It offers MCAT Tabs 
*           management for all three motors.
* @param    
* @return   
*******************************************************************************/   
function sensorsClick(){
    var NoMotors    = document.getElementById('MotorsNo'); 
    var MotorLabel  = document.getElementById('Sensors_table').getElementsByTagName('td');

    // read arithmetic 
    var ArithmeticType  = document.getElementById("Arithmetic").options.value; 

   //enable M2/M3 checkoboxes/drobdown menus and labels in Sensors of setting page
    MotorLabel[2].style.color = "black";
    MotorLabel[3].style.color = "black";

    for (var i=0;i<sensorsGroup.length;i++){
        var M2_SensorObj = document.getElementById("M2_"+sensorsGroup[i]);
        var M2_WFiltObj = document.getElementById("M2_WFilt");
        var M3_SensorObj = document.getElementById("M3_"+sensorsGroup[i]);
        var M3_WFiltObj = document.getElementById("M3_WFilt"); 
        M2_SensorObj.disabled = false;
        M2_WFiltObj.disabled = false;
        M3_SensorObj.disabled = false;
        M3_WFiltObj.disabled = false;
    }
    
    loadInitSensorsSettings();
    
    //set M2/M3 checkoboxes and labels according selected number of motors
    if (NoMotors.value !== "Triple")
        for (var i=0;i<sensorsGroup.length;i++){
            //dual motor application selected => disable third motor
            if(NoMotors.value === "Dual"){
                var M3_SensorObj = document.getElementById("M3_"+sensorsGroup[i]);
                var M3_WFiltObj = document.getElementById("M3_WFilt"); 
                M3_SensorObj.checked = false;
                M3_SensorObj.disabled = true;
                M3_WFiltObj.options.value = 0;
                M3_WFiltObj.disabled = true;
                MotorLabel[3].style.color = "#999999";
            }
            //single motor application selected => disable second & third motor
            else{
                var M2_SensorObj = document.getElementById("M2_"+sensorsGroup[i]);
                var M2_WFiltObj = document.getElementById("M2_WFilt");
                var M3_SensorObj = document.getElementById("M3_"+sensorsGroup[i]);
                var M3_WFiltObj = document.getElementById("M3_WFilt");               
                M2_SensorObj.checked = false;
                M2_SensorObj.disabled = true;
                M2_WFiltObj.options.value = 0;
                M2_WFiltObj.disabled = true;
                M3_SensorObj.checked = false;
                M3_SensorObj.disabled = true;
                M3_WFiltObj.options.value = 0;
                M3_WFiltObj.disabled = true;                
                MotorLabel[2].style.color = "#999999";
                MotorLabel[3].style.color = "#999999";
            }
        }

    // Filter dropdown menu modification according to selected arithmetic.
    // Float does support only filter MA with lambda parameter, Frac only MA with n-sample parameter
    for(var i=1;i<4;i++){
        var WFilter = document.getElementById("M"+[i]+"_WFilt");//.getElementsByTagName("option"); 
    
        // Option 1 = MAF lambda (for Float arit.) | Option 2 = MAF n-sample (for Frac arit)
        if(ArithmeticType === 'Float'){
            if(WFilter.selectedIndex===1)   WFilter.selectedIndex = 2;
            
            WFilter.options[1].disabled = true;
            WFilter.options[2].disabled = false;
        }
        else{
            if(WFilter.selectedIndex===2)   WFilter.selectedIndex = 1;
            
            WFilter.options[2].disabled = true;
            WFilter.options[1].disabled = false;
        }
    }
}

/***************************************************************************//*!
* @function tabMenuClick()
* @brief    Function executed when "Tab menu" selected. It offers MCAT Tabs 
*           management for all three motors.
* @param    
* @return   
*******************************************************************************/   
function tabMenuClick(){
    var NoMotors    = document.getElementById('MotorsNo'); 
    var MotorLabel  = document.getElementById('Tab_menu_table').getElementsByTagName('td');

    // Initialize the Tab menu checkboxes in the setting page
    for (var i=1;i<4;i++){
       // var Mx_TabMenu = parent.document.getElementById("Tab"+[i]+"manager").innerHTML;           
        var Mx_TabMenu  = parent.document.getElementById("M"+[i]+"_TabManager").innerText;           
        for (var j=0; j < tabNames.length; j++){
            var Mx_CByObject = document.getElementById("M"+[i]+"_CB"+[j]); 
            if((Mx_TabMenu>>>j)&1)
                  Mx_CByObject.checked = true;
            else  Mx_CByObject.checked = false;}
    }
        
    //enable M2/M3 checkoboxes and labels in Tab menu of setting page
    MotorLabel[2].style.color = "black";
    MotorLabel[3].style.color = "black";
    
    for (var i=0;i<tabNames.length;i++){
        var M2_CBxObject = document.getElementById("M2_CB"+[i]);
        var M3_CBxObject = document.getElementById("M3_CB"+[i]);            
        M2_CBxObject.disabled = false;
        M3_CBxObject.disabled = false; 
    }
    //set M2/M3 checkoboxes and labels according selected number of motors
    if (NoMotors.value !== "Triple")
        for (var i=0;i<tabNames.length;i++){
            //dual motor application selected
            if(NoMotors.value === "Dual"){
                var M3_CBxObject = document.getElementById("M3_CB"+[i]);
                M3_CBxObject.checked = false;
                M3_CBxObject.disabled = true;
                MotorLabel[3].style.color = "#999999";
            }
            //single motor application selected
            else{
                var M2_CBxObject = document.getElementById("M2_CB"+[i]);
                var M3_CBxObject = document.getElementById("M3_CB"+[i]);            
                M2_CBxObject.checked = false;                
                M3_CBxObject.checked = false;                                
                M2_CBxObject.disabled = true;
                M3_CBxObject.disabled = true; 
                MotorLabel[2].style.color = "#999999";
                MotorLabel[3].style.color = "#999999";
            }
        }
}

/***************************************************************************//*!
* @function hideTabMenu()
* @brief    removes the TABs line and extends the height of the setting window 
* @param    
* @return   
* @remarks  
*******************************************************************************/   
function hideTabMenu()
{
   var activePage   = parent.document.getElementById('mainFrame');
    
   activePage.style.position="absolute";
   activePage.style.top="-60px";
   activePage.style.left="0px";
   activePage.style.height="440px";  
 }
 
/***************************************************************************//*!
* @function unhideTabMenu()
* @brief    display the TABs line and shrink the height of the workspace window 
* @param    
* @return   
* @remarks  
*******************************************************************************/   
function unhideTabMenu()
{
   var activePage = parent.document.getElementById('mainFrame');
   activePage.style.position="absolute";
   activePage.style.top="0px";
   activePage.style.left="0px";
   activePage.style.height="380px";
}

/***************************************************************************//*!
* @function DefaultMCATworkspaceSetting()
* @brief    Re-set the MCAT enviroment / windows to default, leave Setting page
* @param    
* @return   
* @remarks  clickStoreData()
*******************************************************************************/ 
function DefaultMCATworkspaceSetting()
{
var NoMotors     = document.getElementById('MotorsNo').value;     
var liObject     = parent.parent.document.getElementById('tabMotor1').getElementsByTagName('a');
var activePage   = parent.document.getElementById('mainFrame');
var menuObj      = parent.document.getElementById("menu");

// motor radio button select - M2 & M3 disable by default
parent.document.getElementById('Motor2Tab').style.display = 'none';
parent.document.getElementById('Motor2Radio').style.display = 'none';
parent.document.getElementById('Motor3Tab').style.display = 'none';
parent.document.getElementById('Motor3Radio').style.display = 'none';


// if single motor -> do nothing
if (NoMotors !== "Single")
{
     //dual motor -> display Motor2 selector w/ radio checbox
     if(NoMotors === "Dual"){
        parent.document.getElementById('Motor2Tab').style.display = '';
        parent.document.getElementById('Motor2Radio').style.display = '';         
     }
     //triple motor -> display Motor2 and Motor3 selector w/ radio checbox
     else{
        parent.document.getElementById('Motor2Tab').style.display = '';
        parent.document.getElementById('Motor2Radio').style.display = '';  
        parent.document.getElementById('Motor3Tab').style.display = '';
        parent.document.getElementById('Motor3Radio').style.display = '';          
     }
}

// set the active page and active first item (liObject) in a menu     
activePage.src = 'inner_Intro_M1.html';
   
// set the menu to Motor 1 : (motor selector / menu color )        
 for(var i=1;i<4;i++){
    var tabMotorXObj = parent.document.getElementById("tabMotor"+[i]);
    var MotorRadioObj = parent.document.getElementById("Motor"+[i]+"Radio");
    
    if(i===1){
       tabMotorXObj.style.display = 'block'; 
       MotorRadioObj.checked = true; 
    }
    else{
       tabMotorXObj.style.display = 'none'; 
       MotorRadioObj.checked = false;
    }
}       
menuObj.style.backgroundColor='rgb(53,58,63)';
        

liObject[0].className = "active"; 
// set the rest menu items inactive    
for (var i=1; i<10; i++)
  liObject[i].className = "";

// make the Tab menu visible -> leave the setting page
unhideTabMenu();
}

/***************************************************************************//*!
* @function clickSettingOK()
* @brief    apply all setting changes without storing into the MCAT configuration file
* @param    
* @return   
* @remarks  clickStoreData()
*******************************************************************************/ 
function clickSettingOK()
{
    var NoMotors    = document.getElementById('MotorsNo').selectedIndex;
    
    for(var i=0;i<(NoMotors+1); i++){
        var tab_sensor      = document.getElementById('M'+(i+1)+"_CB5").checked;
        var tab_sensorless  = document.getElementById('M'+(i+1)+"_CB6").checked;
        
        var ENC_sensor      = document.getElementById('M'+(i+1)+"_Encoder").checked;
        var RES_sensor      = document.getElementById('M'+(i+1)+"_Resolver").checked;
        var SLS_sensor      = document.getElementById('M'+(i+1)+"_Sensorless").checked;
        
        var mTypeObj        = parent.document.getElementById('M'+ [i+1] + 'type');
        var mLabelObj       = parent.parent.document.getElementById('Motor'+ [i+1] + 'Label');
        
        // read type of selected motor and display it in radio-button motor selector  
        mLabelObj.innerHTML = 'Motor &nbsp;'+[i+1] +':&nbsp; &nbsp;' +mTypeObj.innerHTML;
        
       // Align sensor choise between Sensors menu and Tab menu 
       if (tab_sensor===true){
          if((ENC_sensor+RES_sensor)===0){
                var sensor_status = 0;
                alert('Motor '+[i+1]+'. Neither Encoder nor Resolver selected in menu Sensors.\n\
If you do not want to use sensors uncheck the "Sensors box" in Tab menu.');              
          }
          else  var sensor_status = 1;
       }
       else{
          if((ENC_sensor+RES_sensor)===0)   var sensor_status = 1;
          else{
              var sensor_status = 0;
              alert('Motor '+[i+1]+'. Either Encoder or Resolver selected in menu Sensors.\n\
Check the "Sensors box" in the Tab menu if you want to these sensors.');              
          }
       }
       
       // Align sensorless choise between Sensors menu and Tab menu
       if (tab_sensorless===true){
          if(SLS_sensor===false){
              var sensorless_status = 0;
              alert('Motor '+[i+1]+'. No Sensorless method selected in menu Sensors.\n\
If you do not want to use Sensorless method uncheck the "Sensorless box" in Tab menu.');
          }
          else
              var sensorless_status = 1;
       }
       else{
          if(SLS_sensor===false)
              var sensorless_status = 1;
          else{
              var sensorless_status = 0;
              alert('Motor '+[i+1]+'. Sensorless method selected in menu Sensors.\n\
Check the "Sensorless box" in the Tab menu if you want to use Sensorless.');
          }
       }       
    }

    // Leave setting page, set default MCAT workspace setting
    DefaultMCATworkspaceSetting();
    // Store data to an configuration file
    clickStoreData();

}

/***************************************************************************//*!
* @function clickSettingCancel()
* @brief    return from setting to MCAT ignoring all changes done in setting page 
* @param
* @return   None
* @remarks 
*******************************************************************************/     
function clickSettingCancel()
{
  // Re-set the MCAT enviroment / windows to default
  DefaultMCATworkspaceSetting();

// Reload data from a MCAT Setting Config file to a Seeting workspace 
// to cancel all changes done in setting page
paramFileReadData('Setting_');  

unlockApplyButton();
// make the Tab menu visible -> leave the setting page
unhideTabMenu();
}

/***************************************************************************//*!
* @function build3MotTabMenu()
* @brief    Function to build the matrix of checkboxes for 3motors and set of Tabs
*           Tabs are defined in an array tabNames[] 
* @param    none
* @return   string
*******************************************************************************/ 
 function build3MotTabMenu(){
    var string = '<tr>';

    for(var i=0;i<tabNames.length;i++){
        
        if (i===1){
            string = string + '<td disabled class=\"AppSet-select_FOC\" style=\"text-align:left;\">'+tabNames[i]+'</td>';
            string = string + '<td disabled class=\"AppSet-MenuTdWidth\"><input id=\"M1_CB'+[i]+'\" type=\"checkbox\" onclick = \"checkboxClick(1)\" \n\
                                title=\"Not available in MCAT 1.1.0\"></td>';
            string = string + '<td disabled class=\"AppSet-MenuTdWidth\"><input id=\"M2_CB'+[i]+'\" type=\"checkbox\" onclick = \"checkboxClick(2)\" \n\
                                title=\"Not available in MCAT 1.1.0\"></td>'; 
            string = string + '<td disabled class=\"AppSet-MenuTdWidth\"><input id=\"M3_CB'+[i]+'\" type=\"checkbox\" onclick = \"checkboxClick(3)\" \n\
                                title=\"Not available in MCAT 1.1.0\"></td>';
        }
        else{
            string = string + '<td class=\"AppSet-select_FOC\" style=\"text-align:left;\">'+tabNames[i]+'</td>';
            string = string + '<td class=\"AppSet-MenuTdWidth\"><input id=\"M1_CB'+[i]+'\" type=\"checkbox\" onclick = \"checkboxClick(1)\"></td>';
            string = string + '<td class=\"AppSet-MenuTdWidth\"><input id=\"M2_CB'+[i]+'\" type=\"checkbox\" onclick = \"checkboxClick(2)\"></td>';
            string = string + '<td class=\"AppSet-MenuTdWidth\"><input id=\"M3_CB'+[i]+'\" type=\"checkbox\" onclick = \"checkboxClick(3)\"></td>';
        }
        string = string + '</tr>';  
    } 
    
    // i=1  => CheckBox for Parameter identification
    

    return (string);
 }                   

/***************************************************************************//*!
* @function buildLineSeparator(lineName,id, option)
* @brief    Function to display blank line with a name
* @param    lineName - headline/name of the control loop
* @return   string
*******************************************************************************/ 
function buildLineSeparator(lineName){
var string = '<tr>';
string = string + '<td style=\"font-weight:bold;\" colspan=\"4\" class=\"AppSet-select\">'+lineName+'</td>';
string = string + '</tr>';

return (string);
}
/* same as "buildLineSeparator()" but with font-weight: normal*/
function buildLineSeparatorNormal(lineName){
var string = '<tr>';
string = string + '<td style=\"font-weight:normal;\" colspan=\"4\" class=\"AppSet-select\">'+lineName+'</td>';
string = string + '</tr>';

return (string);
}
/***************************************************************************//*!
* @function build3MotHeadline(lineName,id, option)
* @brief    Function to display Motor1 | Motor 2 | Motor 3 
* @param    none
* @return   string
*******************************************************************************/ 
function build3MotHeadline(){
var string = '<tr>';

string = string + "<td></td>";
string = string + "<td class=\"TabMenu-checkbox\" style=\"font-weight:bold; text-align: center;\">Motor 1</td>";
string = string + "<td class=\"TabMenu-checkbox\" style=\"font-weight:bold; text-align: center;\">Motor 2</td>";
string = string + "<td class=\"TabMenu-checkbox\" style=\"font-weight:bold; text-align: center;\">Motor 3</td>";
string = string + '</tr>';

return (string);
}

/***************************************************************************//*!
* @function build3MotDropdown(lineName,id, option)
* @brief    Function to display a line with a name and 3x drobdown list for all 
*           three motors.
* @param    lineName - name of the drobdown list to be displayed (PI controller, Feedforward...)
*           id       - identificator of displayed line 
*           option   - array - options for drobdown menu
* @return   string
*******************************************************************************/ 
function build3MotDropdown(lineName,id, option){
var string = '<tr>';

string = string + '<td class=\"AppSet-select_FOC\">'+lineName+'</td>';
string = string + "<td class=\"AppSet-MenuTdWidth\"><select class=\"AppSet-option_FOC\" id=\"M1_"+[id]+"\" size=\"1\" onchange=\"dropdownChange(this.id, this.value)\">";
      for (var i=0;i<option.length;i++)
      string = string + "<option value=\""+[option[i]]+"\">"+[option[i]]+"</option>"; 
string = string + "</select></td>";      

string = string + "<td class=\"AppSet-MenuTdWidth\"><select class=\"AppSet-option_FOC\"  id=\"M2_"+[id]+"\" size=\"1\" onchange=\"dropdownChange(this.id, this.value)\">";
      for (var i=0;i<option.length;i++)
      string = string + "<option value=\""+[option[i]]+"\">"+[option[i]]+"</option>"; 
string = string + "</select></td>";  

string = string + "<td class=\"AppSet-MenuTdWidth\"><select class=\"AppSet-option_FOC\"  id=\"M3_"+[id]+"\" size=\"1\" onchange=\"dropdownChange(this.id, this.value)\">";
      for (var i=0;i<option.length;i++)
      string = string + "<option value=\""+[option[i]]+"\">"+[option[i]]+"</option>"; 
string = string + "</select></td>";  


string = string + '</tr>';

return (string);
}

/***************************************************************************//*!
* @function build3MotCheckbox(lineName)
* @brief    Function to display one line with a element name and 3x checkboxes for all 
*           three motors.
* @param    lineName - name of the FOC element to be displayed (PI controller, Feedforward...)
* @return   string
*******************************************************************************/ 
function build3MotCheckbox(lineName){
var string = '<tr>';

// checkbox id reconstructed from a line name => "Mx_lineName"
var id = lineName;

string = string + '<td  class=\"AppSet-select_FOC\">'+lineName+'</td>';

string = string + "<td class=\"Sensors-checkbox\"><input id=\"M1_"+[id]+"\" type=\"checkbox\" onclick = \"checkboxClick('1')\"></td>";
string = string + "<td class=\"Sensors-checkbox\"><input id=\"M2_"+[id]+"\" type=\"checkbox\" onclick = \"checkboxClick('2')\"></td>";
string = string + "<td class=\"Sensors-checkbox\"><input id=\"M3_"+[id]+"\" type=\"checkbox\" onclick = \"checkboxClick('3')\"></td>";  

string = string + '</tr>';

return (string);
}

/***************************************************************************//*!
* @function buildSensorField()
* @brief    function forms a fiels of sensors available for a given application.
*           Sensors are specified in the array "sensorGroup[]"
* @param    none  
* @remark   build3MotCheckboxElement(name) - create a checkbox line for all three motors
* @returns {String}
 *******************************************************************************/ 
function buildSensorField(){
    
  var noOfSensors = sensorsGroup.length;
  var string = "";
  
  for(var i=0;i<noOfSensors;i++)
  string = string + build3MotCheckbox(sensorsGroup[i]);

return (string);
}

/***************************************************************************//*!
* @function browseDirectory()
* @brief    callback function - Browse button onclick event - Setting Page/General,
*           makes the project path select window visible
* @param    none    
* @returns  {undefined}
*******************************************************************************/ 
function browseDirectory()
{
   var object  = document.getElementById('projectPathFrameSelect');
         
   object.style.display  = "block";
   object.src            = 'form_PathSelector.html';
   
   unlockApplyButton();
}

/***************************************************************************
 * @function    dropdownChange(id, value)
 * @brief       callback function - drobdown menu on-change. 
 * @param {type} id - identificator of the <select> 
 * @param {type} value - new value 
 * @returns {undefined}
 ****************************************************************************/
function dropdownChange(id, value){
    // id of <select> is equal to id of the cell in the MainPage table
    var object  = parent.document.getElementById(id);
    // write the value to MainPage table
    object.innerText = value;

    // if id = Arithmetic, change the MA filter type according to selected Arithmetic
    // if Float => MAF with lambda parameter, if Fix => MAF with n-sample parameter
    if(id==="Arithmetic"){
        var ArithmeticType  = document.getElementById("Arithmetic").options.value;  
        var NoOfMotors      = document.getElementById("MotorsNo").selectedIndex;  

        // Filter dropdown menu modification according to selected arithmetic.
        // Float does support only filter MA with lambda parameter, Frac only MA with n-sample parameter
        for(var i=1;i<(NoOfMotors+2);i++){
            var WFilter = document.getElementById("M"+[i]+"_WFilt");//.getElementsByTagName("option"); 
            var WFilterParent = parent.document.getElementById("M"+[i]+"_WFilt");

            if(ArithmeticType === 'Float'){
                WFilterParent.innerText = WFilter.options[2].value;}
            else{
                WFilterParent.innerText = WFilter.options[1].value;}
        }    
    }    
    if(id==="M1type"){
       parent.document.getElementById('M1type').innerText = value; 
       parent.document.getElementById('M2type').innerText = value; 
       parent.document.getElementById('M3type').innerText = value; 
    }
        
   // if any change happen, unlock the apply button
   unlockApplyButton();    
}

/***************************************************************************
 * @function    checkboxClick(MotorNo)
 * @brief       callback function - checkbox on-click. 
 * @param {type} MotorNo - 1, 2 or 3
 * @returns {undefined}
 ****************************************************************************/
function checkboxClick(MotorNo){
    var Mx_PospeFbck    = parent.document.getElementById('M'+MotorNo+"_PospeFbck");  
    var Mx_TabManager   = parent.document.getElementById('M'+MotorNo+"_TabManager");  
    var liObjectSet     = document.getElementById('AppSet-menu-items').getElementsByTagName('a');
    var liObjectMain    = parent.document.getElementById('tabMotor'+[MotorNo]).getElementsByTagName('a');    
    var noOfSensors     = sensorsGroup.length;
    var noOfTabs        = tabNames.length;
    
    var PospeFbck = 0;
    var TabManager = 0;
    
    // get the name of active tab in the setting menu
    for (var i=0;i<(liObjectSet.length-1);i++){
        // (liObjectSet.length-1) - becasue there is one dummy liObjectSet in the vert. menu
        if (liObjectSet[i].className === "active")
            var activeLiObj = liObjectSet[i].innerHTML;
    }
    
    // if "Sensors" menu active, get DEC code of selected sensors for individual motors
    if(activeLiObj === "Sensors"){
        for (var i=0;i<noOfSensors;i++){
            var sensor  = document.getElementById('M'+MotorNo+"_"+sensorsGroup[i]);
            var checkStatus = sensor.checked;
            PospeFbck = PospeFbck + Math.pow(2,i)*checkStatus;
        }
        // write the result to MainPage table
        Mx_PospeFbck.innerText = PospeFbck;
    }
    
    // if "Tab menu" menu active, get DEC code of selected tab for individual motors
    if(activeLiObj === "Tab menu"){
        for (var i=0;i<noOfTabs;i++){
            var tab  = document.getElementById('M'+MotorNo+"_CB"+[i]);
            var checkStatus = tab.checked;
            TabManager = TabManager + Math.pow(2,i)*checkStatus;
            
            liObjectMain[i].style.display = 'none'; 
            
            if(checkStatus) liObjectMain[i].style.display = '';      
            else            liObjectMain[i].style.display = 'none'; 
        }
        // write the result to MainPage table
        Mx_TabManager.innerText = TabManager;
   }
   
   
   // if any change happen, unlock the apply button
   unlockApplyButton();
}

/***************************************************************************
 * @function    checkboxClick(MotorNo)
 * @brief       callback function - checkbox on-click. 
 * @param {type} MotorNo - 1, 2 or 3
 * @returns {undefined}
 ****************************************************************************/
function unlockApplyButton(){
    var obj = document.getElementById('Apply_button');
    
    obj.className = 'fButtonsEnabled';
    obj.disabled  = '';
}

function lockApplyButton(){
    var obj = document.getElementById('Apply_button');
    
    obj.className = 'fButtonsDisabled';
    obj.disabled  = 'true';
}
/*****************************************************************************
* End of file: inner_AppSetting.js
****************************************************************************/