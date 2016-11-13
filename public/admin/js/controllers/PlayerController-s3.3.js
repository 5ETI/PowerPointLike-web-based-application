angular.module('adminApp').controller('playerCtr',playerCtrFnt);

playerCtrFnt.$inject=['$scope','$log','$window','factory','comm'];

var pauseActivated = false;
function playerCtrFnt($scope,$log,$window,factory,comm){
  var uuid = generateUUID();
  var socket = comm.io.socketConnection($scope, uuid);

  $scope.changeSlid=function(data){

    switch (data){

      case 'first':
      comm.io.emitBegin(socket);
      $log.info("PlayerController : emitBegin");
        // Changes View
        $scope.$parent.currentSlide = $scope.$parent.currentPresenation.slidArray[0];
        break;

        case 'previous':
        var numSlides = $scope.$parent.currentPresenation.slidArray.length;
        for (var i = 0; i < numSlides ; i++) {
          if ($scope.$parent.currentPresenation.slidArray[i].id == $scope.$parent.currentSlide.id && i != 0) {
            $scope.$parent.currentSlide = null;
            var slid = $scope.$parent.currentPresenation.slidArray[i-1];
            $scope.$parent.currentSlide = slid;
            break;
          }
        }
        comm.io.emitPrev(socket);
        $log.info("PlayerController : emitPrev");
        break;

        case 'start':
         // Changes View
         pauseActivated = false;
         $log.info("Play\n\n");
         var x = setInterval(function(){
           var numSlides = $scope.$parent.currentPresenation.slidArray.length;
           var i = 0;
           for (i = 0; i < numSlides; i++) {
             if($scope.$parent.currentSlide != undefined){
               if ($scope.$parent.currentPresenation.slidArray[i].id == $scope.$parent.currentSlide.id && i < (numSlides-1)) { 
                 var slid = $scope.$parent.currentPresenation.slidArray[i+1];
                 // $scope.currentSlide = $scope.currentPresenation.slidArray[i+1];
                 break;
               }
             }
           }
           if(pauseActivated == false){
             $scope.$parent.currentSlide = null;
             $scope.$parent.currentSlide = $scope.$parent.currentPresenation.slidArray[i+1];
           }
           $scope.$apply();
         }, 3000);
      //Sends to server via socket
      comm.io.emitStart(socket);
      $log.info("PlayerController : emitStart");
      break;
      
      case 'pause':
      // Changes View
      pauseActivated = true;
      //Sends to server via socket
      comm.io.emitPause(socket);
      $log.info("PlayerController : emitPause");
      
      case 'next':
      // Changes View
      var numSlides = $scope.$parent.currentPresenation.slidArray.length;
      for (var i = 0; i < numSlides; i++) {
        if ($scope.$parent.currentPresenation.slidArray[i].id == $scope.$parent.currentSlide.id && i < (numSlides-1) ){
          $scope.$parent.currentSlide = null;
          var slid = $scope.$parent.currentPresenation.slidArray[i+1];
          $scope.$parent.currentSlide = slid;
          break;
        }
      }
        //Sends to server via socket
        comm.io.emitNext(socket);
        $log.info("PlayerController : emitNext");
        break;

        case 'last':
      // Changes View
      var numSlides = $scope.$parent.currentPresenation.slidArray.length;
      $scope.$parent.currentSlide = $scope.$parent.currentPresenation.slidArray[numSlides-1];
      //Sends to server via socket
      comm.io.emitEnd(socket);
      $log.info("PlayerController : emitEnd");
      break;
    }
  };

  function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  };
};
