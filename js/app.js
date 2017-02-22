
/*
* Configuration 
*/ 
'use strict';
angular.module('twobrainsdemo', ['restangular', 'ngRoute'])
.config(function ($routeProvider, RestangularProvider) {
	RestangularProvider.setBaseUrl('https://jsonplaceholder.typicode.com');

	$routeProvider.when('/', {
		controller: 'MainCtrl'
	});
})
/*
* Logic 
*/
.controller('MainCtrl', function($scope, Restangular) {
	$scope.posts = Restangular.all('posts');
});