var app = angular.module("viajesTransparentes", ['leaflet-directive','ui.bootstrap','perfect_scrollbar' ]);

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

app.controller("subscribeCTL", ['$scope', '$http',function ($scope, $http) {
    $scope.funcionario = window.funcionario;
    $scope.email = "";
    $scope.submitForm = function() {
        var data = {
            email : $scope.email,
            funcionario : $scope.funcionario
        };
        $http({method: 'POST', url: '/service/subscribe',data : data}).success(function(data){
            console.log(data);
        });
    }
}]);