/**
 * Created by Owner on 9/29/2014.
 */
app.controller("funcionarioCTL", function ($scope, $http, $filter) {

    $scope.viajes = window.viajes;
    $scope.funcionario = window.funcionario;
    $scope.totalViaticos = 0.0;
    for (var i=0;i<$scope.viajes.length;i++) {
        var el = $scope.viajes[i];
        $scope.totalViaticos += el.gasto_viatico;
    }


    $scope.startRadialD3 = function(){
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = now - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);

        var days = 0;

        $scope.viajes.map(function(viaje){
           var dateInicio = new Date(viaje.fecha_inicio_com);
           var dateFin = new Date(viaje.fecha_fin_com);
           var dateDiff = dateFin - dateInicio;
           var vacas = Math.floor(dateDiff / oneDay);
           days += days + vacas;
        });

        var rp1 = radialProgress(document.getElementById('radial-one'))
            .diameter(100)
            .value((days/day) * 100)
            .render();

        var rp2 = radialProgress(document.getElementById('radial-two'))
            .diameter(100)
            .value(((day-days)/day) * 100)
            .render();

        //$scope.addTextRadial('radial-international-trips','Internacionales');
        //$scope.addTextRadial('radial-rnational-trips','Nacionales');

    };

    $scope.getTotal = function(){
        var total = 0;
        for(var i = 0; i < $scope.viajes.length; i++){
            var viaje = $scope.viajes[i];
            total += viaje.gasto_total;
        }
        return total;
    };

    $scope.getDateString = function(viaje){
        var inicio = new Date(viaje.fecha_inicio_com);
        var fin = new Date(viaje.fecha_fin_com);
        var inicioAux = $filter('date')(inicio, 'longDate');
        var finAux = $filter('date')(fin, 'longDate');
        return inicioAux + " al " + finAux;
    };

    $scope.setData = function() {
        var comprobados = 0;
        var sincomprobar = 0;
        var devuelto = 0;
        for (var i=0;i<$scope.viajes.length;i++) {
            var el = $scope.viajes[i];
            comprobados += el.viatico_comprobado;
            sincomprobar += el.viatico_sin_comprobar;
            devuelto += el.viatico_devuelto;
        }
        console.log($scope.totalViaticos);
        var values = [
            {label : 'comprobados',value : comprobados},
            {label : 'sin comprobar',value : sincomprobar},
            {label : 'devueltos',value : devuelto}
        ];
        return [{ key: "Cumulative Return",values : values }];
    };

    $scope.drawChartHorizontal = function(){
        nv.addGraph(function() {
            var chart = nv.models.multiBarHorizontalChart()
                .x(function(d) { return d.label })
                .y(function(d) { return d.value })
                //.margin({top: 30, right: 20, bottom: 50, left: 175})
                .showValues(true)           //Show bar value next to each bar.
                .tooltips(true)             //Show tooltips on hover.
                .transitionDuration(350)
                .showControls(true);        //Allow user to switch between "Grouped" and "Stacked" mode.

            chart.yAxis
                .tickFormat(d3.format(',.2f'));

            d3.select('#chart-horizontal svg')
                .datum($scope.setData())
                .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        });
    };

    $scope.startRadialD3();
    $scope.drawChartHorizontal();
});