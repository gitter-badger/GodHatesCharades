'use strict';
app.directive('suggestionSelector', function(cardService, $filter, $state) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/suggestionSelector.html',
		replace: true,
		link: function($scope, $element) {
			// $scope.$watch('pairIndex', $scope.onPairIndexChanged);
		},
		controller: function($scope, $element) {
			// public vars
			$scope.cardService = cardService;
			$scope.loading = false;
			$scope.suggestions = [];
			$scope.skipIndex = 0; //TODO: make private
			$scope.allLoaded = false;
			$scope.tab = 'best';

			// Public methods
			$scope.reloadSuggestions = function(tab) {
				$scope.tab = tab;
				$scope.suggestions = [];
				$scope.skipIndex = 0;
				$scope.allLoaded = false;
				$scope.loadSuggestions();
			};

			$scope.loadSuggestions = function() {
				console.log($state.current.name);
				if(!$scope.loading && !$scope.allLoaded) {
					var options = {
						skipIndex: $scope.skipIndex
					};
					var callbacks = {
						success: onSuggestionsLoaded,
						error: onSuggestionsError
					};
					$scope.loading = true;
					Parse.Cloud.run('getAllSuggestions', options, callbacks);
				}
			};

			$scope.selectSuggestion = function(suggestion) {
				console.log('selectSuggestion');
				$scope.$emit('suggestionAdded', suggestion);
			};

			// Private methods

			function onSuggestionsLoaded(suggestions) {
				$scope.allLoaded = true;
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
	};
});