/**
 * Created by siva on 23/02/2017.
 */
var liquidApp = angular.module('liquidAccessApp');

liquidApp.controller('navBarController', ['AuthService', '$uibModal', '$routeParams', '$location', '$rootScope', function(AuthService, $uibModal, $routeParams, $location, $rootScope) {
    var vm = this;
    this.switchInfo = $routeParams.info;
    this.isLoggedIn = false;

    this.formWelcomeMsg = function() {
	console.log("In formWelcomeMsg");

    	// Get the current logged in user
        AuthService.getUserInfo()
        // handle success
            .then(function (response) {
                console.log(response);
                vm.welcomeMsg = "Hello " + response.user.firstname;
                vm.isLoggedIn = true;
            })
            // handle error
            .catch(function (errResponse) {
		        console.log("Error in formWelcomeMsg: "+ errResponse);
                vm.welcomeMsg = "Welcome! Login to access subscriber contents";
                vm.isLoggedIn = false;
            });
    };

    this.trySwitching = function() {
	console.log("In trySwitching");

        // call register from service
        AuthService.liquidAccess(this.switchInfo)
        // handle success
            .then(function (response) {
                console.log(response);
                vm.welcomeMsg = "Hello " + response.user.firstname;
                vm.isLoggedIn = true;
		        $location.url($location.path());
		
            })
            // handle error
            .catch(function (errResponse) {
		        console.log("Error in trySwitching: "+ errResponse);
                vm.welcomeMsg = "Welcome! Login to access subscriber contents";
            });
        //$location.url($location.path());

    };

    this.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    this.logout = function(){
        // call register from service
        AuthService.logout()
        // handle success
            .then(function () {
                $location.path("/");
            })
            // handle error
            .catch(function () {
                // TODO: Assume that logout always succeeds for now!
            });
    };


    this.showQRCode = function (size) {
        var currentUrl = $location.absUrl();
        var token = AuthService.getAuthToken();
 
        var modelScope = $rootScope.$new();
        var modalInstance = $uibModal.open({
            templateUrl: 'showQRCode.html',
            controller: 'showQRCodeCtrl',
            scope: modelScope,
            size: size,
            resolve: {
                currentUrl: function () {
                    return currentUrl;
                },
                currentToken: function () {
                    return token;
                }
            }
        });

        modalInstance.result.then(function () {
            // do nothing
        }, function () {
            // do nothing
        });
    };


    this.init = function() {
	console.log("In navbar at: " + $location.path()); 
	// User is switching from some other device
        if(this.switchInfo) {
            this.trySwitching();
           
        
	
        
	} else{
		this.formWelcomeMsg();
	}
    };
    this.init();
}]);


liquidApp.controller('showQRCodeCtrl', function( $scope, $modalInstance, currentUrl, currentToken ){

    $scope.refreshCode = function()  {
        // call register from service
        var onlyToken = currentToken.substr(4);
        $scope.qrUrl = currentUrl + "?info=" + onlyToken;
    };

    $scope.close = function() {
        $modalInstance.close();
    };
});
