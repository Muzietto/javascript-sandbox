var Assert = YAHOO.util.Assert;
YAHOO.namespace("test.CpsAssidirTestSuite");
YAHOO.test.CpsAssidirTestSuite = new YAHOO.tool.TestSuite('CpsAssidirTestSuite');
YAHOO.test.CpsAssidirTestSuite.PrimoTest = new YAHOO.tool.TestCase({
    name: 'PrimoTest',
    'setUp': function () {
    },
    'tearDown': function () {
    },
    'test cpsSwitch is a function': function () {
        Assert.isFunction(CPAS.cpsSwitch);
        Assert.isObject(CPAS.cpsSwitch());
    },
    'test bind switch to mockRadiobuttonSet': function () {
        var radioSet = MOCK.radioSet();
        var sw = CPAS.cpsSwitch(function () { alert('YES') }, function () { alert('NO') });
        var view = MOCK.view();
        view.bind(radioSet, sw);
       // radioSet.clicked('1');
    },
    'test bind clickHandler to three radiobuttons': function () {
        var radio_SI = MOCK.radio('SI');
        var radio_NO = MOCK.radio('NO');
        var radio_NR = MOCK.radio('NR');
        var ch = CPAS.clickHandler(
            {
                'SI': function () { alert('SI'); },
                'NO': function () { alert('NO'); },
                'NR': function () { alert('NR'); }
            }
        );
        var view = MOCK.view();
        view.bind(radio_SI, ch);
        view.bind(radio_NO, ch);
        view.bind(radio_NR, ch);
        //radio_SI.clicked();
        //radio_NR.clicked();
    }
});

YAHOO.test.CpsAssidirTestSuite.add(YAHOO.test.CpsAssidirTestSuite.PrimoTest);

YAHOO.util.Event.onDOMReady(function () {
    var logger = new YAHOO.tool.TestLogger();
    YAHOO.tool.TestRunner.add(YAHOO.test.CpsAssidirTestSuite);
    YAHOO.tool.TestRunner.run();
});