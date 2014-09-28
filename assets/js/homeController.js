app.controller("homeCtrl", function ($scope, $http ,$filter) {
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
                            totalGastado += (parseInt(marker.gasto_pasaje,10) ? parseInt(marker.gasto_pasaje,10) : 0) + (parseInt(marker.gasto_viatico,10) ? parseInt(marker.gasto_viatico,10) : 0);
							totalGastadoStr = $filter('currency')(totalGastado, '$');
							msg = '<p><strong>' + totalGastadoStr +' MXP'+'</strong></p>Gasto anual de viajes en <span class="place">'
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

});

app.controller("statisticsCTL", function ($scope, $http) {

    $scope.addTextRadial = function(radialId,string){
        var txt = $('#'+radialId).first('.label');
        console.log(txt);
        txt.append(string);
    }

    $scope.startRadialD3 = function(label1,label2){
        var rp1 = radialProgress(document.getElementById('radial-one'))
            .diameter(150)
            .value(79)
            .label(label1)
            .render();

        var rp2 = radialProgress(document.getElementById('radial-two'))
            .diameter(150)
            .value(21)
            .label(label2)
            .render();

        //$scope.addTextRadial('radial-international-trips','Internacionales');
        //$scope.addTextRadial('radial-rnational-trips','Nacionales');

    }


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
    }

    //Each bar represents a single discrete quantity.
    $scope.setData = function() {
        return  [
            {
                key: "Cumulative Return",
                values: [
                    {
                        "label" : "A Label" ,
                        "value" : 29.765957771107
                    } ,
                    {
                        "label" : "B Label" ,
                        "value" : 0
                    } ,
                    {
                        "label" : "C Label" ,
                        "value" : 32.807804682612
                    } ,
                    {
                        "label" : "D Label" ,
                        "value" : 196.45946739256
                    } ,
                    {
                        "label" : "E Label" ,
                        "value" : 0.19434030906893
                    }
                ]
            }
        ]

    }

    $scope.loadData = function(){
        $http({method: 'POST', url: '/home/statisticsJson'}).success(function(data){
                console.log(data);
        });
    };

    $scope.loadData();
    $scope.startRadialD3('Internacionales','Nacionales');
    $scope.drawChartAerolineas();
    $scope.drawChartHorizontal();
});