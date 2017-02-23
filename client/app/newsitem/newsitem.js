var liquidApp = angular.module('liquidAccessApp');

liquidApp.controller('newsitemCtrl', function($scope) {
	this.itemInfo = {		
		title: null,
		content: null,
		comments: []
	}

	this.loadNewsItem = function() {
		// get news item
		// get list of comments
	}

	this.login = function()  {
		if(email && password) {			
			// Call server
		}
	};

	this.addComment = function() {
		var comment = {
			user: userName,
			text: userText
		}
	};


});
