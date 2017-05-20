angular.module('liquidAccessApp').factory('AuthService',
    ['$q', '$timeout', '$http',
        function ($q, $timeout, $http) {

            // create user variable
            var CURRENT_USER = "currentUser";
            var LOCAL_TOKEN_KEY = 'yourTokenKey';


            function loadUserCredentials() {
		        console.log("In loadUserCredentials");
                var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
                if (token) {
                    SetAuthHeader(token);
                }
            }

            function storeUserDetails(token, user) {
                window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
                window.localStorage.setItem(CURRENT_USER, angular.toJson(user));
                SetAuthHeader(token);
            }

            function SetAuthHeader(token) {
                // Set the token as header for your requests!
                $http.defaults.headers.common.Authorization = token;
            }

            function destroyUserDetails() {
                $http.defaults.headers.common.Authorization = undefined;
                window.localStorage.removeItem(LOCAL_TOKEN_KEY);
                window.localStorage.removeItem(CURRENT_USER);
            }

            function getCurrentUser() {
                var strUser = window.localStorage.getItem(CURRENT_USER);
                if(strUser)
                    return angular.fromJson(strUser);
                else
                    return null;
            }

            loadUserCredentials();
            // return available functions for use in the controllers
            return ({
                getUserInfo: getUserInfo,
                login: login,
                logout: logout,
                register: register,
                getAuthToken: getAuthToken,
                getCurrentUser: getCurrentUser,
                liquidAccess: liquidAccess,
                getTransferCode: getTransferCode
            });


            function getAuthToken() {
                return $http.defaults.headers.common.Authorization;
            }

            function getUserInfo() {

                // create a new instance of deferred
                var deferred = $q.defer();

                $http.get('/api/memberinfo')
                // handle success
                    .success(function (data) {
                        if(data.success){
                            deferred.resolve(data);
                        } else {
                            currentUser = null;
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        currentUser = null;
                        deferred.reject();
                    });
                return deferred.promise;
            }

            function getTransferCode() {

                // create a new instance of deferred
                var deferred = $q.defer();

                $http.get('/api/transfercode')
                // handle success
                    .success(function (data) {
                        if(data.success){
                            deferred.resolve(data);
                        } else {
                            currentUser = null;
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        currentUser = null;
                        deferred.reject();
                    });
                return deferred.promise;
            }

            function login(email, password) {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/api/authenticate',
                    {email: email, password: password})
                // handle success
                    .success(function (data, status) {
                        if(status === 200 && data.token){
                            storeUserDetails(data.token, data.user);
                            deferred.resolve(data);
                        } else {
                            currentUser = null;
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        // Not the right way!?
                        console.log("inside catch in auth.js" + data);
                        currentUser = null;
                        deferred.resolve(data);
                    });

                // return promise object
                return deferred.promise;

            }

            function logout() {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a get request to the server
                $http.post('/api/logout')
                // handle success
                    .success(function (data) {
                        destroyUserDetails();
                        deferred.resolve();
                    })
                    // handle error
                    .error(function (data) {
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function register(firstname, lastname, password, email, formData) {

                // create a new instance of deferred
                var deferred = $q.defer();

                formData.append('firstname', firstname);
                formData.append('lastname', lastname);
                formData.append('password', password);
                formData.append('email', email);

                // send a post request to the server
                $http.post('/api/signup', formData,
                    {transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}})
                // handle success
                    .success(function (data, status) {
                        console.log(data);
                        console.log(status);
                        if(status === 200 && data.token){
                            storeUserDetails(data.token, data.user);
                            deferred.resolve(data);
                        } else {
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function liquidAccess(code) {

                // create a new instance of deferred
                var deferred = $q.defer();

                $http.get('/api/lqaccess/' + code)
                // handle success
                    .success(function (data) {
                        if(data && data.success && data.token){
                            storeUserDetails(data.token, data.user);
                            deferred.resolve(data);
                        } else {
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        currentUser = null;
                        deferred.reject();
                    });
                return deferred.promise;
            }

        }]);
