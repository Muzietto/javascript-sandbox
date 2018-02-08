var Assert = YAHOO.util.Assert;
YAHOO.namespace("test.CpsFlagsTestSuite");
YAHOO.test.CpsFlagsTestSuite = new YAHOO.tool.TestSuite('CpsFlagsTestSuite');
YAHOO.test.CpsFlagsTestSuite.PrimoTest = new YAHOO.tool.TestCase({
    name: 'PrimoTest',
    'setUp': function () {
    },
    'tearDown': function () {
    },
    'test ask is a function': function () {
        Assert.isFunction(ask);
        Assert.isFunction(ask());
    },
    'test ask_old returns click': function () {
        Assert.isTrue(ask_old()());
        click = false;
        Assert.isFalse(ask_old()());
    },
    // rispondi OK e poi Cancel
    'test ask returns whether you obey or not': function () {
        Assert.isTrue(ask('OK')());
        Assert.isFalse(ask('Cancel')());
    },
    // rispondi Cancel e poi OK
//    'test state simple navigation': function () {
//        var myState = state();
//        Assert.areEqual('uno', myState.currentState());
//        myState.navigate('due');
//        Assert.areEqual('uno', myState.currentState());
//        myState.navigate('due');
//        Assert.areEqual('due', myState.currentState());
    },
    'test navigate setting flags': function () {
        var myState = state();
        Assert.areEqual('uno', myState.currentState());
        Assert.isUndefined(myState.getFlag('uno_passed'));
        myState.navigate('due', function () { return flagSetter.apply(myState, ['uno_passed']); });
        Assert.areEqual('due', myState.currentState());
        Assert.isTrue(myState.getFlag('uno_passed'));
    }
});

YAHOO.test.CpsFlagsTestSuite.add(YAHOO.test.CpsFlagsTestSuite.PrimoTest);

YAHOO.util.Event.onDOMReady(function () {
    var logger = new YAHOO.tool.TestLogger();
    YAHOO.tool.TestRunner.add(YAHOO.test.CpsFlagsTestSuite);
    YAHOO.tool.TestRunner.run();
});