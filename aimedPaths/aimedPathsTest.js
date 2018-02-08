
YAHOO.namespace('Aimed.test');

var Assert = YAHOO.util.Assert;

YAHOO.Aimed.test.oTestCreateSimplePath = new YAHOO.tool.TestCase({ 
	name : "TestCreateSimplePath",	
	testCreateSimplePath : function () {
		var path1 = Aimed.path('a', 'b', 12);
		Assert.areEqual(1, path1.order(), 'order should be 1');
		Assert.areEqual('a', path1.origin()), 'origin not correct';
		Assert.areEqual('b', path1.destination(), 'destination not correct');
		Assert.areEqual(12, path1.distance(), 'distance not correct');
		Assert.isTrue(path1.subPaths().length === 0, 'subpaths array not correctly initialized');
		Assert.areEqual('a12/1b', path1.toString(), 'toString() not correctly overridden');
		Assert.isFalse(path1.isComposableWith(path1), 'isComposableWith check not correct');
		Assert.isTrue(path1.isComposableWith(Aimed.path('b', 'f', 11)), 'isComposableWith check not correct');
		
		path1.setSubPaths(['whatever', 'it', 'may', 'be']);
		Assert.areEqual(4, path1.order(), 'order should now be 4');
		
		var path2 = Aimed.path('a', 'b', 12, ['whatever', 'it', 'may', 'be']);
		Assert.areEqual(4, path2.order(), 'order should be 4 also here');
	}
});

YAHOO.Aimed.test.oTestModifySimplePath = new YAHOO.tool.TestCase({ 
	name : "TestModifySimplePath",	
	testModifySimplePath : function () {
		var path1 = Aimed.path('a', 'b', 12);
		path1.setDestination('bbb').setDistance(123).setOrigin('aaa');
		Assert.areEqual('aaa', path1.origin(), 'origin not correctly modified');
		Assert.areEqual('bbb', path1.destination(), 'destination not correctly modified');
		Assert.areEqual(123, path1.distance(), 'distance not correctly modified');
		
		var detachedPath = path1.detached();
		Assert.isTrue(path1 !== detachedPath);
		
		path1.inverted();
		Assert.areEqual('bbb', path1.origin(), 'origin not correctly inverted');
		Assert.areEqual('aaa', path1.destination(), 'destination not correctly inverted');
		Assert.areEqual(123, path1.distance(), 'distance modified during inversion');
		
		Assert.isTrue(path1.equals(detachedPath.inverted()), 'inversion is not composed correctly');
	}
});

YAHOO.Aimed.test.oTestCreateCompositePath = new YAHOO.tool.TestCase({ 
	name : "TestCreateCompositePath",	
	testCreateCompositePath : function () {
		var path1 = Aimed.path('a', 'b', 12);
		var path2 = Aimed.path('b', 'f', 15);
		var path3 = Aimed.path('f', 'y', 1).composeWith(Aimed.path('y', 'z', 2));
		path1.composeWith(path2).composeWith(path3);
		Assert.isTrue(path1.subPaths()[0].equals(Aimed.path('a', 'b', 12)), 'subpaths array not correctly initialized');
		Assert.isTrue(path1.subPaths()[1] === path2, 'subpaths array[1] not correctly incremented');
		Assert.isTrue(path1.subPaths()[3].equals(Aimed.path('y', 'z', 2)), 'subpaths array[3] not correctly incremented');
		Assert.areEqual(4, path1.subPaths().length, 'subpaths array not correctly processed');
		Assert.areEqual(4, path1.order(), 'composed order should be 4');
		Assert.areEqual('a', path1.origin()), 'origin not correct';
		Assert.areEqual('z', path1.destination(), 'composed destination not correct');
		Assert.areEqual(30, path1.distance(), 'composed distance not correct');
		
		try {
			path1.composeWith(Aimed.path('a', 'b', 222));
			Assert.fail('shouldnt get here!');
		} catch (exc) {
			Assert.areEqual('UnsupportedOperationException', exc.name);
		}
	}
});

