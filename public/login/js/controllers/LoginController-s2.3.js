angular.module('loginApp').controller('loginCtrl',loginCrtFnt);

loginCrtFnt.$inject=['$scope','$log','auth','$window'];

function loginCrtFnt($scope, $log, auth, $window){
	
	$scope.logAuth = function() {
		$log.info('user login', $scope.user.login);
		$log.info('user pwd', $scope.user.pwd);


		var futurContent=auth.localAuthAsk($scope.user.login,$scope.user.pwd);
		futurContent.then(
			function(payload){
				if(payload.validAuth && payload.role == 'admin')
					$window.location.href = 'admin.html';
				if(payload.validAuth && payload.role == 'watcher')
					$window.location.href = 'watcher.html';
			},
			function(errorPayload){

			});

	};


	$scope.logAuthObject = function(user) {
		$log.info('user login', user.login);
		$log.info('user pwd', user.pwd);
	};

}