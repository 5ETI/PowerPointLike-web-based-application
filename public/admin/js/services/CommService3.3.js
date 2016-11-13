angular.module('commServices', []).factory('comm',commFnc);
commFnc.$inject=['$http','$q','$log','$filter','factory'];

function commFnc($http,$q, $log,$filter, factory){
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
		},500,presName,presID);
		
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
		},500,presName,presID);

	return deferred.promise;
//// ************  FOR WHEN NODEJS SERVER READY  ******************  ////////
// 	var deferred = $q.defer();
// 	$http.get('/loadPres').
// 	success(function(data, status, headers, config) {
// 		deferred.resolve(data);
// 	}).
// 	error(function(data, status, headers, config) {
// 		deferred.reject(status);
// // or server returns response with an error status.
// });
// 	return deferred.promise;
// }
} ;


function savePres(presName,presID){
	var presToSend=$filter('json')($scope.currentPresentation);
	var deferred = $q.defer();
	$http.post('/savePres', presToSend)
	.success(function (data, status, headers, config) {
		deferred.resolve(data);
		alert('Presentation Saved');
	})
	.error(function (data, status, header, config) {
		deferred.reject(status);
		alert('Error connection server');
		$log.error(status); 
	});

	return deferred.promise;
};



comm.io = {};
comm.io.socketConnection=function(scope,uuid){
	var socket = io.connect('http://localhost:1337');
	comm.io.uuid = uuid;
	alert("socket connection");
	socket.on('connection', function () {
		socket.emit('data_comm',{'id':comm.io.uuid});
	});
	socket.on('slidEvent', function (socket) {
	});
	return socket;
};

comm.io.emitBegin=function(socket){
	socket.emit('slidEvent', {'CMD':"BEGIN"});
	$log.info("comm.io.emitBegin : slidEvent BEGIN");

}
comm.io.emitPrev=function(socket){
	socket.emit('slidEvent', {'CMD':"PREV"});
	$log.info("comm.io.emitPrev : slidEvent PREV");
}
comm.io.emitStart=function(socket,presUUID){
	socket.emit('slidEvent', {'CMD':"START",'PRES_ID':presUUID});
	$log.info("comm.io.emitStart : slidEvent START");

}
comm.io.emitPause=function(socket){
	socket.emit('slidEvent', {'CMD':"PAUSE"});
	$log.info("comm.io.emitPause : slidEvent PAUSE");

}
comm.io.emitNext=function(socket){
	socket.emit('slidEvent', {'CMD':"NEXT"});
	$log.info("comm.io.emitNext : slidEvent NEXT");

}
comm.io.emitEnd=function(socket){
	socket.emit('slidEvent', {'CMD':"END"});
	$log.info("comm.io.emitEnd : slidEvent END");

}
return comm;
};
