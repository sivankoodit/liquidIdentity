    'use strict';
 
    angular
        .module('liquidAccessApp')
        .controller('loginController', ['$location', 'AuthenticationService', 'FlashService',  function ($location, AuthenticationService, FlashService) {
        var vm = this;
 
        vm.login = login;
 
        (function initController() {
            // reset login status
            AuthenticationService.ClearSession();
        })();
 
        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.userEmail, vm.userPwd, function (response) {
                if (response.success) {
					vm.dataLoading = false;
                    AuthenticationService.PersistUser();
                    $location.path('#/');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        };
    }]);
 

