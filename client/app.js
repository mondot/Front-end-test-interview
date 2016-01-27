'use strict';

var users = [];

var isEmailValid = function(user) {
		var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(user.email);
}

var isUserValid = function(user) {
  return (user.firstName && user.lastName && user.email);
}

var isFileValid = function(fileID) {
		var exts = ['.jpg', '.jpeg', '.png'];
    var fileName = document.getElementById(fileID).value;
    return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
}

var pictureUploaderApp = angular.module('pictureUploaderApp', []);

	pictureUploaderApp.controller('AddInfoController', ['$scope', function($scope) {
    $scope.users = users;
  	$scope.addInfo = function(user) {
  		if (isUserValid(user) && isEmailValid(user)) {
  			$.ajax({type: 'POST',url: '/api/user',data: user,async: false,cache: false})
  				.done(function(){
  					$scope.users.push(user);
  					$scope.user = {}
  					window.alert("Your profile has been created.");
  				})
  				.fail(function(){ 
  					window.alert("Server answered back : Error");
  				})
  		}

  		else {
  			window.alert("Please verify your inputs.");
  		}
    };

	}]);
	
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

	pictureUploaderApp.service('fileUpload', ['$http', function ($http) {
	    this.uploadFileToUrl = function(file, uploadUrl){
	    	if (isFileValid('fileID')){
	    		var fd = new FormData();
	    		fd.append('file', file);
	    		$http.post(uploadUrl, fd, {
	    		    transformRequest: angular.identity,
	    		    headers: {'Content-Type': undefined}
	    		})
	    		.success(function(){
	    			window.alert("Your profile has been updated.");
	    		})
	    		.error(function(){
	    			window.alert("Server answered back : no face detected. Please use a profile picture with a face.");
	    		});
	    	}

	    	else {
	    		window.alert("Please use JPEG OR PNG file.");
	    	}
	    }
	}]);

	pictureUploaderApp.controller('UploadFileController', ['$scope', 'fileUpload', function($scope, fileUpload){
	    
	    $scope.uploadFile = function(){
	        var file = $scope.myFile;
	        console.log('file is ' );
	        console.dir(file);
	        var uploadUrl = "/api/user/picture";
	        fileUpload.uploadFileToUrl(file, uploadUrl);
	    };
	    
	}]);