app.controller("mapCtrl", function ($scope, $http) {
	$scope.nombre = 'mapa';
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
        imagePath : '/consejosano/static/src/css/images-leaflet',
    };

	$scope.mapCenter = {
		lng : -99.133208,
		lat : 19.4326077,
		zoom : 4,
	}


	$scope.get_markers = function(){
	    $http({method: 'POST', url: 'https://erp.consejosano.com/api-health-service-locator'})
	    .success(
		//$http.post('https://erp.consejosano.com/api-health-service-locator?callback=JSON_CALLBACK')
		//.then(
		        function(s) { 
		        	var markers = [];
					$scope.markers = [];
					data = s.objects;
					data.forEach(function(clinicObject){
							var messageClinic = clinicObject.name + '<br/>';
							markers.push({
								lat: parseFloat(clinicObject.latitude),
								lng: parseFloat(clinicObject.longitude),
								message: messageClinic,
							});
					});
					$scope.markers = markers;
		        }, 
		        function(e) {
		        	console.log('error');
		        }
		);
	}

    $scope.get_markers();


});