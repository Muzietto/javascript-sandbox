var tddjs = (function () {
    function namespaceFn(string) {
        var object = this;
        var levels = string.split('.');
        for (var i = 0, levelCounter = levels.length; i < levelCounter; i++) {
            // creates non-existing objects
            if (typeof object[levels[i]] == 'undefined') {
                object[levels[i]] = {};
            }
            object = object[levels[i]];
        }
        return object;
    }
    var _counter = 0;
    function uidFn(obj) {
        if (typeof obj.__uid != 'number') {
            obj.__uid = _counter++;
        }
        return obj.__uid;
    }
    return {
        namespace: namespaceFn,
        uid: uidFn
    };
} ());

tddjs.isHostMethod = (function () {
    function isHostMethod(object, property) {
        var type = typeof object[property];
        return type == "function" ||
        (type == "object" && !!object[property]) ||
        type == "unknown";
    }
    return isHostMethod;
} ());