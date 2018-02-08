
var Humble = {}, Filter = {};

Filter.instance = function (type) {
    var _type = type;
    return {
        compareTo: function (otherFilter) {
            return (otherFilter.type && this.type === otherFilter.type);
        },
        type: _type
    };
};

Humble.mockView = function () {
    var _selectionList = [];
    var _composedFilter = [];
    return {
        setComposer: function (anObject) {
        },
        setSelectionList: function (aList) {
            _selectionList = aList;
        },
        setComposedFilter: function (aList) {
            _composedFilter = aList;
        },
        getSelectionList: function () {
            return _selectionList; 
        },
        getComposedFilter: function () {
            return _composedFilter; 
        }
    };
};

Humble.composer = function (view) {
    var _view = view;
    var _filters = [];
    var _chain = [];
    var _indexOf = function (aList, anObject) {
        var foundIndex = -1;
        _.each(aList, function (listElement, index) {
            if (listElement.compareTo(anObject)) foundIndex = index;
        });
        return foundIndex;
    };
    // upwards true or false (aka downwards)
    var _shiftFilter = function (filterNumber, upwards) {
        if (upwards && filterNumber === 0) return;
        if (!upwards && filterNumber === _chain.length - 1) return;
        var filterToMove = _chain[filterNumber];
        var positionInSelectionList = _indexOf(_filters, filterToMove);
        _chain.splice(filterNumber, 1);
        _chain.splice((upwards ? filterNumber - 1 : filterNumber + 1), 0, _filters[positionInSelectionList]);
        _view.setComposedFilter(_chain);
    };
    return {
        initialize: function () {
            _filters.push(Filter.instance('passa-basso'));
            _filters.push(Filter.instance('passa-alto'));
            _filters.push(Filter.instance('armonico'));
            _filters.push(Filter.instance('enarmonico'));
            _view.setSelectionList(_filters);
        },
        add: function (filterNumber) {
            _chain.push(_filters[filterNumber]);
            _view.setComposedFilter(_chain);
        },
        remove: function (filterNumber) {
            if (filterNumber < 0) return;
            _chain.splice(filterNumber, 1);
            _view.setComposedFilter(_chain);
        },
        removeAll: function (confirmCallback) {
            if (!confirmCallback || !confirmCallback()) return;
            _chain = [];
            _view.setComposedFilter(_chain);
        },
        moveUp: function (filterNumber) {
            _shiftFilter(filterNumber, true);
        },
        moveDown: function (filterNumber) {
            _shiftFilter(filterNumber, false);
        },
        chain2json: function () {
            return _chain;
        }
    };
};

Humble.viewWidget = function ($div, $template) {
    var _guid = 'viewWidget_' + new Date().getTime();
    var _selectionList = [];
    var _composedFilter = [];
    var _composer = {};
    var _selectedAvailableFilter = -1;
    var _selectedChainFilter = -1;
    var _render = function () {
        var data = {
            guid: _guid,
            selectionList: _selectionList,
            composedFilter: _composedFilter,
            selectedAvailableFilter: _selectedAvailableFilter,
            selectedChainFilter: _selectedChainFilter
        };
        $div.setTemplate($template);
        $div.processTemplate(data);
    };
    return {
        setSelectionList: function (aList) {
            _selectionList = aList;
            _render();
        },
        setComposedFilter: function (aList) {
            _composedFilter = aList;
            _render();
        },
        getSelectionList: function () {
            return _selectionList;
        },
        getComposedFilter: function () {
            return _composedFilter;
        },
        setComposer: function (anObject) {
            _composer = anObject;
        },
        guid: function () { return _guid },
        onSelectedAvailableFilter: function (filterNumber) {
            _selectedAvailableFilter = filterNumber;
            _render();
        },
        onSelectedChainFilter: function (filterNumber) {
            _selectedChainFilter = filterNumber;
            _render();
        },
        onAdd: function () {
            _composer.add(_selectedAvailableFilter);
            _render();
        },
        onRemove: function () {
            _composer.remove(_selectedChainFilter);
            _selectedChainFilter = -1;
            _render();
        },
        onRemoveAll: function () {
            if (_composedFilter.length === 0) return false;
            _composer.removeAll(function () {
                if (!confirm('Are you sure?')) return false;
                else return true;
            });
            return false;
        },
        onMoveUp: function () {
            _composer.moveUp(_selectedChainFilter);
            if (_selectedChainFilter > 0) _selectedChainFilter--;
            _render();
        },
        onMoveDown: function () {
            _composer.moveDown(_selectedChainFilter);
            if (_selectedChainFilter < _composedFilter.length - 1) _selectedChainFilter++;
            _render();
        },
        onOk: function () {
            alert(_composer.chain2json());
            return false;
        }
    };
};

Humble.viewWidgetFactory = function ($element, $template) {
    var viewWidget = Humble.viewWidget($element, $template.text());
    var composer = Humble.composer(viewWidget);
    viewWidget.setComposer(composer);
    composer.initialize();
    window[viewWidget.guid()] = viewWidget;
    return viewWidget;
};

