/**
 * Created by siva on 10/03/2017.
 */

angular.module('liquidAccessApp').factory('NewsService',
    ['$q', '$timeout', '$http',
        function ($q, $timeout, $http) {

            var CURRENT_TITLE = "currentTitle";
            var LOCAL_TOKEN_KEY = 'yourTokenKey';

            var currentTitle = undefined;

            // return available functions for use in the controllers
            return ({
                getHeadlines: getHeadlines,
                getNewsItem: getNewsItem,
                addComment: addComment,
                setCurrentItem: setCurrentItem,
                getCurrentItem: getCurrentItem,
                setAuthHeader: setAuthHeader
            });

            function setCurrentItem(title) {
                currentTitle = title;
                window.localStorage.setItem(CURRENT_TITLE, title);
            };

            function getCurrentItem(title) {
                if(!currentTitle)
                    currentTitle = window.localStorage.getItem(CURRENT_TITLE);
                return currentTitle;
            };

            function setAuthHeader(token) {
                var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
                if (token) {
                    $http.defaults.headers.common.Authorization = token;
                }
            }



            function getHeadlines() {
                // create a new instance of deferred
                var deferred = $q.defer();
                $http.get('/news/headlines/')
                // handle success
                    .success(function (data) {
                        if(data && data.success){
                            deferred.resolve(data);
                        } else {
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        deferred.reject();
                    });
                return deferred.promise;
            };

            function getNewsItem(title) {
                // create a new instance of deferred
                var deferred = $q.defer();
                $http.get('/news/newsitem/' + title)
                // handle success
                    .success(function (data) {
                        if(data && data.success){
                            deferred.resolve(data);
                        } else {
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        deferred.reject();
                    });
                return deferred.promise;
            };

            function addComment(title, text) {
                // create a new instance of deferred
                var deferred = $q.defer();
                $http.post('/news/addComment', {newsTitle: title, comment: text})
                // handle success
                    .success(function (data) {
                        if(data && data.success){
                            deferred.resolve(data);
                        } else {
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        deferred.reject();
                    });
                return deferred.promise;
            };



        }]);

