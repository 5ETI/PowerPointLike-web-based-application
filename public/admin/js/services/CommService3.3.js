angular.module('commServices', []).factory('comm',commFnc);
commFnc.$inject=['$http','$q','$log','$filter','factory'];

function commFnc($http,$q, $log,$filter, factory){
	var comm = {
		loadImages:       loadImages,
		loadPres:          loadPres,
		savePres:      savePres

	};

	function loadImages(presName,presID){
		var deferred = $q.defer();
        $http.get("/slids")
            .success(function(data){
                if(data)
                    deferred.resolve(data);
                else
                    deferred.reject();
            })
            .error(function(data){
            	log.info("rejected")
                deferred.reject();
            });
        return deferred.promise;
};



function loadPres(){
	var pres = {};
	var presName = "test SavePres";
	var presID = "f2067afa-f2d8-48ee-baa0-254ff21bc4a3";
	/*var deferred = $q.defer();
	setInterval(function(presName,presID){
		pres["1"] = factory.presentationCreation(presName,presID);
		deferred.resolve(pres);
			clearInterval(this);
		},500,presName,presID);

	return deferred.promise;*/
	var deferred = $q.defer();
        $http.get("/loadPres")
            .success(function(data){
                if(data)
                    deferred.resolve(data);
                	$log.info(data)
            })
            .error(function(data){
            	log.info("rejected")
                deferred.reject();
            });
        return deferred.promise;
} ;


function savePres(pres){
	var deferred = $q.defer();
	var presTosend = {pres: pres, pres_id: pres.id, id: pres.id};
	$http.post('/savePres', JSON.stringify(presTosend))
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
