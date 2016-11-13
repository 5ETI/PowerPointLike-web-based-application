angular.module('adminApp').controller('eventCtrl',eventCrtFnt);

eventCrtFnt.$inject=['$scope','$log','$window','factory','comm'];

function eventCrtFnt($scope, $log, $window, factory, comm){


  $scope.currentPresenation=factory.presentationCreation("template_pres","description of the template présentation");

   //CREATE an object for interactions with ng-include controller
   $scope.contentMap = {};
   $scope.contentMap.payload="";

   $scope.presentationMap={};
   $scope.presentationMap.payload="";

   
   var available_content=comm.loadImages('test','test');
   available_content.then(
    function(payload) { 
      $scope.contentMap.payload = payload;
      $scope.contentMap.array=factory.mapToArray(payload);
    },
    function(errorPayload) {
      $log.error('failure loading movie', errorPayload);
    });

   var firstPresentation=comm.loadPres('test','test');
   firstPresentation.then(
    function(payload) { 
      $scope.presentationMap.payload= payload;

      for(key in $scope.presentationMap.payload){
        $scope.currentPresenation =$scope.presentationMap.payload[key];
      }

    },
    function(errorPayload) {
      $log.error('failure loading movie', errorPayload);
    });


    $scope.updateSlid = function(pres_id, slide){
        if(!pres_id) return;
        if($scope.presentationMap.payload[pres_id] === undefined){
            if(pres_id == 1) pres_id = $scope.currentPresentation.id;
            var firstPresentation=comm.loadPres('test','test');
            firstPresentation.then(
              function(payload) { 
                $scope.presentationMap.payload= payload;
                for(key in $scope.presentationMap.payload){
                  $scope.currentPresenation =$scope.presentationMap.payload[key];
                }
              },
              function(errorPayload) {
                $log.error('failure loading movie', errorPayload);
            });
        }
        else{
            if($scope.currentPresentation.id !== pres_id){
                $scope.currentPresentation = $scope.presentationMap.payload[pres_id];
            }
            $scope.currentSlide = slide;
            $scope.$apply();
        }
    }