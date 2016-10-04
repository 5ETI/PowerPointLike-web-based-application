angular.module('loginApp').controller('loginCtrl',loginCrtFnt);

loginCrtFnt.$inject=['$scope','$log','auth','$window'];

function loginCrtFnt($scope, $log, auth, $window){
	
	$scope.logAuth = function() {
		$log.info('user login', $scope.user.login);
		$log.info('user pwd', $scope.user.pwd);

		$log.info('user list', auth.userList())

		if( auth.checkUser($scope.user.login,$scope.user.pwd))
			$window.location.href = 'loginSuccess.html';

	};


	$scope.logAuthObject = function(user) {
		$log.info('user login', user.login);
		$log.info('user pwd', user.pwd);
	};

}