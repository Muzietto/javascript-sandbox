
var CPS_NEWS = {}, RssFeed = {};

CPS_NEWS.newsService = function (cache, htmlClient, preferences) {
    var that = this;
    var _cache = cache;
    var _preferences = preferences || { isNewsDownloadAllowed: false };
    var _htmlClient = htmlClient || { get: function () { return []; } };
    //var _readNewsFeedAndNotifyAvailability = function (availabilityNotifier) { };
    var _downloadNewsFeedAndNotifyAvailability = function (availabilityNotifier) {
        try {
            availabilityNotifier.notifyFeedAvailable(_htmlClient.get());
        } catch (whateverException) {
            availabilityNotifier.notifyFeedUnavailable();
        }
    };
    return {
        checkForUpdates: function () {
            _cache.setNewsFeed(RssFeed.instance('cached'));
        },
        getNewsFeed: function (availabilityNotifier) {
            try {
                availabilityNotifier.notifyCachedFeedAvailable(_cache.getNewsFeed());
            } catch (notFoundException) {
                // next line non capisco cosa voglia davvero dire
                /*if (!cache.isDownloadNeeded()) _readNewsFeedAndNotifyAvailability(availabilityNotifier);
                else*/
                if (_preferences.isNewsDownloadAllowed) _downloadNewsFeedAndNotifyAvailability(availabilityNotifier);
                else availabilityNotifier.notifyFeedCouldBeDownloaded(CPS_NEWS.downloadConfirmation(function () {
                    /* nella prossima occorre il that: apply non onora il this,
                    in qto il metodo chiamato è definito nel corpo della presente function!!!
                    */
                    _downloadNewsFeedAndNotifyAvailability.apply(that, [availabilityNotifier]);
                }))
            };
        }
    };
};


CPS_NEWS.newsViewController = function (aView, aNewsService) {
    var _view = aView;
    var _newsService = aNewsService;
    return {
        initialize: function () {
            _view.populate(RssFeed.emptyInstance);
        },
        showNewsFeed: function () {
            _view.lock(CPS_NEWS.notification().withText('preparing news...'));
            _newsService.getNewsFeed(
                CPS_NEWS.availabilityNotifier(
                    _view, 
                    /*CPS_NEWS.markAllMessagesAsReadAction(),*/
                    this)); // this indica il controller stesso!!
        },
        closeSession: function () {
            _view.terminate(CPS_NEWS.notification().withText('close News Reader?')
                .withFeedback(CPS_NEWS.feedback(
                    function () {
                        _view.empty();
                    },
                    function () {
                        this.showNewsFeed();
                    }
            )));
        }
    };
};

CPS_NEWS.availabilityNotifier = function (aView, /*anAction,*/ aController) {
    var _view = aView;
    //var _markAllMessagesAsReadAction = anAction;
    var _newsController = aController;
    return {
        notifyFeedAvailable: function (aFeed) {
            _view.populate(aFeed);
            _view.unlock();
        },
        notifyCachedFeedAvailable: function (aFeed) {
            _view.unlock();
            _view.populate(aFeed);
            _view.notifyFeedIsCached(CPS_NEWS.notification().withText('these news are coming from cache'));
        },
        // chiamato se il download fallisce
        notifyFeedUnavailable: function () {
            //_markAllMessagesAsReadAction.disable();
            //_view.notifyAllMessagesMarkedAsRead(CPS_NEWS.notification('all feed items marked as read')); // my idea...
            _view.unlock();
            _view.notifyFeedUnavailable(CPS_NEWS.notification()
                                            .withText('fresh news are unavailable. Click OK to keep reading these ones')
                                            .withCaption('WARNING')
                                            .withFeedback(CPS_NEWS.feedback(
                                                function () {  },
                                                function () { _newsController.closeSession(); } 
                                            )));
        },
        notifyFeedCouldBeDownloaded: function (aDownloadConfirmation) {
            _view.confirmToDownloadNews(CPS_NEWS.notification()
                .withText('please confirm you want fresh news to be downloaded')
                .withCaption('GIVE FEEDBACK')
                .withFeedback(CPS_NEWS.feedback(
                    function () { aDownloadConfirmation.confirmDownload(); },
                    function () { _view.unlock(); _newsController.closeSession(); }
                )));
        }
    };
};

CPS_NEWS.availabilityNotifier2 = function (view, controller) {
    return {
        notifyFeedAvailable: function (feed) { 
			view.populate(feed).unlock(); 
		},
        notifyCachedFeedAvailable: function (feed) { 
			view.unlock().populate(aFeed).notifyFeedIsCached(CPS_NEWS.notification().withText('these news are coming from cache'));
        },
        // chiamato se il download fallisce
        notifyFeedUnavailable: function () {
            view.unlock().notifyFeedUnavailable(CPS_NEWS.notification()
                                            .withText('fresh news are unavailable. Click OK to keep reading these ones')
                                            .withCaption('WARNING')
                                            .withFeedback(CPS_NEWS.feedback(doNothing,controller.closeSession)));
        },
        notifyFeedCouldBeDownloaded: function (downloadConfirmation) { // GUANTO DI SFIDA
            view.confirmToDownloadNews(CPS_NEWS.notification()
                .withText('please confirm you want fresh news to be downloaded')
                .withCaption('GIVE FEEDBACK')
                .withFeedback(CPS_NEWS.feedback(downloadConfirmation.confirmDownload,view.unlockAndThen(controller.closeSession))));
        }
    };
};

CPS_NEWS.notification = function () {
    var _text, _caption, _feedback;
    return {
        withText: function (aText) { _text = aText; return this; },
        withCaption: function (aCaption) { _caption = aCaption; return this; },
        withFeedback: function (aFeedback) { _feedback = aFeedback; return this; },
        text: function () { return _text; },
        caption: function () { return _caption; },
        feedback: function () { return _feedback; },
        onConfirm: function () { _feedback.onConfirm(); },
        onCancel: function () { _feedback.onCancel(); }
    };
};

CPS_NEWS.feedback = function (confirmCallback, cancelCallback) {
    return {
        onConfirm: function () { confirmCallback(); },
        onCancel: function () { cancelCallback(); }
    }
};

/*  questa gestisce anche il caso con feedback, a seconda della
    callback assegnatale
*/
CPS_NEWS.downloadConfirmation = function (callback) {
    return {
        confirmDownload: function () {
            callback();
        }
    };
};

CPS_NEWS.cacheService = function () {
    var _feed;
    return {
        setNewsFeed: function (aFeed) {
            _feed = aFeed;
        },
        getNewsFeed: function () {
            if (!_feed) throw { message: 'feed not present in cache' };
            return _feed;
        },
        isDownloadNeeded: function () {
            return !_feed;
        }
    };
};

CPS_NEWS.htmlClient = function () {
    var _active = true;
    return {
        get: function (anUrl) {
            if (!_active) throw { message: 'htmlClient failure' };
            return RssFeed.instance((Math.random() + '').substring(2));
        },
        setActive: function (flag) {
            _active = flag;
        }
    };
};

CPS_NEWS.preferences = { isNewsDownloadAllowed: true };
