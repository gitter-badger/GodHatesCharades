'use strict';
// var _ = require('underscore');
var PairObject = Parse.Object.extend('Pair');
var SuggestionObject = Parse.Object.extend('Suggestion');
var userUtils = require('cloud/v2/userUtils.js');

exports.recordGuessed = recordGuessed;
exports.recordStumped = recordStumped;
exports.recordChosenAndSkipped = recordChosenAndSkipped;
exports.getPairById = getPairById;
exports.getPairsByCard = getPairsByCard;

function recordGuessed (request, response) {
	Parse.Cloud.useMasterKey();
	var guessedActor = new SuggestionObject();
	guessedActor.id = request.params.guessedActor;
	var guessedScenario = new SuggestionObject();
	guessedScenario.id = request.params.guessedScenario;
	var appVersion = request.params.appVersion;
	var appPlatform = request.params.appPlatform;

	getPair(guessedActor, guessedScenario, appVersion, appPlatform)
	.then(function success(pair) {
		if (!pair)
			pair = getNewPairObj(guessedActor, guessedScenario, appVersion, appPlatform);

		pair.increment('guessed');
		return pair.save();
	}, onErr)
	.then(function success() {
		response.success();
	}, onErr);

	function onErr(err) {
		console.error('recordGuessed save error ' + err.code + ' : ' + err.message);
		response.error(err);
	}
}

function recordStumped (request, response) {
	Parse.Cloud.useMasterKey();
	var stumpedActor = new SuggestionObject();
	stumpedActor.id = request.params.stumpedActor;
	var stumpedScenario = new SuggestionObject();
	stumpedScenario.id = request.params.stumpedScenario;
	var appVersion = request.params.appVersion;
	var appPlatform = request.params.appPlatform;

	getPair(stumpedActor, stumpedScenario, appVersion, appPlatform)
	.then(function success(pair) {
		if (!pair)
			pair = getNewPairObj(stumpedActor, stumpedScenario, appVersion, appPlatform);

		pair.increment('stumped');
		return pair.save();
	}, onErr)
	.then(function success() {
		response.success();
	}, onErr);

	function onErr(err) {
		console.error('recordGuessed save error ' + err.code + ' : ' + err.message);
		response.error(err);
	}
}

function recordChosenAndSkipped (request, response) {
	Parse.Cloud.useMasterKey();
	var chosenActor = new SuggestionObject();
	chosenActor.id = request.params.chosenActor;
	var chosenScenario = new SuggestionObject();
	chosenScenario.id = request.params.chosenScenario;
	var skippedActor = new SuggestionObject();
	skippedActor.id = request.params.skippedActor;
	var skippedScenario = new SuggestionObject();
	skippedScenario.id = request.params.skippedScenario;
	var appVersion = request.params.appVersion;
	var appPlatform = request.params.appPlatform;

	// save stats, but dont wait around for em
	chosenActor.increment('totalVotes');
	chosenActor.save();
	chosenScenario.increment('totalVotes');
	chosenScenario.save();
	skippedActor.increment('skipped');
	skippedActor.save();
	skippedScenario.increment('skipped');
	skippedScenario.save();

	//find chosen pair
	getPair(chosenActor, chosenScenario, appVersion, appPlatform)
	.then(function success(chosenPair) {
		// console.log('chosen pair found:', chosenPair);
		// create new obj if needed
		if (!chosenPair)
			chosenPair = getNewPairObj(chosenActor, chosenScenario, appVersion, appPlatform);

		chosenPair.increment('displayed');
		chosenPair.increment('chosen');
		return chosenPair.save();
	}, onErr)
	.then(function success() {
		// get skipped pair
		return getPair(skippedActor, skippedScenario, appVersion, appPlatform);
	}, onErr)
	.then(function success(skippedPair) {
		// console.log('skipped pair found:', skippedPair);

		// create new obj if needed
		if (!skippedPair)
			skippedPair = getNewPairObj(skippedActor, skippedScenario, appVersion, appPlatform);

		skippedPair.increment('displayed');
		skippedPair.increment('skipped');

		return skippedPair.save();
	}, onErr)
	.then(function success() {
		response.success();
	}, onErr);

	function onErr(err) {
		console.log('onErr');
		console.log(err);
		if(err) {
			if (err.code) {
				console.error('recordChosenAndSkipped save error ' + err.code + ' : ' + err.message);
			} else {
				console.error('recordChosenAndSkipped save error ' + err);
			}
		}
		response.error(err);
	}
}

function getPair(actor, scenario, appVersion, appPlatform) {
	var query = new Parse.Query(PairObject);
	query.equalTo('actor', actor);
	query.equalTo('scenario', scenario);
	query.equalTo('version', appVersion);
	query.equalTo('platform', appPlatform);
	return query.first();
}

function getNewPairObj(actor, scenario, appVersion, appPlatform) {
	var newPair = new PairObject();
	newPair.set('version', appVersion);
	newPair.set('platform', appPlatform);
	newPair.set('actor', actor);
	newPair.set('scenario', scenario);
	return newPair;
}

function getPairById(request, response) {
	Parse.Cloud.useMasterKey();
	var pairId = request.params.id;
	if(pairId !== undefined) {
		// console.log('getPair fetchData');
		var PairObject = Parse.Object.extend('Pair');
		var query = new Parse.Query(PairObject);
		query.include('actor.owner');
		query.include('scenario.owner');
		query.get(pairId, {
			success: onSuccess,
			error: onError
		});
	} else {
		response.error('you must pass a set id to get');
	}

	function onSuccess(pair) {
		userUtils.stripPrivateData(pair.attributes.actor.attributes.owner);
		userUtils.stripPrivateData(pair.attributes.scenario.attributes.owner);
		response.success(pair);
	}

	function onError(error) {
		console.log('getPair Error');
		response.error(error);
	}

}

function getPairsByCard(request, response) {
	console.log('addCardToSet');
	// Parse.Cloud.useMasterKey();
	var cardId = request.params.cardid;
	var cardType = request.params.cardtype;
	// console.log('request.user.id:' + request.user.id);
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(getPair, onError);
	} else {
		onError();
	}

	function getPair() {
		Parse.Cloud.useMasterKey();
		if(cardId !== undefined) {
			console.log('getPair fetchData');
			console.log(cardType);
			console.log(cardId);
			console.log('--');
			var SuggestionObject = Parse.Object.extend('Suggestion');
			var mockCard = new SuggestionObject();
			mockCard.id = cardId;
			var PairObject = Parse.Object.extend('Pair');
			var query = new Parse.Query(PairObject);
			query.descending('displayed');
			query.include('actor.owner');
			query.include('scenario.owner');
			query.limit(50);
			query.equalTo(cardType, mockCard);
			query.find({
				success: onSuccess,
				error: onError
			});
		} else {
			response.error('you must pass a pair id to get');
		}
	}

	function onSuccess(pairs) {
		console.log('onSuccess');
		console.log(pairs)
		response.success(pairs);
	}

	function onError(error) {
		console.log('getPairsByCard Error');
		response.error(error);
	}

}