// tutto si appende a YAHOO
function MarcoTestCase(aNamespace, aTestSuite, aTestCollection) {
    var storage = YAHOO.namespace('test.' + aNamespace + '.userTestSuites');
    storage[aTestSuite] = aTestCollection;
}

// e.g. questo crea YAHOO.test.Erratic.userTestSuites.PathTestSuite
MarcoTestCase('Erratic', 'PathTestSuite', {
    'TestAddSimplePath': function () {
        var testChain = Erratic.chain()
        var singlePath1 = Erratic.path('a', 'b', 23);
        Assert.isTrue(testChain == testChain.addPath(singlePath1));
        Assert.isTrue(singlePath1 == testChain.getPaths()[0]);
    },
    'TestMeasureSimpleDistance': function () {
        var testChain = Erratic.chain().addPath(Erratic.path('a', 'b', 23));
        Assert.isTrue(testChain.connects('a', 'b'), 'connection from a to b not verified');
        Assert.isTrue(testChain.distanceFrom_To('a', 'b') == 23, 'distance between a and b not properly calculated');
    }
});

(function (ns) {
    var Assert = YAHOO.util.Assert;

    // foreach YAHOO.test namespace...
    $.each(ns, function(namespaceName, namespaceContent) {
        // foreach p.es. YAHOO.test.Erratic.userTestSuites[i]
        $.each(namespaceContent.userTestSuites, function (userTestSuiteName, userTestSuiteContent) {
            // crea p.es. YAHOO.test.Erratic.runnableTestSuites.PathTestSuite...
            ns[namespaceName]['runnableTestSuites'] = {};
            var runnableTestSuites = ns[namespaceName]['runnableTestSuites'];
            runnableTestSuites[userTestSuiteName] = new YAHOO.tool.TestSuite(userTestSuiteName);
            // ...e riempila di p.es. YAHOO.test.Erratic.runnableTestSuites.oTestAddSimplePath
            $.each(userTestSuiteContent, function (userTestName, userTestFunction) {
                // preparazione args
                var template = {};
                template.name = userTestName;
                template[userTestName] = userTestFunction;
                // new TestCase(args) - viene messo come metodo della TestSuite solo per tenere ordine nell'albero
                runnableTestSuites[userTestSuiteName]['o' + userTestName] = new YAHOO.tool.TestCase(template);
                // vero e proprio inserimento nella suite, usando add()
                runnableTestSuites[userTestSuiteName].add(runnableTestSuites[userTestSuiteName]['o' + userTestName]);
            });
        });
    });

    YAHOO.util.Event.onDOMReady(function () {
    $.each(ns, function(namespaceName, namespaceContent) {
        var logger = new YAHOO.tool.TestLogger("testLogger" + namespaceName);
        $.each(namespaceContent.runnableTestSuites, function(runnableTestSuiteName, runnableTestSuiteContent) {
            YAHOO.tool.TestRunner.add(runnableTestSuiteContent);
            });
        });
    });
} (YAHOO.namespace('test')));
