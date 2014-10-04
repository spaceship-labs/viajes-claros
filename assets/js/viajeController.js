/**
 * Created by Owner on 9/29/2014.
 */
app.controller("viajeCTL", ['$scope', '$http','$filter' , function ($scope, $http, $filter) {
    $scope.viaje = window.viaje;
    $scope.funcionario = window.funcionario;
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