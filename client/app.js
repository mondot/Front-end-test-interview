'use strict';

var users = [];

angular.module('pictureUploaderApp', [])

  .controller('InformationsListController', ['$scope', function($scope) {
    $scope.users = users;

  	$scope.addInfo = function(user) {
  		$.ajax({type: 'POST',url: '/api/user',data: user,async: false,
        cache: false})
  			.then(function(){
  				$scope.users.push(user);
  				$scope.user = {}
  			})
  			.fail(function(){ console.log('bob')})
    };

  }]);
