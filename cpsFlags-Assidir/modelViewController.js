/*
modelViewController.js - contiene tutto il codice generico per il mvc
e la validazione.
*/

ASD.mvc.preventiviController = function (view, httpClient) {
    var _view = view;
    var _currentState = $.extend(true, {}, ASD.mvc.state(''));
    // model (l'unico punto di dipendenza di ASD.mvc da ASD.gestionePreventivi)
    var _stack = ASD.gestionePreventivi.stepStack(httpClient);
    var _model = {
        guid: new Date().getTime(),
        currentStateName: null
    };
    // main method
    var _navigate = function (nextState, strategy) {
        var that = this;
        _view.sandclockStart();
        if (!strategy || strategy === ASD.FORWARD) {
            // clono una copia temporanea
            var tempModel = $.extend(true, {}, _model);
            // mi cautelo nel caso il model venga sminchiato dal prossimo metodo
            if (!_currentState.onLeaving.apply(_model)) { _model = tempModel; return false; };
            // ri-clono
            tempModel = $.extend(true, {}, _model);
            var tempState = _currentState;
            // procedo verso il nextState
            _model.currentStateName = nextState.name;
            _currentState = nextState;
            if (!_currentState.onEntering.apply(_model)) { _model = tempModel; _currentState = tempState; return false; };
            // posso procedere
            _view.render(_currentState.name + 'Template', /*{}*/_model);
            _currentState.afterRendering.apply(_model);
            _view.sandclockStop();
        } else { // gestire sia backwards che cancel
            _view.sandclockStart();
            // cancel+backwards bypassano l'onLeaving() del currentState
            // clono una copia temporanea
            var tempModel = $.extend(true, {}, _model);
            var tempState = _currentState;
            // procedo al nextState, mettendolo nelle current variables
            _model.currentStateName = nextState.name;
            _currentState = nextState;
            // backwards bypassa anche l'onEntering del nextState
            if (strategy === ASD.CANCEL) {
                if (!_currentState.onEntering.apply(_model)) { _model = tempModel; _currentState = tempState; return false; };
            }
            // posso renderizzare
            _view.render(_currentState.name + 'Template', _model);
            _currentState.afterRendering.apply(_model);
            _view.sandclockStop();
        }
    };
    return {
        initialize: function () {
            _navigate(_stack.getState('listatoPreventivi'));
        },
        next: function (currentStepName) {
            _navigate(_stack.next(currentStepName));
        },
        previous: function (currentStepName) {
            _navigate(_stack.previous(currentStepName), ASD.BACKWARDS);
        },
        navigate: function (followingStateName, strategy) {
            _navigate(_stack.getState(followingStateName), strategy);
        },
        retrieveUserFile: function ($downloadAnchor) {
            // ignora disabled anchors
            if ($downloadAnchor.hasClass('disabled_download')) return false;
            // disable other anchors
            $('.preventivo_download_anchor').addClass('disabled_download');
            // preparazione dati da inviare
            var filename = $downloadAnchor.attr('id') + '.pdf';
            var codmit = _model.utente.codmit;
            var timestamp = new Date().getTime();
            var that = this;  // this è l'oggetto ritornato da controller()
            httpClient.ajax({
                url: '/web/sftpProxy.aspx',
                data: {
                    timestamp: timestamp,
                    filename: filename,
                    codmit: codmit
                },
                async: true,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    switch (data.result) {
                        case 'ok.retrieval_started':
                            var pdfFile = timestamp + '_' + filename;
                            var callback = function () {
                                var urlObject = {
                                    downloadUrl: '/static/upload/preventivi2011/' + codmit + '/' + pdfFile,
                                    downloadTitle: filename
                                };
                                _view.displayDownloadUrl(urlObject);
                                // ripristina le altre download anchor
                                $('.preventivo_download_anchor').removeClass('disabled_download');
                            };
                            // parte il cronometro
                            stopwatch = ASD.mvc.stopWatch(6000);
                            that.pollForFile('/web/downloadPreventivo.aspx?codmit=' + codmit + '&filename=' + pdfFile, callback, true, stopwatch);
                            break;
                        default: // error
                            _view.issueWarning(data.result + '\n' + data.returnMessage);
                    }
                },
                // prototipo di error callback COMPLETA!!! - reuse it...
                error: function (XHR, textStatus, errorThrown) {
                    alert('Si sono verificati errori.\nHTTP ' + XHR.status + ': ' + XHR.statusText + '\njQuery: ' + textStatus);
                }
            })
        },
        // funzione ricorsiva fino a raggiungimento dell'obiettivo
        pollForFile: function (url, callback, firstTime, stopwatch) {
            var that = this;  // this è l'oggetto ritornato da controller()
            if (firstTime) {
                _view.sandclockStart();
            }
            httpClient.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                data: { timestamp: new Date().getTime() },
                success: function (data) {
                    switch (data.result) {
                        case 'ok.file_found':
                            _view.sandclockStop();
                            callback();
                            break;
                        default: // error.file_not_found
                            // se tempo scaduto, fail silently
                            if (stopwatch && !stopwatch.running()) {
                                // TODO - occorre rendere la callback bi-uso !!!
                                _view.sandclockStop();
                                // ripristina le altre download anchor
                                $('.preventivo_download_anchor').removeClass('disabled_download');
                                return false;
                            }
                            setTimeout(function () {
                                // NB - setTimeout richiede l'uso di apply!!!
                                that.pollForFile.apply(that, [url, callback, false, stopwatch]);
                            }, 2000);
                    }
                },
                error: function (data) {
                    _view.sandclockStop();
                    alert('retrieve fascicolo: errore sul server');
                }
            });
        },
        // major exception!!!!! - controller sa come cancellare preventivi
        removePreventivo: function (idPreventivo) {
            if (!confirm('Prego confermare la cancellazione del preventivo ' + idPreventivo)) return false;
            // preparazione SOAP request di delete preventivo
            var soapPrev01DeleteRequest = $.extend(true, {}, ASD.gestionePreventivi.preventivoPrev01);
            soapPrev01DeleteRequest.WSLOGINMIT = $('#preventivi2011UserData_codmit').val();
            soapPrev01DeleteRequest.WSPTIDPREV = idPreventivo;
            soapPrev01DeleteRequest.WSD1IDDETTA = idPreventivo;
            soapPrev01DeleteRequest.WSPTIDPRODO = 'RC';
            soapPrev01DeleteRequest.WSOPERAZIONE = 'D';
            httpClient.ajax({
                url: '/web/prev01Proxy.aspx',
                data: { WS_PREV01Input: '<WS_PREV01Input>' + json2xml(soapPrev01DeleteRequest) + '</WS_PREV01Input>' },
                async: false,
                type: 'POST',
                dataType: 'text/xml',
                success: function (data) {
                    // due truschini per ovviare a paturnie di xml2json e di eval
                    var jsonModel = eval('(' + xmlString2json(data).replace('\nundefined', '') + ')');
                    // TODO: controlla valore WS_PREV01.WSIDERRORE != ERPRE001
                    var WSIDERRORE = jsonModel.WS_PREV01.WSIDERRORE;
                    var WSTXERRORE = jsonModel.WS_PREV01.WSTXERRORE;
                    if (jsonModel.WS_PREV01.WSIDERRORE === 'ERPRE001') alert('Il preventivo \u00E9 stato correttamente cancellato.');
                    else alert('Errori durante la cancellazione. Il preventivo potrebbe non essere stato cancellato.\n' + jsonModel.WS_PREV01.WSTXERRORE);
                },
                error: function (XHR) {
                    alert('Errori durante la cancellazione. Il preventivo potrebbe non essere stato cancellato.\n' + XHR.status + ': ' + XHR.statusText);
                }
            });
            // reload window
            window.location.reload();
        }
    };
};

