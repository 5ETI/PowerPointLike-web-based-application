angular.module('commServices', []).factory('comm',commFnc);
commFnc.$inject=['$http','$q', 'factory'];

function commFnc($http,$q, factory){
	var comm = {
		loadImages:       loadImages,
		loadPres:          loadPres,
		savePres:      savePres

	};

	function loadImages(presName,presID){
		var payload = {};
		var deferred = $q.defer();
		setInterval(function(presName,presID){
			
			var cont = factory.contentCreation('img 0', 'test ', 'img/0.jpg');
			var key = cont.id;
			payload[key] = cont;
			var cont = factory.contentCreation('img 1', 'test ', 'img/0.png');
			var key = cont.id;
			payload[key] = cont;

			var cont = factory.contentCreation('img 2', 'test ', 'img/10.jpg');
			var key = cont.id;
			payload[key] = cont;
			
			deferred.resolve(payload);
			 // }else{
			// 	deferred.reject(status);
			// }
			clearInterval(this);
		},3000,presName,presID);
		
		return deferred.promise;

	};
	function loadPres(presName,presID){
		var pres = {};
		var deferred = $q.defer();
		setInterval(function(presName,presID){
			pres["1"] = factory.presentationCreation(presName,presID);
			deferred.resolve(pres);
			// }else{
			// 	deferred.reject(status);
			// }
			clearInterval(this);
		},3000,presName,presID);
		
		return deferred.promise;
} ;
	function savePres(presName,presID){
		return null;
	}
return comm;   
};
