var liquidApp = angular.module('liquidAccessApp');

liquidApp.controller('newsItemController', ['NewsService', '$routeParams', function(NewsService, $routeParams) {

    var vm = this;
	this.newsItem = undefined;
	this.commentText = null;
    this.currentItemTitle = null;

    this.itemInfo = {
		title: null,
		content: null,
		comments: []
	}

	var loadNewsItem = function() {

        this.currentItemTitle = NewsService.getCurrentItem();

        // get news item
		// get list of comments
        NewsService.getNewsItem(currentItemTitle)
        // handle success
            .then(function (response) {
                console.log(response);
                this.commentText = null;
                vm.newsItem = response.newsItem;
            })
            // handle error
            .catch(function (errResponse) {
                console.log("Error getting detailed news: "+ errResponse);
            });
	}

    loadNewsItem();

	this.addComment = function() {
        //NewsService.setAuthHeader();
        // get news item
        // get list of comments
        NewsService.addComment(currentItemTitle, this.commentText)
        // handle success
            .then(function (response) {
                console.log(response);
                loadNewsItem();
            })
            // handle error
            .catch(function (errResponse) {
                console.log("Error adding comment: "+ errResponse);
            });
	};


}]);
