var liquidApp = angular.module('liquidAccessApp');

liquidApp.controller('newsItemController', ['NewsService', 'uiSyncService', '$routeParams', '$location', '$anchorScroll',
    function(NewsService, uiSyncService, $routeParams, $location, $anchorScroll) {

    var vm = this;
        vm.newsItem = undefined;
        vm.commentText = null;
        vm.currentItemTitle = null;
        vm.elemToViewId = null;

        vm.recordPosition = function(event) {
        if(event.target.id) {
            console.log(event.target.id);
            uiSyncService.setElemInView(event.target.id);
        }
    }

        vm.loadNewsItem = function() {

        vm.elemToViewId = uiSyncService.getElemInView();

        //$anchorScroll.disableAutoScrolling();

        vm.currentItemTitle = NewsService.getCurrentItem();

        if(vm.currentItemTitle) {

            // get news item
            // get list of comments
            NewsService.getNewsItem(vm.currentItemTitle)
            // handle success
                .then(function (response) {
                    console.log(response);
                    vm.commentText = '';
                    vm.newsItem = response.newsItem;
                })
                // handle error
                .catch(function (errResponse) {
                    window.alert("Error getting detailed news: " + errResponse);
                });
        } // end of i
	}

        vm.loadNewsItem();

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

        vm.addComment = function() {
        //NewsService.setAuthHeader();
        // get news item
        // get list of comments
        NewsService.addComment(vm.currentItemTitle, vm.commentText)
        // handle success
            .then(function (response) {
                console.log(response);
                //uiSyncService.setElemInView(null);
                vm.loadNewsItem();
            })
            // handle error
            .catch(function (errResponse) {
                window.alert("Error adding comment: "+ errResponse);
            });
	};


}]);