ASD.mvc.httpClient = function () {
    return {
        ajax: function (settings) {
            $.ajax(settings);
        }
    };
};

ASD.mvc.fakeHttpClient = function () {
    // nella prev01Response mancano i nuovi parametri della versione prev01 del 111213
    var prev01Response = '<?xml version="1.0" encoding="UTF-8"?><WS_PREV01><WSDSADEGUATE><WSARCALTRPO/><WSARCALTRPOT/><WSARCDISFIN/><WSARCNECASS/><WSARCNECASST/><WSARCOBBLEG/><WSARCOBBLEGT/><WSARCRIFINF/><WSARCSUFTUT/></WSDSADEGUATE><WSDSDETTAGLIO><WSD1FLGCONDI/><WSD1FLGFASCI/><WSD1FLGMOVD/><WSD1FLGPRIVA/><WSD1FLGREG5/><WSD1FLGREG6/><WSD1IMPMASSU/><WSD1PREMIO/></WSDSDETTAGLIO><WSD1IDDETTA>000000000000</WSD1IDDETTA><WSIDERRORE>ERPRE001</WSIDERRORE><WSINDIC/><WSPTDATSCAD>22.12.2011</WSPTDATSCAD><WSPTDDPRODO>Responsabilità Civile</WSPTDDPRODO><WSPTDDSTATO>Approvato</WSPTDDSTATO><WSPTDTPREV>23.09.2011</WSPTDTPREV><WSPTFLAGAPP/><WSPTIDPREV>000000000101</WSPTIDPREV><WSPTIDPRODO>RC</WSPTIDPRODO><WSPTIDSTATO>APPR</WSPTIDSTATO><WSPTNOMEPDFA>AAAAAAAAAA</WSPTNOMEPDFA><WSPTNOMEPDFP>BBBBBBBB</WSPTNOMEPDFP><WSPTPATHPDFA>CCCCCCCC</WSPTPATHPDFA><WSPTPATHPDFP>DDDDDDDD</WSPTPATHPDFP><WSTXERRORE>ELABORAZIONE ESEGUITA CORRETTAMENTE</WSTXERRORE></WS_PREV01>';
    var prelisResponse = '<?xml version="1.0" encoding="UTF-8"?><WS_PRELIS><WSFLAGDATI>S</WSFLAGDATI><WSIDERRORE></WSIDERRORE><WSINDIC/><WSLISTAPREV><WSD1IDDETTA>101</WSD1IDDETTA><WSPTDDPRODO>Responsabilità civile</WSPTDDPRODO><WSPTDDSTATO>Approvato</WSPTDDSTATO><WSPTDTPREV>23.09.2011</WSPTDTPREV><WSPTFLAGAPP/><WSPTIDPREV>101</WSPTIDPREV><WSPTIDPRODO>RC</WSPTIDPRODO><WSPTIDSTATO>APPR</WSPTIDSTATO><WSPTNOMEPDFA>AAAAAAAAAA</WSPTNOMEPDFA><WSPTNOMEPDFP>BBBBBBBB</WSPTNOMEPDFP><WSPTPATHPDFA>CCCCCCCC</WSPTPATHPDFA><WSPTPATHPDFP>DDDDDDDD</WSPTPATHPDFP></WSLISTAPREV><WSLISTAPREV><WSD1IDDETTA>102</WSD1IDDETTA><WSPTDDPRODO>Responsabilità civile</WSPTDDPRODO><WSPTDDSTATO>Approvato</WSPTDDSTATO><WSPTDTPREV>23.09.2011</WSPTDTPREV><WSPTFLAGAPP/><WSPTIDPREV>102</WSPTIDPREV><WSPTIDPRODO>RC</WSPTIDPRODO><WSPTIDSTATO>APPR</WSPTIDSTATO><WSPTNOMEPDFA>AAAAAAAAAA</WSPTNOMEPDFA><WSPTNOMEPDFP>BBBBBBBB</WSPTNOMEPDFP><WSPTPATHPDFA>CCCCCCCC</WSPTPATHPDFA><WSPTPATHPDFP>DDDDDDDD</WSPTPATHPDFP></WSLISTAPREV><WSNRPREV>2</WSNRPREV><WSTXERRORE></WSTXERRORE></WS_PRELIS>';
    var prepagResponse = '<?xml version="1.0" encoding="UTF-8"?><WS_PREPAG><WSINDIC>30</WSINDIC><WSIDERRORE>ERPRE001</WSIDERRORE><WSTXERRORE>ELABORAZIONE ESEGUITA CORRETTAMENTE</WSTXERRORE></WS_PREPAG>';
    return {
        ajax: function (settings) {
            if (settings.url.indexOf('prelisProxy') >= 0) settings.success(prelisResponse);
            if (settings.url.indexOf('prev01Proxy') >= 0) settings.success(prev01Response);
            if (settings.url.indexOf('prepagProxy') >= 0) settings.success(prepagResponse);
        }
    };
};

