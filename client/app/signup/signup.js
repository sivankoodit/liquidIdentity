var liquidApp = angular.module('liquidAccessApp');

liquidApp.controller('signupCtrl', function($scope) {
	this.userinfo = {
		firstname= null;
		lastname = null;
		email = null;
		password = null;
		confirmpwd = null;
		agreedToTerms = null;
	}

	this.signup = function()  {
		if(password && password !== confirmpwd) {
			console.log('Error');
		} else if(!agreedToTerms) {
		}
		else {
			// Call server
		}
	};		
});
