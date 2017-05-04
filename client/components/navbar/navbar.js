/**
 * Created by siva on 23/02/2017.
 */
var liquidApp = angular.module('liquidAccessApp');

liquidApp.controller('navBarController', ['AuthService', 'uiSyncService', '$uibModal', '$routeParams', '$location', '$rootScope', function(AuthService, uiSyncService, $uibModal, $routeParams, $location, $rootScope) {
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
                vm.welcomeMsg = "Hello " + response.user.name;
                vm.isLoggedIn = true;
            })
            // handle error
            .catch(function (errResponse) {
		        console.log("Error in formWelcomeMsg: "+ errResponse);
                vm.welcomeMsg = "Login or subscribe to get exciting news";
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
                vm.welcomeMsg = "Hello " + response.user.name;
                vm.isLoggedIn = true;
                uiSyncService.reReadElemInView();
		        $location.url($location.path());
		
            })
            // handle error
            .catch(function (errResponse) {
		        console.log("Error in trySwitching: "+ errResponse);
                vm.welcomeMsg = "Login or subscribe to get exciting news";
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
                vm.welcomeMsg = "Login or subscribe to get exciting news";
                vm.isLoggedIn = false;
                $location.path("/");
            })
            // handle error
            .catch(function () {
                // TODO: Assume that logout always succeeds for now!
            });
    };

    this.showQRCode = function(size) {

        console.log(uiSyncService.getElemInView());

        var currentUrl = $location.absUrl();
        var tCode = "";
        // Get the current logged in user
        AuthService.getTransferCode()
        // handle success
            .then(function (response) {
                console.log(response);
                tCode = response.code;
                console.log("Code" + tCode)

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
                            return tCode;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    // do nothing
                }, function () {
                    // do nothing
                });

            })
            // handle error
            .catch(function (errResponse) {
                console.log("Error getting transfer code: "+ errResponse);
            });
    };


    this.showQRCode1 = function (size) {
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

    $scope.qrUrl = currentUrl + "?info=" + currentToken;

    $scope.refreshCode = function()  {
        // call register from service
        var onlyToken = currentToken;
        $scope.qrUrl = currentUrl + "?info=" + currentToken;
    };

    $scope.close = function() {
        $modalInstance.close();
    };
});
