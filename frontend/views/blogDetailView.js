'use strict';
app.controller('blogDetailView', function(post, $scope, $sce, $compile, $state, $location, $window) {
	$window.scrollTo(0, 0);
	$scope.post = post;

	var structuredText = post.getStructuredText('blog.body');
	$scope.bodyHtml = structuredText.asHtml();
	$scope.mainImage = post.getImageView('blog.image', 'main');
	$scope.mainEmbed = post.getHtml('blog.embed');
	$scope.mainYoutube = post.getText('blog.youtube');
	
	//set meta title
	$state.current.title = structuredText.getTitle().text;

	// set meta description
	var shortlede = post.getText('blog.shortlede');
	if (shortlede)
		$state.current.description = shortlede;

	var allowComments = post.get('blog.allow_comments');
	$scope.disqus = {
		shortname: 'godhatescharades',
		id: post.id,
		url: 'http://godhatescharades.com' + $location.url(),
		show: allowComments || true
	};

	$scope.backToBlog = function() {
		$state.go('blog');
		$window.scrollTo(0, 0);
	};
});