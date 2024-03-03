
/** Get the wavelength of light from the slider */
function getWavelengthofLight(scope) {
	light_wavelength = scope.wavelength_light = scope.wavelengthoflight;	
	switch (light_wavelength > 100) {
		/** Finding the wavelength of light between different ranges */
		case (light_wavelength >= 100) && (light_wavelength < 380): /** Between 100 and 380 white colour */
			getChild("light").alpha=0.1+0.8/(382-light_wavelength); /** Here, we considering UV light as light violet */
			break; 
		case (light_wavelength >= 380) && (light_wavelength < 449): /** Between 380 and 449 violet colour */
			red = (410 - light_wavelength) / (449 - 380)*255; /** Equation is used for colour transition */
            green = 0;
            blue = 255;
			break;
		case (light_wavelength >= 449) && (light_wavelength < 476): /** Between 449 and 476 blue colour */
			red = 0;
			green = (light_wavelength - 449) / (476 - 449)*255; /** Equation is used for colour transition */
			blue = 255;	
			break;
		case (light_wavelength >= 476) && (light_wavelength < 495): /** Between 476 and 495 cyan colour */
			red = 0;
			green = 255;
			blue = (495 - light_wavelength) / (495 - 476)*255; /** Equation is used for colour transition */	
			break;
		case (light_wavelength >= 495) && (light_wavelength < 570): /** Between 495 and 570 green colour */
			red = (light_wavelength - 495) / (570 - 495)*255; /** Equation is used for colour transition */
			green = 255;
			blue = 0;	
			break;
		case (light_wavelength >= 570) && (light_wavelength < 620): /** Between 570 and 590 yellow colour */
			red = 255;
			green = (620 - light_wavelength) / (620 - 570)*255; /** Equation is used for colour transition */	
			blue = 0;	
			break;
		case (light_wavelength >= 620) && (light_wavelength <= 750): /** Between 620 and 750 red colour */
			red = 255;
			green = 0;
			blue = 0;	
			break;		
	}	
	changeWavelength(red,green,blue);
	calculation(scope);
	photo_electric_stage.update();
}

/** Function to change the wavelength of light */
function changeWavelength(red, green, blue) {
    var filter = new createjs.ColorFilter(0, 0, 0, 1, red, green, blue, 0); /** ColorFilter is used for colour transformation */
    getChild("light").filters = [filter];
    getChild("light").cache(0, 0, getChild("light").getBounds().width, getChild("light").getBounds().height);
    getChild("light").x = getChild("light").y = 0;
    photo_electric_stage.update();
}

/** Get the intensity of light from the slider */
function getIntensityofLight(scope) {
	light_intensity = scope.intensity_light = scope.intensityoflight; /** Setting the slider value to the label variable */		
	/** Calculated the variation of intensity of light, where alpha_val = initial_val+(light_intensity/200-0.45),
	here intensity_temp_rate1 and intensity_temp_rate2 are the constant values */
	alpha_val = initial_val+(light_intensity/INTENSITY_TEMP_RATE1-INTENSITY_TEMP_RATE2); 
	getChild("light").alpha = alpha_val;
	calculation(scope);
	photo_electric_stage.update();
}

/** Get the calculations from the slider */
function calculation(scope) { 
	/** Calculated the applied frequency = c/l, where c is the velocity of light and lambda is the wavelength */ 
	applied_frequency = VELOCITY_LIGHT/(light_wavelength*Math.pow(10,-9));	
	/** Calculated the threshold frequency = we/h, where w is work function, e is electronvolt and h is plancks constant,
	here work function is a material that we chosen from the dropdown */
	threshold_frequency = work_function/(PLANCK_CONSTANT)*ELECTRON_VOLT;
	/** Calculated the stopping potential = h(u-u0)/e, where u is applied frequency, u0 is threshold frequency and e is electronvolt */
	stopping_potential = PLANCK_CONSTANT*(applied_frequency - threshold_frequency)/ELECTRON_VOLT;
	/** Calculated the saturation current = K x η x A , where k is intensity of light, A is area of plate and η = 10, a constant */		
	saturation_current = light_intensity * 10 * plate_area * Math.pow(10,-4);
	/** voltage stopping potential is the sum of voltage and stopping potential, if it is less than '0' then the ammeter value also become '0',
	if voltage stopping potential is greater than '0' then the ammeter value = voltage stopping potential * saturation_current * 1000 (converting ammeter(A) into micro-ammeter (µA)) */
	voltage_stopping_potential = voltage + stopping_potential;
	( voltage_stopping_potential < 0 )?ammeter_reading = 0:ammeter_reading = voltage_stopping_potential * saturation_current * 1000;
	if(startFlag){	
		/** Check the ammeter reading, if it is between 0 and 9 then append the value 0 with ammeter reading, otherwise do the calculation value */
		((ammeter_reading >= 0)&&(ammeter_reading < 9))?getChild("ammeter_display").text = "0"+ammeter_reading.toFixed(2):getChild("ammeter_display").text = ammeter_reading.toFixed(2);
		/** Check the voltage value, if it is 0 then set text value to 00.00, otherwise do the calculation value */
		(voltage!=0)?getChild("voltage_display").text = voltage.toFixed(2):getChild("voltage_display").text = "00.00";	
	}
	photo_electric_stage.update();
}	

