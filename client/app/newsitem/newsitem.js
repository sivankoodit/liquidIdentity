var liquidApp = angular.module('liquidAccessApp');

liquidApp.controller('newsItemController', ['NewsService', 'uiSyncService', '$routeParams', '$location', '$anchorScroll',
    function(NewsService, uiSyncService, $routeParams, $location, $anchorScroll) {

    var vm = this;
	this.newsItem = undefined;
	this.commentText = null;
    this.currentItemTitle = null;
    this.elemToViewId = null;

    this.itemInfo = {
		title: null,
		content: null,
		comments: []
	}

	this.recordPosition = function(event) {
        if(event.target.id) {
            console.log(event.target.id);
            uiSyncService.setElemInView(event.target.id);
        }
    }

	var loadNewsItem = function() {

        this.elemToViewId = uiSyncService.getElemInView();

        //$anchorScroll.disableAutoScrolling();

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

        angular.element(document).ready(function () {
            console.log('page loading completed');
            var elemToViewId = uiSyncService.getElemInView();
            if(elemToViewId) {
                //var domElem = document.getElementById(elemToViewId).scrollIntoView();
                //var elemToView = angular.element(elemToViewId);
                //   $anchorScroll(elemToViewId);
                //$location.hash(elemToViewId);
                //window.scrollTo(0, elemToView.offsetTop - 100);

            }
        });

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
