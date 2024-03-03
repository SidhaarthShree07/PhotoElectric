(function() {
    angular
        .module('users')
        .directive("experiment", directiveFunction)
})();

var photo_electric_stage, exp_canvas; 

var plate_area, light_intensity, voltage, light_wavelength;

var startFlag, switchon_var, red, green, blue, initial_val, alpha_val;

var applied_frequency, threshold_frequency, stopping_potential, saturation_current, work_function, ammeter_reading;

var PLANCK_CONSTANT, ELECTRON_VOLT, VELOCITY_LIGHT, INTENSITY_TEMP_RATE1, INTENSITY_TEMP_RATE2;

/** Arrays declarations */
var work_function_array = [];

/** Createjs shapes declarations */

function directiveFunction() {
    return {
        restrict: "A",
        link: function(scope, element, attrs, dialogs) {
            /** Variable that decides if something should be drawn on mouse move */
            var experiment = true;
            if (element[0].width > element[0].height) {
                element[0].width = element[0].height;
                element[0].height = element[0].height;
            } else {
                element[0].width = element[0].width;
                element[0].height = element[0].width;
            }
            if (element[0].offsetWidth > element[0].offsetHeight) {
                element[0].offsetWidth = element[0].offsetHeight;
            } else {
                element[0].offsetWidth = element[0].offsetWidth;
                element[0].offsetHeight = element[0].offsetWidth;
            }
            exp_canvas = document.getElementById("demoCanvas");
            exp_canvas.width = element[0].width;
            exp_canvas.height = element[0].height;

            /** Initialisation of stage */
            photo_electric_stage = new createjs.Stage("demoCanvas");
			queue = new createjs.LoadQueue(true);       
			/** Preloading the images */
			queue.loadManifest([{
				id: "background",
				src: "././images/background.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "bulb",
				src: "././images/bulb.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "equipments",
				src: "././images/equipments.svg",
				type: createjs.LoadQueue.IMAGE
			},{
				id: "light",
				src: "././images/light.svg",
				type: createjs.LoadQueue.IMAGE
			},{
				id: "switchoff",
				src: "././images/switchoff.svg",
				type: createjs.LoadQueue.IMAGE
			},{
				id: "switchon",
				src: "././images/switchon.svg",
				type: createjs.LoadQueue.IMAGE
			}]);           
            queue.on("complete", handleComplete, this);            
            loadingProgress(queue,photo_electric_stage,exp_canvas.width);            
            photo_electric_stage.enableDOMEvents(true);
            photo_electric_stage.enableMouseOver();
            createjs.Touch.enable(photo_electric_stage);
      			
            function handleComplete() { 
                /** Loading images, text and containers */				
				loadImages(queue.getResult("background"), "background", 0, 0, ""); 	
				loadImages(queue.getResult("bulb"), "bulb", 0, 0, ""); 	
				loadImages(queue.getResult("equipments"), "equipments", 0, 0, ""); 
				loadImages(queue.getResult("light"), "light", 0, 0, ""); 			
				loadImages(queue.getResult("switchoff"), "switchoff", 0, 0, "pointer"); 
				loadImages(queue.getResult("switchon"), "switchon", 0, 0, "pointer"); 
				setText("ammeter_display", 520, 463, "", "black", 1.2);
				setText("voltage_display", 88, 512, "", "black", 1.2);
				setText("voltmeter_unit", 146, 512, "", "black", 0.9);
				setText("ammeter_unit", 574, 470, "", "black", 0.8);
				
                initialisationOfVariables(scope); 
                /** Function call for images used in the apparatus visibility */
                initialisationOfImages();
                /** Function call for the initial value of the controls */
                initialisationOfControls(scope);
                /** Translation of strings using gettext */
                translationLabels();
				/** Graph plotting function */
               
					photo_electric_stage.getChildByName("switchoff").on("click",function(){					
					startExperiment(scope);
					scope.$apply();
					photo_electric_stage.update();				
				});
					photo_electric_stage.getChildByName("switchon").on("click",function(){			
					startExperiment(scope);
					scope.$apply();								
				});
				scope.$apply();
				photo_electric_stage.update();	
			}

            /** Add all the strings used for the language translation here. '_' is the short cut for 
            calling the gettext function defined in the gettext-definition.js */
            function translationLabels() { 
                /** This help array shows the hints for this experiment */
                help_array = [_("help1"), _("help2"), _("help3"), _("help4"),_("Next"), _("Close")];
                scope.heading = _("Photo Electric Effect");
                scope.variables = _("Variables");
				scope.copyright = _("copyright");
				scope.choose_material_list = _("Choose Material:");
				scope.area_of_plate = _("Area of Plate");
				scope.intensity_of_light = _("Intensity of Light");
				scope.voltage_applied = _("Voltage Applied");
				scope.Wavelength_of_Light = _("Wavelength of Light");
				scope.centimeter = _("cm");
				scope.woltmeter = _("w/m");
				scope.volt = _("V");
				scope.wavelength = _("nm");
				scope.switchon_txt = switchon_var = _("Switch On Light");
				switchoff_var = _("Switch Off Light");				
				scope.reset_txt = _("Reset");				
				scope.cntrol_disable= true;
                scope.photoelectric_array = [{				
                    photoelectric: _('Copper'),
                    type: 1,
                    index: 0	
                }, {
                    photoelectric: _('Sodium'),
                    type: 2,
                    index: 1
                }, {
                    photoelectric: _('Zinc'),
                    type: 3,
                    index: 2
                }, {
                    photoelectric: _('Platinum'),
                    type: 4,
                    index: 3
                },{
                    photoelectric: _('UnKnown'),
					type: 5,
					index: 4
                }];
			
				photo_electric_stage.update();
            }
        }
    }
	photo_electric_stage.update();
}

