define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('topSubmissions', ['cardService', '$filter', '$state', function(cardService, $filter, $state) {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/topSubmissions.html',
				replace: true,
				link: function($scope, $element) {
					// $scope.$watch('pairIndex', $scope.onPairIndexChanged);
				},
				controller: function($scope, $element) {
					// public vars
					$scope.pageSize = 50;
					$scope.loading = false;
					$scope.suggestions = [];
					$scope.skipIndex = 0;
					$scope.allLoaded = false;

					// Private methods

					$scope.loadSuggestions = function() {
						console.log($state.current.name);
						if(!$scope.loading && !$scope.allLoaded) {
							var options = {
								pageSize: $scope.pageSize,
								skipIndex: $scope.skipIndex
							};
							var callbacks = {
								success: onSuggestionsLoaded,
								error: onSuggestionsError
							};
							$scope.loading = true;

							switch($state.current.name) {
								case "top.controversial" :
									Parse.Cloud.run('topSubmissionsByTotalVotes', options, callbacks);
									break;
								case "top.worst":
									Parse.Cloud.run('topSubmissionsByTotalVotes', options, callbacks);
									break;
								case "top.best":
								default :
									Parse.Cloud.run('topSubmissionsByTotalVotes', options, callbacks);
									break;
							}
						}
					}

					function onSuggestionsLoaded(suggestions) {
						if(suggestions.length < $scope.pageSize) {
							$scope.allLoaded = true;
						}
						cardService.cache(suggestions);
						$scope.suggestions = $scope.suggestions.concat(suggestions);
						$scope.skipIndex += suggestions.length;
						$scope.loading = false;
						$scope.$digest();
					}

					function onSuggestionsError(error) {
						console.log('couldn\'t find any pairs:', error);
					}

					// // init
					$scope.loadSuggestions();

				}
			}
		}]);
	}
);