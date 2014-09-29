app.controller("homeCtrl", ['$scope', '$http','$filter',function ($scope, $http ,$filter) {
	$scope.nombre = 'mapa';
	$scope.toggleJumbotron = true;
	$scope.toggleSidebar = false;
	$scope.toggleAdvancedSearch = false;
    $scope.totalGastado = 0;
	$scope.mapPlace = '';
	$scope.layers =  {
        baselayers: {
            xyz: {
                name: 'OpenStreetMap (XYZ)',
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                type: 'xyz'
                //layerOptions: {
                  //  attribution: '<a href="http://spaceshiplabs.com" target="_blank">Spaceshiplabs.com</a> | <a  target="_blank" href="http://gasolinapp.com">Gasolinapp.com</a>'
                //}
            }
        }
    };
	$scope.options = {
        attributionControl : true, 
        zoomControlPosition: 'bottomright',
        imagePath : '/bower_components/leaflet/dist/images/'
    };

	$scope.mapCenter = {
		lng : -99.133208,
		lat : 19.4326077,
		zoom : 4,
	};

	$scope.$on('leafletDirectiveMarker.click', function(event, args){
	    var place = $scope.markers[args.markerName].message;
	    place = $.parseHTML(place);
	    place = place[2].innerHTML;
	    $scope.mapPlace = place;
	    $scope.toggleSidebar = true;
	});

    $scope.leafIcon = {
        iconUrl: '../images/pin_mapa.png',
        iconSize:     [33, 46], // size of the icon
        iconAnchor:   [16, 36] // point of the icon which will correspond to marker's location
    };

	$scope.get_markers = function(){
	    $http({method: 'POST', url: '/home/vajesJson'})
	    .success(
		        function(data) {
		        	var markers = [];
                    var totalGastado = 0;
					$scope.markers = [];
					var msg;
					data.forEach(function(marker){
                            var parcialGastado = (parseInt(marker.gasto_pasaje,10) ? parseInt(marker.gasto_pasaje,10) : 0) + (parseInt(marker.gasto_viatico,10) ? parseInt(marker.gasto_viatico,10) : 0);
                            totalGastado += parcialGastado;
							var parcialGastadoStr = $filter('currency')(parcialGastado, '$');
							msg = '<p><strong>' + parcialGastadoStr +' MXP'+'</strong></p>Gasto anual de viajes en <span class="place">'
								  + marker.ciudad_destino + '</span>';
							markers.push({
								lat: parseFloat(marker.destino_latitud),
								lng: parseFloat(marker.destino_longitud),
								message: msg,
								icon : $scope.leafIcon
							});
					});
					$scope.markers = markers;
                    $scope.totalGastado = totalGastado;
		        }, 
		        function(e) {
		        	console.log('error');
		        }
		);
	};

	angular.extend($scope, {
	    events: {
	      markers: {
	        enable: ['click'],
	        logic: 'emit'
	      }
	    }
	});


    $scope.get_markers();

}]);

app.controller("statisticsCTL", ['$scope', '$http',function ($scope, $http) {
    $scope.hotelList = [];
    $scope.ciudadesList = [];
    $scope.aerolineasList = [];
    $scope.funcionariosList = [];
    $scope.internacionalesList = [];
    $scope.totalViajes = 0;

    $scope.startRadialD3 = function(){
        $scope.totalViajes = $scope.internacionalesList.length ? ($scope.internacionalesList[0].total + $scope.internacionalesList[1].total) : 0;
        var internationalPercentage = $scope.internacionalesList[0].total/$scope.totalViajes * 100;
        var nationalPercentage = $scope.internacionalesList[1].total/$scope.totalViajes * 100;
        var rp1 = radialProgress(document.getElementById('radial-one'))
            .diameter(100)
            .value(internationalPercentage)
            .render();

        var rp2 = radialProgress(document.getElementById('radial-two'))
            .diameter(100)
            .value(nationalPercentage)
            .render();

        //$scope.addTextRadial('radial-international-trips','Internacionales');
        //$scope.addTextRadial('radial-rnational-trips','Nacionales');

    }

    $scope.drawChartAerolineas = function(){
        nv.addGraph(function() {
            var chart = nv.models.discreteBarChart()
                    .x(function(d) { return d.label })    //Specify the data accessors.
                    .y(function(d) { return d.value })
                    .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
                    .tooltips(false)        //Don't show tooltips
                    .showValues(true)       //...instead, show the bar value right on top of each bar.
                    .transitionDuration(3000)
                ;

            d3.select('#chart-bar svg')
                .datum($scope.setData())
                .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        });
    };

    $scope.setData = function() {
        var values = $scope.aerolineasList.map(function(el){
            return { label : el.linea_origen,value : el.total };
        });
        return [{ key: "Cumulative Return",values : values }];
    };

    $scope.loadData = function(){
        $http({method: 'POST', url: '/home/statisticsJson'}).success(function(data){
                console.log(data);
                $scope.hotelList = data.hotelList;
                $scope.ciudadesList = data.ciudadesList;
                $scope.aerolineasList = data.aerolineasList;
                $scope.funcionariosList = data.funcionariosList;
                $scope.internacionalesList = data.internacionalesList;

                $scope.startRadialD3();
                $scope.drawChartAerolineas();
        });
    };

    $scope.loadData();
}]);