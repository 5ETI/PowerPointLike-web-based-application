angular.module('adminApp').controller('playerCtr',playerCtrFnt);

playerCtrFnt.$inject=['$scope','$log','$window','factory','comm'];

// function playerCtrFnt($scope, $log, $window, factory, comm) {

//     $scope.changeSlide = function(choice){
//         var socket = $scope.socket;
//         var curPres = $scope.currentPresentation;
//         switch (choice){
//             case "first":
//                 comm.io.emitBegin(socket);
//                 break;
//             case "last":
//                 comm.io.emitEnd(socket); break;
//             case "previous":
//                 comm.io.emitPrev(socket); break;
//             case "next":
//                 comm.io.emitNext(socket); break;
//             case "start":
//                 comm.io.emitStart(socket, curPres.id); break;
//             case "pause":
//                 comm.io.emitPause(socket); break;
//         }
//     }
// };


function playerCtrFnt($scope, $log, $window){

 var pauseActivated = false;

 $scope.StepBackward = function(){
  $log.info("StepBackward\n\n");
  $scope.$parent.currentSlide = $scope.$parent.currentPresenation.slidArray[0];
}

$scope.Backward=function(){
  $log.info("Backward\n\n");  
  var numSlides = $scope.$parent.currentPresenation.slidArray.length;
  for (var i = 0; i < numSlides ; i++) {
    if ($scope.$parent.currentPresenation.slidArray[i].id == $scope.$parent.currentSlide.id && i != 0) {
      $scope.$parent.currentSlide = null;
      var slid = $scope.$parent.currentPresenation.slidArray[i-1];
      $scope.$parent.currentSlide = slid;
      break;
    }
  }
}

$scope.Play=function(){
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
}

$scope.Pause=function(){
  $log.info("Pause\n\n");
  pauseActivated = true;
}
$scope.Forward=function(){
  $log.info("Forward\n\n");
  var numSlides = $scope.$parent.currentPresenation.slidArray.length;
    // var value =) .equals($scope.$parent.currentSlide.id);
    for (var i = 0; i < numSlides; i++) {
      if ($scope.$parent.currentPresenation.slidArray[i].id == $scope.$parent.currentSlide.id && i < (numSlides-1) ){
        $scope.$parent.currentSlide = null;
        var slid = $scope.$parent.currentPresenation.slidArray[i+1];
        $scope.$parent.currentSlide = slid;
        break;
      }
    }
  }

  $scope.StepForward=function(){
   $log.info("StepForward\n\n");
   var numSlides = $scope.$parent.currentPresenation.slidArray.length;
   $scope.$parent.currentSlide = $scope.$parent.currentPresenation.slidArray[numSlides-1];
 }
};
