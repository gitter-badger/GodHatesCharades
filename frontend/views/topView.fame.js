app.controller('topView.fame', function(pairs, $scope, pairService, $filter, $state, parseUser) {
	// public vars
	$scope.pairs = pairs;
	$scope.parseUser = parseUser;
	$scope.sortPredicates = ['-kdr',
	                         '-chosen',
	                         'skips'];
});