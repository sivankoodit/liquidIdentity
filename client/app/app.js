var liquidApp = angular.module('liquidAccessApp', ['ngRoute', 'ngCookies']);

liquidApp.config(function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl: "app/home/home.html"
	})
	.when("/signup", {
		templateUrl: "app/signup/signup.html"
	})
	.when("/login", {
		templateUrl: "app/login/login.html"
	})
	.when("/settings", {
		templateUrl: "app/settings/settings.html",
		restricted: true
	})
	.when("/newsitem", {
		templateUrl: "app/newsitem/newsitem.html"
	})
	.when("/switch", {
		templateUrl: "app/switchdevice/switchInfo.html"
	});
	//.otherwise({ redirectTo: '/' });
});
