battlescape = window.battlescape || {};

(function(external){

external.utils = {};

external.utils.keys = function(obj) {
    var keys = []
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    return keys;
}

external.utils.values = function(obj) {
    var keys = external.utils.keys(obj);
    var values = [];
    for (i in keys) {
        var key = keys[i];
        values.push(obj[key]);
    }
    return values;
}

}(battlescape));