/*global cordova, module*/

module.exports = {
    extract: function (id, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "Videomega", "extract", [id]);
    }
};
