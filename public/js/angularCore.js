var pgSchedule = angular.module('pgSchedule', ['ui.bootstrap', 'ngCookies']);

pgSchedule.controller('mainController', ['$scope', '$http', '$log', '$interval', '$location', '$cookies', function($scope, $http, $log, $interval, $location, $cookies) {
  $scope.timeUntil = '';
  $scope.currentDay = '';
  $scope.currentBlock = '';
  $scope.dateString = '';
  $scope.cookies = []; // A=BLOCK,B=BLOCK
  $scope.weekend = false;
  $scope.lunch = [];
  $scope.day = new Date();

  $scope.getTimeUntil = function() {
    $http.get(getApi('timeUntil')).success(function(data) {
      if (data === -1) {
        $scope.dateString = 'No Class';
      } else {
        $scope.timeUntil = (parseInt(data) + 1) + '';
        $scope.dateString = ($scope.timeUntil) + ' minutes until next class.';
        if ($scope.timeUntil === 1) {
          $scope.dateString = ($scope.timeUntil) + ' minute until next class';
        }
      }
    });
  };

  $scope.changeDay = function(offset) {
    var dateOffset = (24 * 60 * 60 * 1000) * offset;
    $scope.day.setTime($scope.day.getTime() + dateOffset);
    console.log($scope.day);
    var apiString = 'getFutureDate' +
    '/' + ($scope.day.getMonth()) +
    '/' + ($scope.day.getDate()) +
    '/' + ($scope.day.getFullYear());
    $http.get(getApi(apiString)).success(function(data) {
      $scope.currentDay = data;
      $scope.weekend = (data === '');
    });
  };

  $scope.getCurrentBlock = function() {
    $http.get(getApi('currentBlock')).success(function(data) {
      $scope.currentBlock = data;
      if ($cookies.get('schedule')) {
        var classCookie = $cookies.get('schedule').split(',');
        for (var i = 0; i < classCookie.length; i++) {
          var theClass = classCookie[i].split('=');
          $scope.cookies[theClass[0]] = theClass[1];
        }
      }
    });
  };

  $scope.getCurrentDay = function() {
    if ($scope.day.getDate() !== new Date().getDate()) {
      return;
    }
    $http.get(getApi('currentDay')).success(function(data) {
      $scope.currentDay = data;
      $scope.weekend = (data === '');
    });
  };

  $scope.addClasses = function() {
    var cookieString = '';
    angular.forEach(angular.element.find('.classInput'), function(node) {
      cookieString += (node.id.substring(0, 1)) + '=' + '' + node.value + ',';
    });
    $cookies.put('schedule', cookieString, {expires: new Date('5/29/2016')});
    location.reload(); // Until we get angular-bootstrap working correctly.
  };

  $scope.getLunchMenu = function() {
    $http.get('/api/getLunchMenu').success(function(data) {
      $scope.lunch = data;
      $scope.lunch.pop();
    });
  };

  $scope.beautifyTime = function(time) {
    var hours = parseInt(time.substring(0,2)) % 12;
    hours = (hours === 0 ? 12 : hours);
    return hours + time.substring(2, 5);
  };

  function getApi(endpoint) {
    return '/api/' + endpoint + (($location.absUrl().indexOf('middle') > -1) ? '?middle=1' : '');
  }

  $scope.getCurrentDay();
  $scope.getCurrentBlock();
  $scope.getTimeUntil();

  $interval($scope.getCurrentBlock, 1000 * 10);
  $interval($scope.getCurrentDay, 1000 * 60 * 60);
  $interval($scope.getTimeUntil, 1000 * 10);

}]);
