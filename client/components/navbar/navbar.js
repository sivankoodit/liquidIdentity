/**
 * Created by siva on 23/02/2017.
 */
var liquidApp = angular.module('liquidAccessApp');

liquidApp.controller('navBarController', ['AuthService', '$uibModal', '$routeParams', '$location', '$rootScope', '$scope', function(AuthService, $uibModal, $routeParams, $location, $rootScope, $scope) {
    var vm = this;
    this.switchInfo = $routeParams.info;
    this.isLoggedIn = false;

    this.formWelcomeMsg = function() {

    	// call register from service
        AuthService.getUserInfo()
        // handle success
            .then(function (response) {
                console.log(response);
                vm.welcomeMsg = "Hello " + response.user.firstname;
                vm.isLoggedIn = true;
            })
            // handle error
            .catch(function (errResponse) {
                vm.welcomeMsg = "Welcome! Login to access subscriber contents";
            });
    };

    this.trySwitching = function() {

        // call register from service
        AuthService.liquidAccess(this.switchInfo)
        // handle success
            .then(function (response) {
                console.log(response);
                vm.welcomeMsg = "Hello " + response.user.firstname;
                vm.isLoggedIn = true;
            })
            // handle error
            .catch(function (errResponse) {
                vm.welcomeMsg = "Welcome! Login to access subscriber contents";
            });
        $location.url($location.path());

    };

    this.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    this.logout = function(){
        // call register from service
        AuthService.logout()
        // handle success
            .then(function () {
                vm.isLoggedIn = false;
                vm.welcomeMsg = "Welcome! Login to access subscriber contents";
            })
            // handle error
            .catch(function () {
                // TODO: Assume that logout always succeeds for now!
            });
    };


    this.showQRCode = function (size) {
        $scope.currentUrl = $location.absUrl();
        $scope.token = AuthService.getAuthToken();

        var modelScope = $rootScope.$new();
        var modalInstance = $uibModal.open({
            templateUrl: 'showQRCode.html',
            controller: 'showQRCodeCtrl',
            scope: modelScope,
            size: size,
            resolve: {
                currentUrl: function () {
                    return $scope.currentUrl;
                },
                currentToken: function () {
                    return $scope.token;
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
        // User is switching from some other device
        if(this.switchInfo) {
            this.trySwitching();
        }
        else {
            this.formWelcomeMsg();
        }
        this.currentUrl = $location.absUrl();
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
