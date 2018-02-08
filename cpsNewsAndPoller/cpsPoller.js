
var CPS_POLLER = {};

var BASKET = {
    controller: {},
    view: {},
    htmlClient: {}
};

CPS_POLLER.viewWidget = function ($div, $template) {
    var _guid = 'pollerViewWidget_' + new Date().getTime();
    var _basketItems = [];
    var _controller = {};
    var _render = function (templateId, data, divId) {
        var $lTemplate = templateId ? $('#' + templateId) : $template;
        var $lDiv = divId ? $('#' + divId) : $div;
        var lData = data || { guid: _guid, basketItems: _basketItems };
        $lDiv.setTemplate($lTemplate.text());
        $lDiv.processTemplate(lData);
    };
    return {
        bindAndRender: function (templateName, data, div) {
            _render(templateName, div, data);
        },
        setController: function (anObject) {
            _controller = anObject;
        },
        displaySandClock: function () {
            _render('carrelloDownloadWidgetTemplate', {}, 'basketPopupHandle')
            $('.carrello_download_widget_template').show();
        },
        displayDownloadUrl: function (urlObject) {
            var data = {
                guid: _guid,
                url: urlObject.url,
                title: urlObject.title
            };
            _render('carrelloDownloadWidgetTemplate', data, 'basketPopupHandle');
            $('#basketMessageBoard').empty().hide();
        },
        onSetHtmlClientUrl: function ($checkbox) {
            _controller.setHtmlClientUrl($checkbox.attr('checked') != true);
        },
        report: function (message) {
            var curMsg = $('#basketMessageBoard').html();
            $('#basketMessageBoard').show().html(curMsg + message);
        },
        onBasket2Pdf: function () {
            _controller.pollForFile(true);
        }
    }
};

CPS_POLLER.pollerController = function (view, htmlClient) {
    var _view = view;
    var _htmlClient = htmlClient;
    return {
        initialize: function () {
            _view.bindAndRender();
        },
        pollForFile: function (firstTime) {
            var that = this;
            _view.report('polling...');
            if (firstTime) {
                _view.displaySandClock();
            }
            try {
                var lUrl = _htmlClient.getUrl();
                _view.displayDownloadUrl(lUrl);
            }
            catch (anything) {
                setTimeout(function () {
                    that.pollForFile.apply(that, [false]);
                }, 5000);
            }
        },
        setHtmlClientUrl: function (remove) {
            _htmlClient.setUrl(remove);
        }
    };
};

CPS_POLLER.htmlClient = function () {
    var _url;
    return {
        getUrl: function () {
            if (!_url) throw { message: 'url not available' };
            return _url;
        },
        setUrl: function (remove) {
            if (!remove) _url = { url: '/static/upload/basket_files/basket2pdf/244_Faustinelli_basket.pdf', title: 'Basket Pages Faustinelli' }
            else _url = null;
        }
    };
};