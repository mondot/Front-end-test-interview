'use strict';

var users = [];
var files = [];

// VALIDATIONS

//We use the regular expression to verify the email (because input[email] required accepts test@test, which is not valid)
var isEmailValid = function(user) {
		var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(user.email);
}

var isUserValid = function(user) {
  return (user.firstName && user.lastName && user.email);
}

//Second validation, already done by input[file] accept[image/jpeg, image/png]
var isFileValid = function(fileID) {
		var exts = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];
    var fileName = document.getElementById(fileID).value;
    return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
}

// PREVIEW OF THE FILE CHOSEN AND DISPLAY OF THE SUBMIT BUTTON

function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#picture').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#fileID").change(function(){
    readURL(this);

    var controllerElement = document.querySelector('#upload-file-container');
		var controllerScope = angular.element(controllerElement).scope();
		controllerScope.fileForm.$dirty = true;
});

// ANGULAR MODULE

var pictureUploaderApp = angular.module('pictureUploaderApp', []);

	// USERFORM CONTROLLER

	pictureUploaderApp.controller('AddInfoController', ['$scope', function($scope) {
    $scope.users = users;
  	$scope.addInfo = function(user) {
  		if (isUserValid(user) && isEmailValid(user)) {
  			$.ajax({type: 'POST',url: '/api/user',data: user,async: false,cache: false})
  				.done(function(){
  					$scope.users.push(user);
  					$scope.successTextAlert = "Your profile has been successfully created. \nNow upload your picture, \nwe want to see your face on it :)";
    				$scope.showSuccessAlert = true;
    				$scope.switchBool = function (value) {
    				        $scope[value] = !$scope[value];
    				    	};

  					var controllerElement = document.querySelector('#upload-file-container');
						var controllerScope = angular.element(controllerElement).scope();
						controllerScope.fileForm.$pristine = false; //permits to display the label 'Upload your picture'

  				})
  				.fail(function(){ 
  					window.alert("Server answered back : Error");
  				})
  		}

  		else {
  			window.alert("Please verify your email.");
  		}
    };

	}]);
	
	//UPLOADFILECONTROLLER

	//directive to gain access to the file object in our controller
	pictureUploaderApp.directive('fileModel', ['$parse', function ($parse) {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attrs) {
	            var model = $parse(attrs.fileModel);
	            var modelSetter = model.assign;
	            
	            element.bind('change', function(){
	                scope.$apply(function(){
	                    modelSetter(scope, element[0].files[0]);
	                });
	            });
	        }
	    };
	}]);

	//pass the file object and the url to a service. We override some of Angular’s default behavior
	pictureUploaderApp.service('fileUpload', ['$http', function ($http) {
	    this.uploadFileToUrl = function(file, uploadUrl,$scope){
	    	if (isFileValid('fileID')){
	    		$scope.files = files;
	    		var fd = new FormData();
	    		fd.append('file', file);
	    		$http.post(uploadUrl, fd, {
	    		    transformRequest: angular.identity,
	    		    headers: {'Content-Type': undefined}
	    		})
	    		.success(function(){
	        	$scope.files.push(file);
  					$scope.successTextAlert = "Nice face! \nYour profile has been successfully updated.";
    				$scope.showSuccessAlert = true;
    				$scope.switchBool = function (value) {
    				        $scope[value] = !$scope[value];
    				    	};
    				$("#success-alert").slideUp(500, function(){
							$("#success-alert").alert('close');
						});
	    		})
	    		.error(function(){
	    			window.alert("No face detected. \nPlease use a profile picture with a face.");
	    		});
	    	}

	    	else {
	    		window.alert("Please use JPEG OR PNG file.");
	    	}
	    }
		}]);

	//we call the previous service in our controller
	pictureUploaderApp.controller('UploadFileController', ['$scope', 'fileUpload', function($scope, fileUpload){
	   	  $scope.uploadFile = function(){
	      var file = $scope.myFile;
	      var uploadUrl = "/api/user/picture";
	      fileUpload.uploadFileToUrl(file, uploadUrl,$scope);
	    };
	    
	}]);