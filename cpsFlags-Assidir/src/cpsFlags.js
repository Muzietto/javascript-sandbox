
var click = true;

// this = currentState
var userChoiceNotifier = function (outcome) { return confirm('scegli ' + outcome); };

// this = currentState
var validator = function (func) { return func ? func() : confirm('validato?'); };

var ask_old = function () { return function () { return click; } };

var ask = function (message) {
    return function () {
        return userChoiceNotifier.apply(this, [message]); 
    } 
};

// this = currentState
var flagSetter = function (flagName, flagValue) {
    this.getFlags()[flagName] = flagValue ? flagValue : true;
    return true;
};


var state = function () {
    var _currentState = 'uno';
    var _flags = {};
    return {
        navigate: function (nextState, func) {
            _currentState = validator(func) ? nextState : _currentState;
        },
        currentState: function () { return _currentState; },
        getFlag: function (flagName) { return _flags[flagName]; },
        getFlags: function () { return _flags; }
    };
};
