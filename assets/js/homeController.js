app.controller("mapCtrl", function ($scope, $http) {
	$scope.nombre = 'mapa';
	$scope.toggleJumbotron = true;
	$scope.toggleAdvancedSearch = false;
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

	$scope.addTextRadial = function(radialId,string){
		var txt = $('#'+radialId).first('.label');
		console.log(txt);
		txt.append(string);
	}

	$scope.startRadialD3 = function(){
        var rp1 = radialProgress(document.getElementById('radial-international-trips'))
                .diameter(150)
                .value(79)
                .render();	

        var rp2 = radialProgress(document.getElementById('radial-national-trips'))
                .diameter(150)
                .value(21)
                .render();	

        //$scope.addTextRadial('radial-international-trips','Internacionales');
        //$scope.addTextRadial('radial-rnational-trips','Nacionales');

	}

    $scope.get_markers();
    $scope.startRadialD3();


});