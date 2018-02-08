
YAHOO.namespace('CPS_NEWS.test');

var Assert = YAHOO.util.Assert;

YAHOO.CPS_NEWS.test.oTestInitializeComposer = new YAHOO.tool.TestCase({
    name: "TestInitializeNewsService",
    testInitializeComposer: function () {
        var cache = CPS_NEWS.cacheService();
        var service = CPS_NEWS.newsService(cache);
		var view = 
        cache.setNewsFeed([]);
        var feed = service.getNewsFeed(CPS_NEWS.availabilityNotifier());
        Assert.isArray(feed);
        Assert.areEqual(0, feed.length);
        service.checkForUpdates();
        feed = service.getNewsFeed(CPS_NEWS.availabilityNotifier()); // line to be checked carefully!!
        Assert.areEqual(2, feed.length);
        Assert.areEqual('primo post', feed[0].caption);
    }
});

YAHOO.util.Event.onDOMReady(function () {

    YAHOO.CPS_NEWS.test.CPS_NEWSTestSuite = new YAHOO.tool.TestSuite("YUI Test Suite for CPS_NEWS Dialog Boxes");

//    for (property in YAHOO.CPS_NEWS.test) {
//        if (YAHOO.CPS_NEWS.test.hasOwnProperty(property)) YAHOO.CPS_NEWS.test.CPS_NEWSTestSuite.add(YAHOO.CPS_NEWS.test[property]);
//    };

    YAHOO.CPS_NEWS.test.CPS_NEWSTestSuite.add(YAHOO.CPS_NEWS.test.oTestInitializeComposer);

    var logger = new YAHOO.tool.TestLogger("testLoggerCPS_NEWS");
	YAHOO.tool.TestRunner.add(YAHOO.CPS_NEWS.test.CPS_NEWSTestSuite);
});
confirmToDownloadNews