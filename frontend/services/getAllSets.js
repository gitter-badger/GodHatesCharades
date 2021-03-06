'use strict';
app.service('sets', function($q, $rootScope, Suggestion) {
	// console.log('instantiate sets');
	var sets = {
		data: [],
		getAllSets: getAllSets,
		getAllSetsAndItems: getAllSetsAndItems,
		getSet: getSet,
		byId: {},
		setItemsBySetId: {},
		setItemsByCardBySetId: {},
		setIdsByCardId: {},
		deleteSet: deleteSet,
		createSet: createSet,
		getSetItemsForSet: getSetItemsForSet,
		addCardToSet: addCardToSet,
		removeSetItem: removeSetItem,
		removeCardFromSet: removeCardFromSet
	};

	function getAllSets(scope) {
		console.log('sets loadData');
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'getAllSets',
			{},
			{
				success: function(setData) {
					// save data
					sets.data = setData;
					//index by id
					sets.byId = _.indexBy(setData, 'id');
					// resolve deffered
					deferred.resolve(setData);
					// digest if scope is passed in
					if(scope) {
						scope.$digest();
					} else {
						$rootScope.$digest();
					}
				},
				error: function(err) {
					deferred.reject(err);
					// if (scope)
					// 	scope.$digest();
				}
			}
		);
		return deferred.promise;
	}

	function getAllSetsAndItems(scope) {
		return getAllSets().then(_getAllSetItemsForSets);

		function _getAllSetItemsForSets(allSets) {
			var setItemPromises = [];
			_.each(sets.byId, function(set) {
				setItemPromises.push(getSetItemsForSet(set));
			});
			return $q.all(setItemPromises)
			.then(function() {
				return sets.setIdsByCardId;
			});
		}
	}

	function getSet(id) {
		var cachedSet = sets.byId[id];
		if(cachedSet) {
			return $q.when(cachedSet);
		} else {
			var deferred = $q.defer();
			getAllSets()
			.then(function(allSets) {
				var theSet = sets.byId[id];
				if(theSet) {
					deferred.resolve(theSet);
				} else {
					deferred.reject({
						message: 'set not found'
					});
				}
			})
			return deferred.promise;
		}
	}

	function createSet(setData) {
		var deferred = $q.defer();
		
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'createSet',
			setData,
			{
				success: _onSetCreated,
				error: _onCreateError
			}
		);

		function _onSetCreated(newSet) {
			sets.data.push(newSet);
			sets.byId[newSet.id] = newSet;
			deferred.resolve(newSet);
		}

		function _onCreateError(err) {
			deferred.reject(err);
		}

		return deferred.promise;
	}

	var gettingSetItemsPromises = {};
	function getSetItemsForSet(set) {
		console.log('sets getSetItemsForSet');
		if (gettingSetItemsPromises[set.id]) {
			// return promise so we dont make the call twice
			return gettingSetItemsPromises[set.id];
		} else {
			var deferred = $q.defer();
			// save promise if needed
			gettingSetItemsPromises[set.id] = deferred.promise;
			Parse.Cloud.run(
				CONFIG.PARSE_VERSION + 'getCardsForSet',
				{
					id: set.id,
					includeOwner: true
				},
				{
					success: function(setItems) {
						delete gettingSetItemsPromises[set.id];
						_.each(setItems, cacheSetItem);
						deferred.resolve(setItems);
					},
					error: function(err) {
						delete gettingSetItemsPromises[set.id];
						deferred.reject(err);
						// if (scope)
						// 	scope.$digest();
					}
				}
			);
			return deferred.promise;
		}
	}

	function cacheSetItem(setItem) {
		var setId = setItem.attributes.owner.attributes.id;
		var card = setItem.attributes.card;
		// cache card
		setItem.attributes.card = Suggestion.inject(card);

		// index sets by Card Id
		if(!sets.setIdsByCardId[card.id]) {
			sets.setIdsByCardId[card.id] = [];
		}
		if(sets.setIdsByCardId[card.id].indexOf(setId) === -1) {
			sets.setIdsByCardId[card.id].push(setId);
		}
		// index setItem by Card Id
		if(!sets.setItemsByCardBySetId[card.id]) {
			sets.setItemsByCardBySetId[card.id] = {};
		}
		sets.setItemsByCardBySetId[card.id][setId] = setItem;

		if(!sets.setItemsBySetId[setId]) {
			sets.setItemsBySetId[setId] = [];
		}
		var existingCache = _.findWhere(sets.setItemsBySetId[setId], {id:setItem.id}) ;
		if(!existingCache) {
			sets.setItemsBySetId[setId].push(setItem);
		}
	}

	function removeSetItemCache(setItem) {
		var cardId = setItem.attributes.card.attributes.id;
		var setId = setItem.attributes.owner.attributes.id;
		delete sets.setItemsByCardBySetId[cardId][setId];

		var setList = sets.setIdsByCardId[cardId];
		var index = setList.indexOf(setId);
		if(index !== -1) {
			setList.splice(index, 1);
		}

		setList = sets.setItemsBySetId[setId];
		index = setList.indexOf(setItem);
		if(index !== -1) {
			setList.splice(index, 1);
		}
	}

	function addCardToSet(card, set) {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'addCardToSet',
			{
				card: card.id,
				set: set.id
			},
			{
				success: function(setItem) {
					// update data
					cacheSetItem(setItem);
					deferred.resolve(setItem);
				},
				error: function(err) {
					deferred.reject(err);
				}
			}
		);
		return deferred.promise;
	}

	function removeSetItem(setItem) {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'removeSetItem',
			{
				id: setItem.id
			},
			{
				success: function(success) {
					// cleanup indexes
					removeSetItemCache(setItem);
					deferred.resolve(success);
				},
				error: function(err) {
					deferred.reject(err);
				}
			}
		);
		return deferred.promise;
	}

	function removeCardFromSet(card, set) {
		var setItem = sets.setItemsByCardBySetId[card.id][set.id];
		return removeSetItem(setItem);
	}

	return sets;
});