YAHOO.Aimed.test.oTestInvertCompositePath = new YAHOO.tool.TestCase({ 
	name : "TestInvertCompositePath",	
	testInvertCompositePath : function () {
		var path1 = Aimed.path('a', 'b', 12);
		var path2 = Aimed.path('b', 'f', 15);
		var path3 = Aimed.path('f', 'z', 3);
		path1.composeWith(path2).composeWith(path3).inverted();
		Assert.areEqual(3, path1.order(), 'composed order should be 3');
		Assert.areEqual('z', path1.origin()), 'inverted origin not correct';
		Assert.areEqual('a', path1.destination(), 'inverted destination not correct');
		Assert.isTrue(path1.subPaths()[0].equals(path3.inverted()), 'subpaths array[0] not correctly inverted');
		Assert.isTrue(path1.subPaths()[1].equals(path2.inverted()), 'subpaths array[1] not correctly inverted');
		Assert.isTrue(path1.subPaths()[2].equals(Aimed.path('a', 'b', 12).inverted()), 'subpaths array[2] not correctly inverted');
	}
});

YAHOO.Aimed.test.oTestBasicPathSet = new YAHOO.tool.TestCase({ 
	name : "TestBasicPathSet",
	testBasicPathSet : function () {
		var testPathSet = Aimed.pathSet().addPath(Aimed.path('a', 'b', 23)).addPath(Aimed.path('b', 'c', 11)).addPath(Aimed.path('d', 'c', 8));
		Assert.areEqual(1, testPathSet.from('a').size(), 'filter FROM did not work correctly');
		Assert.areEqual(2, testPathSet.to('c').size(), 'filter TO did not work correctly');
		Assert.areEqual(3, testPathSet.havingOrder(1).size(), 'filter by order did not work correctly');
		Assert.areEqual(0, testPathSet.through('b').size(), 'filter by stopover did not work correctly');
		Assert.isTrue(testPathSet.contains(Aimed.path('a', 'b', 23)), 'contains check no.1 failed');
		Assert.isFalse(testPathSet.contains(Aimed.path('a', 'a', 6)), 'contains check no.2 failed');
	}
});

YAHOO.Aimed.test.oTestComposedPathSet = new YAHOO.tool.TestCase({ 
	name : "TestComposedPathSet",
	testComposedPathSet : function () {
		var testComposedPathSet = Aimed.pathSet().addPath(Aimed.path('a', 'b', 23)).addPath(Aimed.path('b', 'c', 11)).addPath(Aimed.path('b', 'd', 8)).composed();
		Assert.areEqual(5, testComposedPathSet.size());
		Assert.areEqual(3, testComposedPathSet.from('a').size(), 'filter FROM a not satisfied');
		Assert.areEqual(2, testComposedPathSet.to('c').size(), 'filter TO c not satisfied');
		Assert.areEqual(2, testComposedPathSet.to('d').size(), 'filter TO d not satisfied');
		Assert.areEqual(3, testComposedPathSet.havingOrder(1).size(), 'filter by order 1 did not work correctly');
		Assert.areEqual(2, testComposedPathSet.havingOrder(2).size(), 'filter by order 2 did not work correctly');
		Assert.areEqual(2, testComposedPathSet.through('b').size(), 'filter by stopoverB did not work correctly');
		Assert.areEqual(0, testComposedPathSet.through('d').size(), 'filter by stopoverD did not work correctly');
		Assert.isTrue(testComposedPathSet.contains(Aimed.path('a', 'c', 34)), 'contains check no.1 failed');
		Assert.isTrue(testComposedPathSet.contains(Aimed.path('a', 'd', 31)), 'contains check no.2 failed');
		Assert.areEqual(2, testComposedPathSet.paths()[3].subPaths().length, 'error processing first composite path');
		Assert.areEqual(2, testComposedPathSet.paths()[4].subPaths().length, 'error processing second composite path');
		Assert.isTrue(testComposedPathSet.paths()[3].subPaths()[0].equals(Aimed.path('a', 'b', 23)), 'subSubPath[3,0] wrong');
		Assert.isTrue(testComposedPathSet.paths()[3].subPaths()[1].equals(Aimed.path('b', 'c', 11)), 'subSubPath[3,1] wrong');
		Assert.isTrue(testComposedPathSet.paths()[4].subPaths()[0].equals(Aimed.path('a', 'b', 23)), 'subSubPath[4,0] wrong');
		Assert.isTrue(testComposedPathSet.paths()[4].subPaths()[1].equals(Aimed.path('b', 'd', 8)), 'subSubPath[4,1] wrong');
	}
});

