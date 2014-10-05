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

    $scope.twShare = function(url) {
        window.open(
        'https://twitter.com/home?status='+url, 
        'twitter-share-dialog', 
        'width=520,height=350'); 
        return false;
    };

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