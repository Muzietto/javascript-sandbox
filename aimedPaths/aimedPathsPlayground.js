
YAHOO.namespace('Aimed.playground');

var Assert = YAHOO.util.Assert;

YAHOO.Aimed.playground.oTestPathSetFirstAnalysis = new YAHOO.tool.TestCase({ 
	name : "TestPathSetFirstAnalysis",
	testPathSetFirstAnalysis : function () {
		var pathSet = Aimed.pathSet();
		pathSet.addPath(Aimed.path('a', 'b', 23));
		pathSet.addPath(Aimed.path('b', 'c', 11));
		pathSet.addPath(Aimed.path('b', 'd', 8));
		pathSet.addPath(Aimed.path('d', 'e', 2));
		pathSet.addPath(Aimed.path('c', 'e', 5));
		pathSet.exp(3);
		Assertions.pathsInTotal(2, pathSet.from('a').havingOrder(2), 'frAor2');
		Assertions.pathsInTotal(2, pathSet.to('e').havingOrder(3), 'toEor3');
		Assertions.pathsInTotal(1, pathSet.to('c').havingOrder(2), 'toCor2');
		Assertions.pathsInTotal(1, pathSet.through('c').havingOrder(2), 'thCor2');
		Assertions.pathsInTotal(1, pathSet.through('c').havingOrder(3), 'thCor3');
	}
});

YAHOO.Aimed.playground.oTestPathSetSecondAnalysis = new YAHOO.tool.TestCase({ 
	name : "TestPathSetSecondAnalysis",
	testPathSetSecondAnalysis : function () {
		var pathSet = Aimed.pathSet();
		pathSet.addPath(Aimed.path('a', 'b', 23));
		pathSet.addPath(Aimed.path('b', 'c', 11));
		pathSet.addPath(Aimed.path('b', 'd', 8));
		pathSet.addPath(Aimed.path('d', 'e', 2));
		pathSet.addPath(Aimed.path('c', 'e', 5));
		pathSet.addPath(Aimed.path('e', 'f', 6));
		pathSet.addPath(Aimed.path('a', 'c', 15));
		pathSet.exp(3);
		Assertions.pathsInTotal(2, pathSet.from('a').havingOrder(4), 'frAor4');
		Assertions.pathsInTotal(1, pathSet.to('f').through('d').havingOrder(4), 'toFthDor4');
		Assertions.pathsInTotal(1, pathSet.through('b').through('d').through('e'), 'thBthDthE');
		Assertions.pathsInTotal(2, pathSet.from('a').to('f').through('c'), 'frAtoFthC');
		Assertions.pathsInTotal(1, pathSet.from('a').to('f').through('d'), 'frAtoFthD');
	}
});

YAHOO.Aimed.playground.PathTestSuite = new YAHOO.tool.TestSuite("YUI Test Suite for playing with Aimed Paths"); 
//	YAHOO.Aimed.playground.PathTestSuite.add(YAHOO.Aimed.playground.oTestPathSetFirstAnalysis);
	YAHOO.Aimed.playground.PathTestSuite.add(YAHOO.Aimed.playground.oTestPathSetSecondAnalysis);

YAHOO.util.Event.onDOMReady(function (){
	var logger = new YAHOO.tool.TestLogger("testLoggerAimedAndPlayful");
	YAHOO.tool.TestRunner.add(YAHOO.Aimed.playground.PathTestSuite);
});

var Assertions = {
	pathsInTotal : function (total, pathSet, label) {
		Assert.areEqual(total, pathSet.size(), 'filter '+label+': total is not '+total);
	}
};
