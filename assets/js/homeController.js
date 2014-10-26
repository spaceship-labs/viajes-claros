app.controller("homeCtrl", ['$scope', '$http','$filter',function ($scope, $http ,$filter) {
	$scope.nombre = 'mapa';
	$scope.toggleJumbotron = true;
	$scope.toggleSidebar = false;
	$scope.toggleAdvancedSearch = false;
    $scope.totalGastado = 0;
	$scope.mapPlace = '';
    $scope.gasto_parcial = 0;
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
        $scope.loadViajes(place);
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
							msg = '<p><strong>' + parcialGastadoStr +' MXP'+'</strong></p>Gasto hasta el dia de hoy de viajes en <span class="place">'
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

    $scope.loadViajes = function(ciudad) {
        $scope.mapPlace = ciudad;
        $scope.toggleSidebar = true;

        $http({method: 'POST', url: '/home/vajesPorCiudadJson?ciudad=' + ciudad})
            .success(function(data){
                $scope.items = data;
            });
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

app.controller("statisticsCTL", ['$scope', '$http','$filter','$rootScope',function ($scope, $http,$filter, $rootScope) {
    $scope.hotelList = [];
    $scope.ciudadesList = [];
    $scope.aerolineasList = [];
    $scope.funcionariosList = [];
    $scope.internacionalesList = [];
    $scope.pasajesList = [];
    $scope.totalViajes = 0;
    $scope.totalVuelos = 0;
    $scope.totalAerolineasVuelos = 0;

    $scope.calculateWidth = function(aerolinea) {
        var percentage = ((aerolinea.total / ($scope.totalAerolineasVuelos)) * 100);
        return $filter('number')(percentage, '1') + '%';
    };

    $scope.startRadialD3 = function(){
        $scope.totalViajes = $scope.internacionalesList.length ? ($scope.internacionalesList[0].total + $scope.internacionalesList[1].total) : 0;
        var internationalPercentage = $scope.internacionalesList[0].total/$scope.totalViajes * 100;
        var nationalPercentage = $scope.internacionalesList[1].total/$scope.totalViajes * 100;

        $scope.pasajesList.map(function(el) {
            if (el.pasaje_tipo == "Aéreo") {
                $scope.totalVuelos = el.total;
            }
            if (el.pasaje_tipo == "Terrestre") {
                $scope.totalCamiones = el.total;
            }
        });

        var vuelosPercentage = ($scope.totalVuelos / ($scope.totalVuelos + $scope.totalCamiones)) * 100;
        var camionesPercentage = ($scope.totalCamiones / ($scope.totalVuelos + $scope.totalCamiones)) * 100;

        var rp1 = radialProgress(document.getElementById('radial-one'))
            .diameter(150)
            .value(internationalPercentage)
            .label('Internacionales')
            .render();

        var rp2 = radialProgress(document.getElementById('radial-two'))
            .diameter(150)
            .value(nationalPercentage)
            .label('Nacionales')
            .render();

        var rp3 = radialProgress(document.getElementById('radial-three'))
            .diameter(150)
            .value(camionesPercentage)
            .label('Terrestres')
            .render();

        var rp4 = radialProgress(document.getElementById('radial-four'))
            .diameter(150)
            .value(vuelosPercentage)
            .label('Aereos')
            .render();

    };

    $scope.redirectTo = function(url){
        window.location = url;
    };

    $scope.loadData = function(){
        $http({method: 'POST', url: '/home/statisticsJson'}).success(function(data){
                $scope.hotelList = data.hotelList;
                $scope.ciudadesList = data.ciudadesList;
                $scope.aerolineasList = data.aerolineasList;
                $scope.funcionariosList = data.funcionariosList;
                $scope.internacionalesList = data.internacionalesList;
                $scope.pasajesList = data.pasajesList;

                $scope.startRadialD3();

                $scope.aerolineasList.forEach(function(el) {
                      $scope.totalAerolineasVuelos += el.total;
                });
                $scope.redrawAerolineas();

        });
    };

    $scope.redrawAerolineas = function(){
        var options = {
            scaleIntegersOnly: true,
            responsive: true,
            scaleGridLineColor : "rgb(255,255,255)",
            showTooltips:true,
            legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
        };

        var barChartData = {
            labels : [],
            datasets : [
                {
                    fillColor : "#2f96e9",
                    strokeColor : "#2f96e9",
                    data : [],
                },
            ]
        }
        $scope.aerolineasList.forEach(function(aerolinea,index){
            barChartData.labels.push(aerolinea.linea_origen);
            barChartData.datasets[0].data.push(aerolinea.total);
        });

        var element = document.getElementById("aerolineas-chart").getContext("2d");
        $scope.myLine = new Chart(element).Bar(barChartData,options);
        //$scope.myLine.redraw();
    };


    $scope.compare = function(funcionarioObj){
        funcionarioObj.id = funcionarioObj.funcionario;
        $rootScope.$broadcast('sendFuncionario', funcionarioObj);
    }

    $scope.loadData();
}]);