ASD.mvc.preventiviView = function ($div, $template) {
    var _controller = {};
    var _render = function (templateId, data, divId) {
        // le variabili locali hanno tutte un default
        var $lTemplate = templateId ? $('#' + templateId) : $template;
        var $lDiv = divId ? $('#' + divId) : $div;
        var lData = data || {};
        $lDiv.setTemplate($lTemplate.html(), null, { filter_data: false });
        if (StringResources) $lDiv.setParam('StringResources', StringResources);
        $lDiv.processTemplate(lData);
    };
    return {
        setController: function (obj) { _controller = obj; },
        render: function (templateId, data, divId) { _render(templateId, data, divId); },
        onNext: function (currentStepName) {
            _controller.next(currentStepName);
        },
        onPrevious: function (currentStepName) {
            _controller.previous(currentStepName);
        },
        onNavigate: function (nextStateName, strategy) {
            _controller.navigate(nextStateName, strategy);
        },
        // metodo generico per gestire dialogs di conferma
        onExitFromDialog: function (clickedAnchor) {
            _controller.exitFromDialog($(clickedAnchor).parent('div').attr('id'), $(clickedAnchor).attr('name'));
        },
        sandclockStart: function (message) { $('#sandclockDiv label').text(message); $('#sandclockDiv').show(); },
        sandclockStop: function () { $('#sandclockDiv').hide('slow'); $('#sandclockDiv label').text(''); },
        // metodi specifici
        onRemovePreventivo: function (idPreventivo) {
            _controller.removePreventivo(idPreventivo);
        },
        onRetrieveUserFile: function (downloadAnchor) {
            _controller.retrieveUserFile($(downloadAnchor));
        },
        // mostra il link al preventivo da downloadare
        displayDownloadUrl: function (data) { // data = {downloadUrl, downloadTitle}
            $('#preventivoDownloadPopupAnchor').attr('href', data.downloadUrl).text(data.downloadTitle);
            $('#preventivoDownloadPopupDiv').show();
        },
        // metodo helper per debugging - TODO: remove
        onRetrieveUserFileXXX: function (fileUrl) {
            // preparazione dati da inviare
            var filename = fileUrl.split('/')[fileUrl.split('/').length - 1];
            var codmit = 'MIT000032932';
            var timestamp = new Date().getTime();
            var that = this;  // this è l'oggetto ritornato da controller()
            $.ajax({
                url: '/web/sftpProxy.aspx',
                data: {
                    timestamp: timestamp,
                    filename: filename,
                    codmit: codmit
                },
                async: false,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    alert(data);
                }
            })
        }
    };
};