/** All the texts loading and added to the natural_convection_stage */
function setText(name, textX, textY, value, color, fontSize) {
    var _text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
    _text.x = textX;
    _text.y = textY;
    _text.textBaseline = "alphabetic";
	if( name=="ammeter_display" || name=="voltage_display" ){
		_text.font = "1.8em digiface";
	}
    _text.name = name;
    _text.text = value;
    _text.color = color;
    photo_electric_stage.addChild(_text); /** Adding text to the container */
}

/** All the images loading and added to the natural_convection_stage */
function loadImages(image, name, xPos, yPos, cursor) {
    var _bitmap = new createjs.Bitmap(image).set({});
    _bitmap.x = xPos;
    _bitmap.y = yPos;
    _bitmap.name = name;
    _bitmap.cursor = cursor;
    photo_electric_stage.addChild(_bitmap); /** Adding bitmap to the container */
}

/** Function to return child element of stage */
function getChild(child_name) {
	return photo_electric_stage.getChildByName(child_name); /** Returns the child element of stage */
} 

/** All variables initialising in this function */
function initialisationOfVariables(scope) {
	/** Setting the slider value to the label variable */	
	scope.areaofNum = scope.area_num = plate_area = 0.1;
	scope.intensityoflight = scope.intensity_light = light_intensity = 5;
	scope.voltageapplied = scope.voltage_app = voltage = 0;	
	scope.wavelengthoflight = scope.wavelength_light = light_wavelength = 100;
	scope.PhotoelectricModel = 1;
	startFlag = false;
	scope.control_disable = true;
	scope.voltageapplied = 0;
	/** Initially we considering UV light as light violet */
	red = 110;
    green = 0;
    blue = 255;
	getChild("light").alpha = 0.1;
	alpha_val = initial_val = 0.5; /** If we change the initial value, alpha value also change */
	getChild("voltage_display").text="";
	getChild("ammeter_display").text="";
	getChild("voltmeter_unit").text="";
	getChild("ammeter_unit").text="";
	PLANCK_CONSTANT = 6.63 * Math.pow(10,-34);
	ELECTRON_VOLT = 1.602 * Math.pow(10,-19);
	VELOCITY_LIGHT = 3 * Math.pow(10,8);
	/** Constant value for find the variation of intensity of light */
	INTENSITY_TEMP_RATE1 = 200;
	INTENSITY_TEMP_RATE2 = 0.45;
	work_function = 4.7;
	ammeter_reading = 0;
	work_function_array = [4.7,2.28,4.3,6.35,2.1];
	photo_electric_stage.update();
}

/** Initialisation of all controls */
function initialisationOfControls(scope) {
    scope.PhotoelectricModel = 1;
	scope.switchon_txt = switchon_var;
}

/** Set the initial status of the images and text depends on its visibility and initial values */
function initialisationOfImages(scope) {
	getChild("switchon").visible = false;
	getChild("switchoff").visible = true;
	getChild("light").visible = false;
}

function startExperiment(scope) {
/** Emulate the simulator by clicking switch on/off button */
	if(startFlag){
		/** When we switch off the button */
		startFlag = false;
		getChild("voltage_display").text="";
		getChild("ammeter_display").text="";
		getChild("voltmeter_unit").text="";
		getChild("ammeter_unit").text="";
		scope.switchon_txt = switchon_var;	
		getChild("switchoff").visible = true;	
		scope.control_disable = true;
	}
	else{
		/** When we switch on the button */ 
		startFlag = true;	
		scope.switchon_txt = switchoff_var;	
		getChild("switchoff").visible = false;
		getChild("voltmeter_unit").text="V";
		getChild("ammeter_unit").text="µA";
		calculation(scope);
		changeWavelength(red, green, blue);	
		scope.control_disable = false;		
	}
	getChild("light").visible = startFlag;
	getChild("switchon").visible = startFlag;				
	photo_electric_stage.update();
}

/** Reset the experiment in the reset button event */
function resetExperiment(scope) {
	initialisationOfVariables(scope);
	initialisationOfControls(scope);
	initialisationOfImages(scope);
	photo_electric_stage.update();
}