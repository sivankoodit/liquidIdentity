/**
 * Created by siva on 27/04/2017.
 */
/**
 * Created by siva on 10/03/2017.
 */

angular.module('liquidAccessApp').factory('uiSyncService', ['$cookies', function($cookies) {

    var currentElemInView = null;
    return({
        getElemInView: getElemInView,
        setElemInView: setElemInView
    });

    function getElemInView(){
        if(!currentElemInView) {
            currentElemInView = $cookies.get('currentElem'); //currentTitle = window.localStorage.getItem(CURRENT_TITLE);
        }
        return currentElemInView;
    };

    function setElemInView(elemId) {
        $cookies.put('currentElem', elemId);
        currentElemInView = elemId;
    };

}]);