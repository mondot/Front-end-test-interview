'use strict';

var users = [];

var isEmailValid = function(user) {
		var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(user.email);
}

var isUserValid = function(user) {
  return (user.firstName && user.lastName && user.email);
}


angular.module('pictureUploaderApp', [])

	.controller('AddInfoController', ['$scope', function($scope) {
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

	}])

	.directive('fileModel', ['$parse', function ($parse) {
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
	}])

	.controller('UploadFileController', ['$scope', function($scope) {

		$scope.addFile = function() { 
				var file = $scope.myFile;
				console.log('file is ' );
        console.dir(file);
        debugger
				$.ajax({type: 'POST',url: '/api/user/picture',headers: {'Content-Type': undefined},transformRequest: function (data) { return new FormData().append('file', data.file); },data: {file: file}})
					.done(function(){
						debugger
						window.alert("Your profile has been created.");
					})
					.fail(function(){ 
						window.alert("Server answered back : Error");
					})
	  };

	}]);