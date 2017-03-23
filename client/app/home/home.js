/**
 * Created by siva on 23/02/2017.
 */
var liquidApp = angular.module('liquidAccessApp');

liquidApp.controller('homeController', ['$scope', '$window', 'AuthService', 'NewsService', '$location', function($scope, $window, AuthService, NewsService, $location) {
    var vm = this;
    this.news = undefined;
    this.navInfo = undefined;

    var getNavigatorInfo = function () {

        vm.navInfo = {
          appCodeName: navigator.appCodeName,
            appName: navigator.appName,
            version: navigator.appVersion,
            platform: navigator.platform,
            ua: navigator.userAgent,
            fullInfo: navigator
        };
        console.log(vm.navInfo);
    };

    getNavigatorInfo();

    var getHeadLines = function() {
        NewsService.getHeadlines()
        // handle success
            .then(function (response) {
                console.log(response);
                vm.news = response.news;
            })
            // handle error
            .catch(function (errResponse) {
                console.log("Error getting headlines: "+ errResponse);
            });
    };
    getHeadLines();

    this.showDetailedNews = function(title) {

        var user = AuthService.getCurrentUser();
        // call register from service
        if(user)
        {
            NewsService.setCurrentItem(title);
            $location.path("/newsitem/");
        }
        else
        {
            window.alert("Login to access subscriber content");
        }
    };

}]);
