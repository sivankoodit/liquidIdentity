var liquidApp = angular.module('liquidAccessApp');
liquidApp.controller('showQRCodeCtrl', ['AuthService', function($scope, $modalInstance, currentUrl, AuthService ){

    this.refreshCode = function()  {
        // call register from service
        var token = AuthService.getAuthToken();
        var onlyToken = token.substr(4);
        this.qrUrl = $uibModalInstance.currentUrl + "?info=" + onlyToken;
    };

    this.close = function() {
        $uibModalInstance.close();
    };
}]);


/* liquidApp.controller('switchController', ['$scope', '$window', 'AuthService', '$location', '$routeParams', function($scope, $window, AuthService, $location, $routeParams) {
    var vm = this;
    var switchInfo = $routeParams.info;

    this.init = function(){
        // User is switching from some other device
        if(switchInfo) {
            // call register from service
            AuthService.getTransferInfo(switchInfo)
            // handle success
                .then(function (response) {
                    console.log(response);
                    vm.welcomeMsg = "Welcome " + response.user.firstname + " " + response.user.lastname;
                })
                // handle error
                .catch(function (errResponse) {
                    vm.welcomeMsg = "Welcome! Login to access subscriber contents";
                });
        }
    };

    this.init();

    this.refreshCode = function()  {
        // call register from service
        var token = AuthService.getAuthToken();
        var onlyToken = token.substr(4);

        this.qrUrl = $location.absUrl() + "?info=" + onlyToken;
    };
}]);
*/