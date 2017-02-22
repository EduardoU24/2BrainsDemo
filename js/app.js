
/*
* Configuration 
*/ 
'use strict';
angular.module('twobrainsdemo', ['restangular', 'ngRoute'])
.config(function ($routeProvider, RestangularProvider) {
	RestangularProvider.setBaseUrl('https://jsonplaceholder.typicode.com/');

	$routeProvider.when('/', {
		controller: 'MainCtrl',
		templateUrl: 'main.html'
	}).when('/post/:id', {
		controller: 'PostCtrl',
		templateUrl: 'post.html'
	});
})
/*
* Logic 
*/
.controller('MainCtrl', function($scope, Restangular, $location) {
	//#region PostData
	$scope.getAllPosts = function() {
		$scope.posts = Restangular.all('posts').getList().$object;
		console.log($scope.posts);
	};

	$scope.getCommentsFromPost = function( id ) {
		// hardcode TODO: give comment to right post
		$scope.posts[0].comments = Restangular.all('posts/'+ id +'/comments').getList().$object;
	}

	$scope.getFibonacciPosts = function( _num ) {
		var _sequence = $scope.getFibonacciSequence(_num);
		console.log("sequence: ", _sequence);
		$scope.posts = Restangular.all('posts' + _sequence).getList().$object;
	};


	$scope.getFibonacciPostsUntil = function( _num ) {
		var _sequence = $scope.getFibonacciSequenceUntil(_num);
		console.log("sequence: ", _sequence);
		$scope.posts = Restangular.all('posts' + _sequence).getList().$object;
	};
	//#endregion PostData

	// Returns X fibonacci numbers
	$scope.getFibonacciSequence = function( _num ) {
		var _sequence = [];
		for (var i = 0; i <= _num; i += 1) {
			var fib = $scope.fibonacci(i);
			_sequence.push(fib);
		}
		return $scope.parseFibSequenceForRest(_sequence);
	};

	// Returns a fibonacci sequence UNTIL given number is reached.
	$scope.getFibonacciSequenceUntil = function( _num ) {
		var _sequence = [];
		for (var i = 0; i <= _num; i += 1) {
			var fib = $scope.fibonacci(i);
			if(fib > _num)
				return $scope.parseFibSequenceForRest(_sequence);

			_sequence.push(fib);
		}
		return $scope.parseFibSequenceForRest(_sequence);
	};

	// Turns the array into a string for the http to request
	$scope.parseFibSequenceForRest = function( _sequence ) {
		return "?id=" + _sequence.join('&id=');
	};

	// Calculate fibonacci value 
	$scope.fibonacci = function fibonacci(_num) {
		// this should be  ' _num <= 1 ' but I only want the last "one" since I don't like duplicated posts.
 		if (_num <= 0) return 1;
		return $scope.fibonacci( _num - 1) + $scope.fibonacci(_num - 2);
	};

	$scope.GoToPostDetails = function( id ) {
		$location.path( "post/" + id );
	};
})

.controller('PostCtrl', function($scope, $routeParams, Restangular) {
	$scope.post = Restangular.one('posts', $routeParams.id).get().$object;
	$scope.getComments = function() {
		// hardcode TODO: give comment to right post
		$scope.post.comments = Restangular.all('posts/'+ $scope.post.id +'/comments').getList().$object;
	}
})

;