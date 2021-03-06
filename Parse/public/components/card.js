define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('card', ['parseUser', 'cardService', '$rootScope', function(parseUser, cardService, $rootScope) {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/card.html',
				replace: true,
				scope: {
					id: '=id',
					updatable: '=updatable'
				},
				controller: function($scope, $element) {
					$scope.typeClass = "";
					if($scope.id) {
						var promise = cardService.getCard($scope.id);
						promise.then(onSuccess, onError);
					}

					if($scope.updatable == true) {
						$scope.$watch('id', function(newValue, oldVlue) {
							if(newValue) {
								console.log('id changed to:', newValue);
								var promise = cardService.getCard($scope.id);
								promise.then(onSuccess, onError);
							}
						})
					}

					function onSuccess(card) {
						$scope.card = card;
						$scope.typeClass = cardService.getTypeClass(card);
						if(!$rootScope.$$phase)
							$scope.$digest();
					}

					function onError(error) {
						console.log('error fetching card:', error);
					}
				}
			}
		}]);
	}
);