// stato in cui si può trovare la navigazione
ASD.mvc.state = function (stateName) {
    return {
        name: stateName,
        // NB - nelle prossime funzioni this = model!!
        // eseguita all'uscita FORWARD da uno state - deve ritornare true or false
        onLeaving: function () { return true; },
        // eseguita all'ingresso FORWARD o CANCEL in uno state - deve ritornare true or false
        onEntering: function () { return true; },
        // eseguita dopo la chiamata a processTemplate
        afterRendering: function () { }
    }
};

// setta checkboxes e radiobuttons sulla base dei valori nel model
ASD.mvc.checked = function (modelValue, valueToCompare) {
    if (valueToCompare) return ((modelValue === valueToCompare) ? 'checked="checked"' : '');
    else {
        var result = '';
        if (modelValue) result = 'checked="checked"';
        return result;
    }
};
// setta options sulla base dei valori nel model
ASD.mvc.selected = function (modelValue, valueToCompare) {
    if (valueToCompare) return ((modelValue === valueToCompare) ? 'selected="selected"' : '');
    else {
        var result = '';
        if (modelValue) result = 'selected="selected"';
        return result;
    }
};

// invocata con apply - this = model
ASD.mvc.checkDefaults = function () {
    // NB - this = current dom input
    var _checkDefaults = function () {
        var inputName = $(this).attr('name');
        // se ci sono già input:checked, esci
        if ($('[name="' + inputName + '"]:checked').length > 0) return;
        $('[name="' + inputName + '"]').each(function () {
            if ($(this).hasClass('default_checked')) $(this).attr('checked', 'checked');
        });
    };
    $('input:radio').each(_checkDefaults);
    $('input:checkbox').each(_checkDefaults);
};

