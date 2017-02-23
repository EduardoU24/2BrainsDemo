
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
	$scope.inputdata = {
		searchpostbyid: '', searchpostbytitle: '', searchcommentbypostid: '', searchcommentbyuser: ''
	}

	/** GET POST DATA **/
	$scope.getAllPosts = function() {
		$scope.comments = null;
		$scope.results = Restangular.all('posts').getList().$object;
	};

	$scope.getPostByID = function( _id ) {
		if(isNaN(parseInt(_id)))
			return;
		$scope.comments = null;
		$scope.results = [Restangular.one('posts', _id).get().$object];
	};

	$scope.getPostByTitle = function( _title ) {
		$scope.comments = null;
		$scope.results = Restangular.all('posts').getList({title: _title}).$object;
	};

	/** GET COMMENTS DATA **/
	$scope.getCommentsByPostID = function( _id ) {
		if(isNaN(parseInt(_id)))
			return;
		$scope.results = null;
		$scope.comments = Restangular.all('posts/'+ _id +'/comments').getList().$object;
	};

	$scope.getCommentsFromPost = function( id, key ) {
		$scope.comments = null;
		$scope.results[key].comments = Restangular.all('posts/'+ id +'/comments').getList().$object;
	};

	/** FIB CALC DATA **/
	$scope.getFibonacciPosts = function( _num ) {
		$scope.comments = null;
		$scope.results = Restangular.all('posts' + $scope.getFibonacciSequence(_num) ).getList().$object;
	};

	$scope.getFibonacciPostsUntil = function( _num ) {
		$scope.comments = null;
		$scope.results = Restangular.all('posts' + $scope.getFibonacciSequenceUntil(_num) ).getList().$object;
	};

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
	Restangular.one("posts", $routeParams.id).get().then(function(post){
		$scope.post = post;
		$scope.post.comments = Restangular.all('posts/'+ $scope.post.id +'/comments').getList().$object;
	});
})

;