var app = angular.module("viajesTransparentes", ['leaflet-directive','ui.bootstrap','perfect_scrollbar','ngMaterial' ]);

app.directive('countTo', ['$timeout','$filter', function ($timeout,$filter) {
    return {
        replace: false,
        scope: true,
        link: function (scope, element, attrs) {

            var e = element[0];
            var num, refreshInterval, duration, steps, step, countTo, value, increment;
            var filterVal = attrs.filter ? attrs.filter : 'number';

            var calculate = function () {
                refreshInterval = 30;
                step = 0;
                scope.timoutId = null;
                countTo = parseInt(attrs.countTo) || 0;
                scope.value = parseInt(attrs.value, 10) || 0;
                duration = (parseFloat(attrs.duration) * 1000) || 0;

                steps = Math.ceil(duration / refreshInterval);
                increment = ((countTo - scope.value) / steps);
                num = scope.value;
            };

            var tick = function () {
                scope.timoutId = $timeout(function () {
                    num += increment;
                    step++;
                    if (step >= steps) {
                        $timeout.cancel(scope.timoutId);
                        num = countTo;
                        e.textContent = $filter(filterVal)(countTo);
                    } else {
                        e.textContent = $filter(filterVal)(num);
                        tick();
                    }
                }, refreshInterval);

            };

            var start = function () {
                if (scope.timoutId) {
                    $timeout.cancel(scope.timoutId);
                }
                calculate();
                tick();
            };

            attrs.$observe('countTo', function (val) {
                if (val) {
                    start();
                }
            });

            attrs.$observe('value', function (val) {
                start();
            });

            return true;
        }
    }

}]);

app.controller("globalCTL", ['$scope', '$http', '$rootScope','$mdSidenav','limitToFilter',function ($scope, $http,$rootScope,$mdSidenav,limitToFilter) {
    $scope.funcionariosComparador = [];

    $scope.funcionariosAJAX = function(name) {
        if (!name) return [];
        return $http({method:'POST',url:"/funcionario/search_autocomplete?nombre="+name}).then(function(response){
            return limitToFilter(response.data, 8);
        });
    };
    $scope.onSelectPart = function ($item, $model, $label) {
        $scope.$item = $item;
        //console.log($item);
        window.location = '/funcionario?id=' + $item.id;
        $scope.$model = $model;
        $scope.$label = $label;
    };

    $scope.onSelectComparador = function ($item, $model, $label) {
        $scope.fun = '';
        if($scope.funcionariosComparador.length < 9){
            $scope.funcionariosComparador.push($item);

            if($scope.validateForm()){
                $('#compare-icon').removeClass('rotateIn');
                setTimeout(function(){
                    $('#compare-icon').addClass('rotateIn');                
                },300);
            }
        }
    }

    $scope.removeFromComp = function(item){
        var index = $scope.funcionariosComparador.indexOf(item);
        if(index > -1){
            $scope.funcionariosComparador.splice(index,1);
        }

    }

    $scope.scrollTo = function(){
        setTimeout(
            function(){
                if($(window).width() < 1024){
                    $('html, body').animate({
                        scrollTop: $('#comparador-popup').offset().top - 20
                    }, 500);
                }else{
                    console.log('no scroll')
                }
            },
            300           
        );
    }
    $scope.toggleComp = function(func){
        $rootScope.$broadcast('toggleComp', true);
        func();
    }

    $scope.toggleLeft = function() {
        $mdSidenav('left').toggle();
    };
    //$scope.loadFuncionarios();
}]);

app.controller("subscribeCTL", ['$scope', '$http',function ($scope, $http) {
    $scope.funcionario = window.funcionario;
    $scope.email = "";
    $scope.submitForm = function() {
        var data = {
            email : $scope.email,
            funcionario : $scope.funcionario.id
        };
        $http({method: 'POST', url: '/service/subscribe',data : data}).success(function(data){
            console.log(data);
            //location.reload();//TODO mensaje mas amigable , no supe como cerrar modal con angular.
        });
    }
}]);

app.controller("lateralCTL", ['$scope', '$http','$rootScope',function ($scope, $http, $rootScope) {
    
    $scope.scrollTo = function(){
        setTimeout(
            function(){
                if($(window).width() < 1024){
                    $('html, body').animate({
                        scrollTop: $('#comparador-popup').offset().top - 20
                    }, 500);
                }
            },
            300           
        );
    }
    $scope.toggleComp = function(func){
        $rootScope.$broadcast('toggleComp', true);
        func()
    }
}]);

app.controller("comparadorCTL", ['$scope', '$http', 'limitToFilter',function ($scope, $http,limitToFilter) {

    $scope.toggleComparador = false;
    $scope.funcOne = '';
    $scope.funcTwo = '';

    $scope.$on('toggleComp', function(event,args) {
        $scope.toggleComparador = args;
    });

    $scope.funcionariosAJAX = function(name) {
        if (!name) return [];
        return $http({method:'POST',url:"/funcionario/search_autocomplete?nombre="+name}).then(function(response){
            return limitToFilter(response.data, 8);
        });
    };

    $scope.$on('sendFuncionario', function(event,args) {
        console.log(args);
        if(!isNaN($scope.funcOne.id)){
            $scope.funcTwo = args;
        }else{
            $scope.funcOne = args;
        }
        $scope.toggleComparador = true;
    });

    $scope.onSelectPart = function ($item, $model, $label) {
        if($scope.validateForm()){
            $('#comparadorForm .circle').removeClass('rotateIn');
            setTimeout(function(){
                $('#comparadorForm .circle').addClass('rotateIn');                
            },300);
        }
    }
    $scope.validateForm = function(){
        if(!isNaN($scope.funcOne.id) && !isNaN($scope.funcTwo.id)){
            return true;
        }else{
            return false;
        }
    }
    $scope.submitForm = function(){
        if ($scope.validateForm()){
            $('#comparadorForm').submit();
        }
    }

    $scope.setfooter = function(){
        var min = 57;
        min += $('#footer #comparador-popup').hasClass('fixed')?0:$('#footer #comparador-popup').height();
        if( $(window).scrollTop() + $(window).height() > $(document).height() - min ){
            setTimeout( function(){
                $('#footer #comparador-popup').removeClass('fixed');
                $('#footer #comparador-popup').removeClass('fixed');
            } , 0 );
        }else{
            setTimeout( function(){
                $('#footer #comparador-popup').addClass('fixed');
                $('#footer #comparador-popup').addClass('fixed');
            } , 0 );
        }
    }

    $(document).ready(function(){
        setTimeout( function(){
            $scope.setfooter();
        } , 40 );
    });

    $(window).scroll(function() {
        $scope.setfooter();
    });




}]);

