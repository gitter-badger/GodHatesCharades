exports.stripPrivateData = stripPrivateData;
exports.isUserAdmin = isUserAdmin;

// Removes private data from original object
function stripPrivateData(parseUser) {
	if(!isThisParseUser(parseUser)) {
		delete parseUser.attributes.email;
		delete parseUser.attributes.username;
		delete parseUser.attributes.ACL;
		delete parseUser.attributes.admin;
		delete parseUser.attributes.beta;
		delete parseUser.createdAt;
		delete parseUser.updatedAt;
		// console.log(parseUser);
	}
}

function isThisParseUser(parseUser) {
	var current = Parse.User.current();
	if(current && current.id === parseUser.id)
		return true;
	else
		return false;
}

// method should not be exposed to raw requests
function isUserAdmin(userId) {
	// to allow fetching users
	Parse.Cloud.useMasterKey();

	var query = new Parse.Query(Parse.User);
	var promise = query.get(userId)
		.then(function (user) {
			if(user && user.get('admin')) {
				return true;
			} else {
				return false;
			}
		})
	return promise;
}