var liquidApp = angular.module('liquidAccessApp');

liquidApp.controller('navBarCtrl', function($scope) {
	this.userinfo = {
		firstname: null,
		lastname: null,
		email: null,
		password: null,
		confirmpwd: null,
		agreedToTerms: null
	};

	this.getLoggedInUser = function()  {
		
			// Call server
		
	};		
});
