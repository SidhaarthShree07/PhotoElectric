(function(){
    angular
    .module('users',['FBAngular'])
    .controller('UserController', [
        '$mdSidenav', '$mdBottomSheet', '$log', '$q','$scope','$element','Fullscreen','$mdToast','$animate',
        UserController
    ]);
    /**
    * Main Controller for the Angular Material Starter App
    * @param $scope
    * @param $mdSidenav
    * @param avatarsService
    * @constructor
    */
    function UserController( $mdSidenav, $mdBottomSheet, $log, $q, $scope, $element, Fullscreen, $mdToast, $animate, $translate, dialogs) {
        $scope.toastPosition = {
            bottom: true,
            top: false,
            left: true,
            right: false
        };
        $scope.toggleSidenav = function(ev) {
            $mdSidenav('right').toggle();
        };
        $scope.getToastPosition = function() {
            return Object.keys($scope.toastPosition)
            .filter(function(pos) { return $scope.toastPosition[pos]; })
            .join(' ');
        };
        $scope.showActionToast = function() {     
            var toast = $mdToast.simple()
            .content(help_array[0])
            .action(help_array[4])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
        
            var toast1 = $mdToast.simple()
            .content(help_array[1])
            .action(help_array[4])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
          
            var toast2 = $mdToast.simple()
            .content(help_array[2])
            .action(help_array[4])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
            var toast3 = $mdToast.simple()
            .content(help_array[3])
            .action(help_array[5])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
       
			/**for displaying help in the template*/
			$mdToast.show(toast).then(function() {
				$mdToast.show(toast1).then(function() {
					$mdToast.show(toast2).then(function() {
						$mdToast.show(toast3).then(function() {
					});
				});
			});
		});
	};
  
	var self = this;
	self.selected     = null;
	self.users        = [ ];
	self.toggleList   = toggleUsersList;

	$scope.showVariables = false; /** I hides the 'Variables' tab */
	$scope.isActive = true;
	$scope.isActive1 = true; 
	
	$scope.goFullscreen = function () {
		/** Full screen */
		if (Fullscreen.isEnabled())
			Fullscreen.cancel();
		else
			Fullscreen.all();
		/** Set Full screen to a specific element (bad practice) */
		/** Full screen.enable( document.getElementById('img') ) */
	};
	
	$scope.resetExperiment = function() {
	$mdToast.cancel();
	resetExperiment($scope);
	}

	$scope.toggle = function () {
		$scope.showValue=!$scope.showValue;
		$scope.isActive = !$scope.isActive;
	};  
	
	$scope.toggle1 = function () {
		$scope.showVariables=!$scope.showVariables;
		$scope.isActive1 = !$scope.isActive1;
	};
		   
	/** slider area of plate */
	$scope.changeAreaofplate =  function() {
		plate_area = $scope.area_num = $scope.areaofNum;	
		calculation($scope);
	}
	
	/** slider intensity of light */
	$scope.changeIntensityoflight = function() {
		getIntensityofLight($scope);
	}
	
	/** slider voltage applied */
	$scope.changeVoltageapplied = function() {			
		voltage = $scope.voltage_app = $scope.voltageapplied;
		calculation($scope);
	}
	
	/** slider wavelength of light */
	$scope.changeWavelengthoflight = function() {
		getWavelengthofLight($scope);
	}
	
	/** Function for the dropdown list */
	$scope.changePhotoelectric = function() {
		work_function = work_function_array[$scope.PhotoelectricModel-1];
		calculation($scope);
	}
		
	/** Function for toggle the button */
	$scope.switchon = function() {	
		startExperiment($scope);
	}
	
	/**
	* First hide the bottom sheet IF visible, then
	* hide or Show the 'left' sideNav area
	*/
	function toggleUsersList() {
		$mdSidenav('right').toggle();
	}
}
})();