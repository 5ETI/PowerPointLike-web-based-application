angular.module('commServices', []).factory('comm',commFnc);
commFnc.$inject=['$http','$q','$log','$filter','factory'];

function commFnc($http,$q, $log,$filter, factory){
	var comm = {
		loadImages:       loadImages,
		loadPres:          loadPres,
		savePres:      savePres

	};


	function addImage(content){
		var payload = {};
		var deferred = $q.defer();

		// TODO here create data
		$http.post('/slids')//Envoyer l'id de la pres ici?!
			.success(function(data, status, headers, config) {
				$log.info("add a data image on server: " + data);

				deferred.resolve(data);
			})
			.error(function(data, status, headers, config) {
				deferred.reject(status);
		// or server returns response with an error status.
			});
			return deferred.promise;

	};

	function loadImages(presName,presID){
		var payload = {};
		var deferred = $q.defer();
		$http.get('/slids')//Envoyer l'id de la pres ici?!
			.success(function(data, status, headers, config) {
				$log.info("load image datas: " + data);
				//here parse json in contents formats, and add to payload like above (but in a for on data parsed list)
				var parsedContents = angular.fromJson(data);
				for (i=0; i<parsedContents.lenght() -1 ; i++)
				{
					var cont = factory.contentCreation(parsedContents[i].title,parsedContents[i].type,parsedContents[i].src);
			 		var key = cont.id;
				 	payload[key] = cont;
				 }

				deferred.resolve(payload);
			})
			.error(function(data, status, headers, config) {
				$log.error(status);
				deferred.reject(status);
		// or server returns response with an error status.
			});
			return deferred.promise;



					//TODO Ici get a /slids pour recup les contents (celui ci les copie dans le repertoire /public/img)





		// setInterval(function(presName,presID){
		// 	var cont = factory.contentCreation('img 0', 'test ', 'img/0.jpg');
		// 	var key = cont.id;
		// 	payload[key] = cont;
		// 	var cont = factory.contentCreation('img 1', 'test ', 'img/0.png');
		// 	var key = cont.id;
		// 	payload[key] = cont;

		// 	var cont = factory.contentCreation('img 2', 'test ', 'img/10.jpg');
		// 	var key = cont.id;
		// 	payload[key] = cont;
			
		// 	deferred.resolve(payload);
		// 	// }else{
		// 	// 	deferred.reject(status);
		// 	// }
		// 	clearInterval(this);
		// },500,presName,presID);
		
		// return deferred.promise;
};



function loadPres(presName,presID){
	// var pres = {};
	// var deferred = $q.defer();
	// setInterval(function(presName,presID){
	// 	pres["1"] = factory.presentationCreation(presName,presID);
	// 	deferred.resolve(pres);
	// 		// }else{
	// 		// 	deferred.reject(status);
	// 		// }
	// 		clearInterval(this);
	// 	},500,presName,presID);

	// return deferred.promise;
//// ************  FOR WHEN NODEJS SERVER READY  ******************  ////////
	var deferred = $q.defer();
	$http.get('/loadPres')//Envoyer l'id de la pres ici?!
	.success(function(data, status, headers, config) {
		deferred.resolve(data);
	})
	.error(function(data, status, headers, config) {
		deferred.reject(status);
// or server returns response with an error status.
	});
	return deferred.promise;
};


function savePres(presName,presID){
	// Here add presID to json file?
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
	//alert("socket connection");
	socket.on('connection', function () {
		socket.emit('data_comm',{'id':comm.io.uuid});
	});
	socket.on('currentSlidEvent', function (data) {
		scope.updateSlid(data.pres_id, data.slid);
	});
	return socket;
};
};