/* da invocare con apply - this = selector jQuery con elementi da validare
   NB - la logica di scelta è a monte. Qui si valida soltanto
   TODO - verificare come gestire a monte la scelta di validazione da effettuare
   (possibly si potrebbe modularizzare questi validatori di basso livello 
   e farne una map richiamabile dal livello a monte)
*/
ASD.mvc.FormValidator = function () {
    var that = this;
    $('.errored_field_placeholder').remove();
    var errorMessages = [];

    // i not-radiobuttons vengono analizzati uno per uno
    this.not(':radio').each(function (index, element) {
        if (!ASD.mvc.FieldValidator.apply($(element))) {
            errorMessages.push(StringResources['error.JSON.' + $(element).attr('name')]);
        }
    });

    // gestione radiobuttons not empty: a) lista dei names
    var listaNamesRadioButtons = [];
    this.filter(':radio').each(function (index, element) {
        var currentRadioButtonName = $(this).attr('name');
        if (listaNamesRadioButtons.indexOf(currentRadioButtonName) < 0) listaNamesRadioButtons.push(currentRadioButtonName);
    });
    // gestione radiobuttons not empty: b) process name by name
    $.each(listaNamesRadioButtons, function (index, element) {
        // se nessuno checked, add to errorMessages
        if ($($('[name=' + element + ']:checked'), that).length === 0) {
            errorMessages.push(StringResources['error.JSON.' + element]);
        }
    });
    // TODO - decorare gli errored radiobuttons

    // preparazione callback coi risultati della validazione
    return function () {
        if (errorMessages.length > 0) { alert(errorMessages.join('\n')); return false; }
        else return true;
    };
};

// da invocare con apply - this = $(input da validare)
// TODO - gestire come map senza if's
ASD.mvc.FieldValidator = function () {
    // 1 - validator specifico del field
    if (this.validator) return this.validator();
    // 2 - validazione not empty - NB la validazione dei radio avviene a livello FormValidator
    // 2a) checkbox
    if (this.is('input:checkbox')) {
        if (!this.is(':checked')) {
            this.after($('<label class="errored_field_placeholder errored">' + StringResources['error.JSON.placeholderLabel'] + '</label>'));
            this.one('click', function () {
                $(this).next('.errored_field_placeholder').remove();
            });
            return false;
        };
        return true;
    }
    // 2b) input:text
    if (this.is('input:text')) {
        if (!this.val()) {
            this.addClass('errored');
            this.one('click', function () {
                $(this).removeClass('errored');
            });
        }
        return (this.val())
    };
    // 2c) input:hidden sempre OK
    if (this.is('input:hidden')) return true;
    // 3) select sempre OK
    // TODO - prevedere select con valore nullo iniziale e scelta obbligatoria di una delle altre options
    if (this[0].tagName.toLowerCase() === 'select') return true;
    // 4) textarea
    if (this.is('textarea')) return ($.trim(this.val()).length > 0);
};

/* crea un Object con tutti i dati p.es. dello state che si sta abbandonando
Work In Progress!! Verify implementation!!!
- idealmente tutti gli input (tranne i submit) e le textarea+select escluso tutto ciò marcato 'volatile'
- da invocare in apply: this = form da processare */
ASD.mvc.form2model = function () {
    var namesValues = {};
    var $fields = $('input,textarea,select', this).not('input:submit,.volatile', this);
    $fields.each(function () {
        /* occhio! che qui this = input
        se l'input NON è un cb o un radio OPPURE se è un cb/radio checkato, viene passato al model
        */
        if ($(this).filter('input:radio,input:checkbox').length === 0 || this.checked) namesValues[this.name] = $(this).val();
    });
    return namesValues;
};

// stopwatchInstance.running() segnala se sono passati <duration> millisec
ASD.mvc.stopWatch = function (duration) {
    var _running = true;
    (function () { setTimeout(function () { _running = false; }, duration); })();
    return {
        running: function () { return _running; }
    };
};