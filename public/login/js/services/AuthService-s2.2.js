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
	
	function localAuthAsk(login,pwd){
		var deferred = $q.defer();


		setInterval(function(login,pwd){
			if( userMap[login].pwd==pwd){
				var data={'login':login,'role':userMap[login].role,'validAuth':true};
				return deferred.resolve(data);
			}else{
				return deferred.reject(status);
			}
			clearInterval(this);
		},3000,login,pwd);
		
		return deferred.promise;
	}
	
	return fncContainer;
}