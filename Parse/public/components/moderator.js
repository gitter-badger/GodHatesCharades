define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('moderator', ['cardService', '$compile', function(cardService, $compile) {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/moderator.html',
				replace: true,
				scope: true,
				controller: function($scope, $element) {
					// public vars
					var suggestions = [];
					$scope.index = 0;
					$scope.loading = true;
					$scope.suggestion = null;
					$scope.legalMod = '';
					$scope.allApproved = false;
					$scope.errorMessage;
					
					Parse.Cloud.run(
						'getUnmoderatedSuggestions',
						{}, 
						{
							success: onSuggestionsLoaded,
							error: onSuggestionsError
						}
					);

					// Private methods

					function onSuggestionsLoaded(newSuggestions) {
						if(newSuggestions.length > 0) {
							suggestions = newSuggestions;
							cardService.cache(suggestions);
							$scope.suggestion = suggestions[$scope.index];
							$scope.suggestionText = $scope.suggestion.get('text');
							$scope.allApproved = false;
						} else {
							$scope.allApproved = true;
						}
						$scope.loading = false;
						$scope.$digest();
					}

					function loadNext() {
						if($scope.index + 1 < suggestions.length) {
							$scope.index++;
							$scope.suggestion = suggestions[$scope.index];
							$scope.suggestionText = $scope.suggestion.get('text');
							$compile($element);
						} else {
							$scope.allApproved = true;
						}
					}

					function onSuggestionsError(error) {
						$scope.loading = false;
						$scope.allApproved = true;
						$scope.errorMessage = error.message;
						console.log('couldn\'t find any unapproved suggestions:', error);
						
						$scope.$digest();
					}

					// Public Methods

					$scope.skip = function() {
						console.log('skip:', $scope.suggestion.id);
						loadNext();
					}

					$scope.approve = function() {
						$scope.suggestion.set('moderated', true);
						$scope.suggestion.set('rejected', false);
						$scope.suggestion.set('text', $scope.suggestionText);
						$scope.suggestion.save();

						loadNext();
					}

					$scope.disapprove = function() {
						$scope.suggestion.set('moderated', true);
						$scope.suggestion.set('rejected', true);
						$scope.suggestion.save();

						loadNext();
					}

					// Watch
					$scope.$watch('legalMod', function(newValue, oldValue, scope) {
						if($scope.suggestion) {
							var sansLegal = $scope.suggestionText.replace(/ (®|©|™)/, '');
							$scope.suggestionText = sansLegal + ' ' + $scope.legalMod;
						}
					});

				}
			}
		}]);
	}
);