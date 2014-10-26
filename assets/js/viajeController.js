/**
 * Created by Owner on 9/29/2014.
 */
app.controller("viajeCTL", ['$scope', '$http','$filter' , function ($scope, $http, $filter) {
    $scope.viaje = window.viaje;
    $scope.funcionario = window.funcionario;
    $scope.flagResize = true;

    $scope.fbShare = function(url) {
        window.open(
        'https://www.facebook.com/sharer/sharer.php?u='+url, 
        'facebook-share-dialog', 
        'width=520,height=350'); 
        return false;
    };

    $scope.infoPanels = function(windowSize){
        if(($scope.flagResize !== false) && (windowSize < 1170) ){
            $('#viaje .info-box.panel .panel-collapse').each(function(){
                $(this).collapse('hide');
            });
            $scope.flagResize = false;
        }
        else if(($scope.flagResize !== true) && (windowSize > 1170)){
            $('#viaje .info-box.panel .panel-collapse').each(function(){
                $(this).collapse('show');
            });
            $scope.flagResize = true;
        }
    };

    $(document).ready(function(){
        var windowSize = $(window).width();
        $scope.flagResize = (windowSize<1170) ? true : false;
        $('#viaje .info-box.panel .panel-collapse').each(function(){
            $(this).collapse({'toggle':false});
        });
        $scope.infoPanels(windowSize);
        $('.menu-viaje li a').click(function(){
            var link = $(this);
            $( '#viaje .info-box' ).removeClass('selected');
            $('html, body').animate({
                scrollTop: $( $.attr(this, 'href') ).offset().top - 20
            }, 500 , function(){
                var hash = link.attr('href');
                $('#viaje ' + hash).addClass('selected');
            });
            return false;
        });
        /*Media queries*/

        $(window).resize(function(){
            clearTimeout( timerResize );
            var timerResize = setTimeout( function(){
                windowSize = $(window).width();
                $scope.infoPanels(windowSize);
            } , 200 );
        });
    });

}]);

app.controller("viajeSearchCTL", ['$scope', '$http','$filter' , function ($scope, $http, $filter) {
    $scope.viajes = window.viajes;

    $scope.getDateString = function(viaje){
        var inicio = new Date(viaje.fecha_inicio_com);
        var fin = new Date(viaje.fecha_fin_com);
        var inicioAux = $filter('date')(inicio, 'longDate');
        var finAux = $filter('date')(fin, 'longDate');
        return inicioAux + " al " + finAux;
    };
}]);