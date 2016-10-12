angular.module('authService', []).service('auth',authFnc);

authFnc.$inject=['$http','$q'];

function authFnc($http, $q) {
	
	var userMap={};
	userMap['jdoe']='jdoepwd';
	userMap['psmith']='psmithpwd';
	userMap['tp']='tp';
	userMap['tpwatcher']={'pwd':'tp','role':'watcher'};
	userMap['tpadmin']={'pwd':'tp','role':'admin'};
	
	var fncContainer={
		localAuthAsk:localAuthAsk
	};

	function authAsk(login,pwd){
		var deferred = $q.defer();
		$http.post('/fakeauthwatcher',{'login':login,'pwd':pwd}).
		success(function(data, status, headers, config) {
			var data={'login':login,'role':userMap[login].role,'validAuth':true};
			return deferred.resolve(data);
		}). error(function(data, status, headers, config) {
			return deferred.reject(status);
		});
		return deferred.promise;
	};
	
	return fncContainer;
}