
CPS_NEWS.newsReaderView = {} // qui verrà agganciata l'istanza della view
CPS_NEWS.newsReaderHtmlClient = {}
CPS_NEWS.newsReaderCache = {}

CPS_NEWS.viewWidget = function ($div, $template) {
    var _feed = {};
    var _controller = {};
    var _render = function () {
        $div.setTemplate($template.text());
        $div.processTemplate(_feed);
    };
    // gestisce ambedue con/senza feedback
    var _notify = function (notification) {
        if (!notification.feedback()) alert(notification.text());
        else {
            if (confirm(notification.text())) notification.onConfirm();
            else notification.onCancel();
        }
    };
    return {
        setController: function (anObject) { _controller = anObject; },
        lock: function (aNotification) {
            $('.news_reader_main').css('background-color', 'red');
            $('.news_reader_warnings').html('locked:' + aNotification.text());
            $('.single_post').addClass('disabled');
        },
        unlock: function () {
            $('.news_reader_main').css('background-color', 'white');
            $('.news_reader_warnings').html('');
            $('.single_post').removeClass('disabled');
        },
		unlockAndThen: function(continuation) {
			return function() {
				this.unlock();
				continuation();
			}
		},
        /*bindActions: function (markAllMessagesAsReadAction) { },*/
        terminate: function (notificationWithFeedback) {
            _notify(notificationWithFeedback);
        },
        empty: function () {
            $div.empty();
        },
        populate: function (aFeed) {
            _feed = aFeed;
            _render();
        },
        notifyFeedIsCached: function (notification) { _notify(notification) },
        /*notifyAllMessagesMarkedAsRead: function (notification) { },*/
        notifyFeedUnavailable: function (notificationWithFeedback) {
            _notify(notificationWithFeedback);
        },
        confirmToDownloadNews: function (notificationWithFeedback) {
            _notify(notificationWithFeedback);
        },
        onRefresh: function () { _controller.showNewsFeed(); },
        onRestart: function () {
            _controller.initialize();
            _controller.showNewsFeed();
        },
        // gestione checkboxes per simulazione
        onChangeHtmlClientStatus: function ($checkbox) {
            CPS_NEWS.newsReaderHtmlClient.setActive($checkbox.attr('checked') === true);
        },
        onChangeCacheContent: function ($checkbox) {
            if ($checkbox.attr('checked') === true) CPS_NEWS.newsReaderCache.setNewsFeed(CPS_NEWS.newsReaderHtmlClient.get());
            else CPS_NEWS.newsReaderCache.setNewsFeed(null);
        },
        onChangePreferences: function ($checkbox) {
            CPS_NEWS.preferences.isNewsDownloadAllowed = ($checkbox.attr('checked') === true);

        },
        // questa potrebbe verificare quando tutti sono stati letti e fare qcosa di conseguenza
        onReadUnreadPost: function (checkbox) { alert($(checkbox).attr('id') + ' read/unread'); }
    };
};

// marker e.g. new Date().toDateString()
RssFeed.instance = function (marker) {
    var _post = function (aCaption, aDate, read) {
        return {
            postId: (Math.random()+'').substring(2),
            caption: aCaption,
            publicationDate: aDate,
            postRead: read
        };
    };
    return {
        // rifletti se servono ambedue marker & guid
        guid: 'cps_' + new Date().getTime(),
        postList: [
                    _post(marker + ': primo post', new Date(2011, 03, 03), false),
                    _post(marker + ': secondo post', new Date(2011, 05, 05), false)
                    ]
    };
};

RssFeed.emptyInstance = { guid: 'cps_XXX', postList: [] };
