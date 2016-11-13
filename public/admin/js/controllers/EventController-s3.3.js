angular.module('adminApp').controller('eventCtrl',eventCrtFnt);

eventCrtFnt.$inject=['$scope','$log','$window','factory','comm'];

function eventCrtFnt($scope, $log, $window, factory, comm){


  $scope.currentPresentation=factory.presentationCreation("template_pres","description of the template présentation");
  $scope.currentPresentation.slidArray = [];
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

   /*var firstPresentation=comm.loadPres('test','test');
   firstPresentation.then(
    function(payload) { 
      $scope.presentationMap.payload= payload;

      for(key in $scope.presentationMap.payload){
        $scope.currentPresentation =$scope.presentationMap.payload[key];
      }

    },
    function(errorPayload) {
      $log.error('failure loading movie', errorPayload);
    });*/


   $scope.newSlide=function(){
    var slid=factory.slidCreation("slide-Title","slide-text");
    $scope.currentPresentation.slidArray.push(slid);
  }

  $scope.savePres=function(){
    var savingPres = comm.savePres($scope.currentPresentation);
  }

  $scope.loadPres=function(){
    var loadPresentation = comm.loadPres();
    loadPresentation.then(
      function(data) { 
        $log.info(data.pres);
        $scope.currentPresentation=factory.presentationCreation("template_pres","description of the template présentation",data.pres.slidArray);
      },
      function(error) {
        $log.error('failure loading movie', errorPayload);
      });

  }


  $scope.selectCurrentSlid=function(slide){
    $scope.currentSlide = slide;
    // alert("sdifhpsdj");
    $log.info("Slide"+slide.id);
  }


  $scope.onDragSuccess=function(data,evt){
    //copier image dans son emplacement d'origin? on la chope et on la met dedans en attendant
    // le drop (voir si il faut la supprimer ensuite) Ou sinon on s en ballec de drag sans clone mais c est pas propre
  }

  $scope.onDropComplete=function(data,evt){
    if($scope.currentSlide != undefined){
      $scope.currentSlide.contentMap[1] = data.id;
            //needed to inform angular that a change occurred on the current variable, this fire an event change
            $scope.$apply();
            console.log("drop success, data.id:", data.id);
          }
          console.log("NO OBJECT TO DROP");
        }

        $scope.getCurrentContent=function(){
          if(1  in  $scope.currentSlide.contentMap){
            return $scope.currentSlide.contentMap[1];
          }
        }

        $scope.isSlidContentEmpty=function(slid){
          if(slid.contentMap[1]== undefined){
            return true;
          }
          return false;
        }    
        function load_init_Pres(pres_id){
          var firstPresentation=comm.loadPres();
          firstPresentation.then(
            function(payload) {
              $scope.presentationMap.payload = payload;
              $scope.presentationMap.array = factory.mapToArray(payload);
              if(pres_id !== undefined){
                if(payload[pres_id] !== undefined)
                  $scope.currentPresentation = $scope.presentationMap.payload[pres_id];
                else
                  console.error("Server sent incoherent data");
              }
              else{
                    // Get the first presentation of the map
                    for(var key in payload){
                      $scope.currentPresentation = $scope.presentationMap.payload[key];
                      break;
                    }
                  }
                  $scope.currentSlide = $scope.currentPresentation.slidArray[0];
                },
                function(errorPayload) {
                  $log.error('failure loading presentation', errorPayload);
                });
        }


      };
