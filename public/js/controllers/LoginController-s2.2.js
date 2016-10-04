angular.module('loginApp').controller('loginCtrl',loginCrtFnt);

loginCrtFnt.$inject=['$scope','$log','auth','$window'];

function loginCrtFnt($scope, $log, auth, $window){
	
	$scope.logAuth = function() {
		$log.info('user login', $scope.user.login);
		$log.info('user pwd', $scope.user.pwd);


		var futurContent=auth.localAuthAsk($scope.user.login,$scope.user.pwd);
		futurContent.then(
				1

				2
			);

		if( )
			$window.location.href = 'loginSuccess.html';

	};


	$scope.logAuthObject = function(user) {
		$log.info('user login', user.login);
		$log.info('user pwd', user.pwd);
	};

}