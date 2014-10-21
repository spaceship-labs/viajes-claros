/**
 * Created by Owner on 9/29/2014.
 */
app.controller("viajeCTL", ['$scope', '$http','$filter' , function ($scope, $http, $filter) {
    $scope.viaje = window.viaje;
    $scope.funcionario = window.funcionario;

    $scope.fbShare = function(url) {
        window.open(
        'https://www.facebook.com/sharer/sharer.php?u='+url, 
        'facebook-share-dialog', 
        'width=520,height=350'); 
        return false;
    };

    $scope.infoPanels = function(windowSize){
        console.log(windowSize);
        if(windowSize < 1170){
            console.log('esconder');
            $('#viaje .info-box.panel .panel-collapse').each(function(){
                //$(this).collapse('hide');
                $(this).removeClass('in');
            });
        }
        else{
            console.log('abrir');

            $('#viaje .info-box.panel .panel-collapse').each(function(){
                //$(this).collapse('show');
                $(this).addClass('in');
                $(this).css('height','auto')
            });
        }
    };

    $(document).ready(function(){
        var windowSize = $(window).width();
        $scope.infoPanels(windowSize);
        $('.menu-viaje li a').click(function(){
            $('html, body').animate({
                scrollTop: $( $.attr(this, 'href') ).offset().top - 20
            }, 500);
            return false;
        });
        /*Media queries*/
        $(window).resize(function(){
            windowSize = $(window).width();
            $scope.infoPanels(windowSize);
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