YAHOO.Aimed.test.oTestTwiceComposedPathSet = new YAHOO.tool.TestCase({ 
	name : "TestTwiceComposedPathSet",
	testTwiceComposedPathSet : function () {
		var pathSet = Aimed.pathSet();
		pathSet.addPath(Aimed.path('a', 'b', 23));
		pathSet.addPath(Aimed.path('b', 'c', 11));
		pathSet.addPath(Aimed.path('b', 'd', 8));
		pathSet.addPath(Aimed.path('d', 'e', 2));
		pathSet.addPath(Aimed.path('c', 'e', 5));
		pathSet.composed().composed();
		Assert.areEqual(11, pathSet.size());
		Assert.areEqual(5, pathSet.from('a').size(), 'filter FROM a not satisfied');
		Assert.areEqual(6, pathSet.to('e').size(), 'filter TO e not satisfied');
		Assert.areEqual(2, pathSet.through('c').size(), 'filter by stopoverC did not work correctly');
		Assert.areEqual(5, pathSet.havingOrder(1).size(), 'filter by order 1 did not work correctly');
		Assert.areEqual(4, pathSet.havingOrder(2).size(), 'filter by order 2 did not work correctly');
		Assert.areEqual(2, pathSet.havingOrder(3).size(), 'filter by order 3 did not work correctly');
		Assert.areEqual(1, pathSet.through('c').havingOrder(3).size(), 'filter by stopoverC+order3 did not work correctly');
		Assert.isTrue(pathSet.contains(Aimed.path('a', 'e', 33)), 'contains check no.1 failed');
		Assert.isTrue(pathSet.contains(Aimed.path('a', 'e', 39)), 'contains check no.2 failed');
		Assert.areEqual(3, pathSet.paths()[9].subPaths().length, 'error processing first third-order path');
		Assert.areEqual(3, pathSet.paths()[10].subPaths().length, 'error processing second third-order path');
	}
});

YAHOO.Aimed.test.oTestExpComposedPathSet = new YAHOO.tool.TestCase({ 
	name : "TestExpComposedPathSet",
	testExpComposedPathSet : function () {
		var pathSet = Aimed.pathSet();
		pathSet.addPath(Aimed.path('a', 'b', 23));
		pathSet.addPath(Aimed.path('b', 'c', 11));
		pathSet.addPath(Aimed.path('b', 'd', 8));
		pathSet.addPath(Aimed.path('d', 'e', 2));
		pathSet.addPath(Aimed.path('c', 'e', 5));
		pathSet.exp(2);
		Assert.areEqual(11, pathSet.size());
		Assert.areEqual(5, pathSet.from('a').size(), 'filter FROM a not satisfied');
		Assert.areEqual(6, pathSet.to('e').size(), 'filter TO e not satisfied');
		Assert.areEqual(5, pathSet.havingOrder(1).size(), 'filter by order 1 did not work correctly');
		Assert.areEqual(4, pathSet.havingOrder(2).size(), 'filter by order 2 did not work correctly');
		Assert.areEqual(2, pathSet.havingOrder(3).size(), 'filter by order 3 did not work correctly');
		Assert.isTrue(pathSet.contains(Aimed.path('a', 'e', 33)), 'contains check no.1 failed');
		Assert.isTrue(pathSet.contains(Aimed.path('a', 'e', 39)), 'contains check no.2 failed');
		Assert.areEqual(3, pathSet.paths()[9].subPaths().length, 'error processing first third-order path');
		Assert.areEqual(3, pathSet.paths()[10].subPaths().length, 'error processing second third-order path');
	}
});

YAHOO.Aimed.test.PathTestSuite = new YAHOO.tool.TestSuite("YUI Test Suite for Aimed Paths"); 
	YAHOO.Aimed.test.PathTestSuite.add(YAHOO.Aimed.test.oTestCreateSimplePath);
	YAHOO.Aimed.test.PathTestSuite.add(YAHOO.Aimed.test.oTestModifySimplePath);
	YAHOO.Aimed.test.PathTestSuite.add(YAHOO.Aimed.test.oTestBasicPathSet);
	YAHOO.Aimed.test.PathTestSuite.add(YAHOO.Aimed.test.oTestCreateCompositePath);
	YAHOO.Aimed.test.PathTestSuite.add(YAHOO.Aimed.test.oTestInvertCompositePath);
	YAHOO.Aimed.test.PathTestSuite.add(YAHOO.Aimed.test.oTestComposedPathSet);
	YAHOO.Aimed.test.PathTestSuite.add(YAHOO.Aimed.test.oTestTwiceComposedPathSet);
	YAHOO.Aimed.test.PathTestSuite.add(YAHOO.Aimed.test.oTestExpComposedPathSet);

YAHOO.util.Event.onDOMReady(function (){
	var logger = new YAHOO.tool.TestLogger("testLoggerAimed");
	YAHOO.tool.TestRunner.add(YAHOO.Aimed.test.PathTestSuite);
});

