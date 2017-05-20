var liquidApp = angular.module('liquidAccessApp', ['ngRoute', 'ngCookies', 'ui.bootstrap']);

liquidApp.config(function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl: "app/home/home.html"
	})
	.when("/:?info=", {
		templateUrl: "app/home/home.html"
	})
	.when("/signup", {
		templateUrl: "app/signup/signup.html"
	})
	.when("/signup/:?info=", {
		templateUrl: "app/signup/signup.html"
	})
	.when("/login", {
		templateUrl: "app/login/login.html"
	})
	.when("/login/:?info=", {
		templateUrl: "app/login/login.html"
	})
	.when("/settings", {
		templateUrl: "app/settings/settings.html",
		restricted: true
	})
	.when("/settings/:?info=", {
		templateUrl: "app/settings/settings.html",
		restricted: true
	})
	.when("/newsitem", {
		templateUrl: "app/newsitem/newsitem.html"
	})
	.when("/newsitem/:?info=", {
		templateUrl: "app/newsitem/newsitem.html"
	});
	//.otherwise({ redirectTo: '/' });
});


liquidApp.directive('scrollIf', ['uiSyncService', function (uiSyncService) {
    return function (scope, element, attributes) {
        setTimeout(function () {
            if (scope.$eval(attributes.scrollIf)) {
            	if(attributes["id"] === uiSyncService.getElemInView()) {
                    window.scrollTo(0, element[0].offsetTop - 100)
                }
            }
        });
    }
}]);

liquidApp.directive("ngFileSelect",function(){

    return {
        link: function($scope,el){
            el.bind("change", function(e){
                $scope.file = (e.srcElement || e.target).files[0];
                $scope.getFile();
            })
        }
    }
});
