
var PRESE = {};

// handler per checkbox set
PRESE.autorizzoHandler = {
    'click': {
        '#AUTORIZZO_STAMPA': function (ev) { },
        '#AUTORIZZO_TV': function (ev) {
            // trascura l'uncheck
            if (!$(this).is(':checked')) return;
            var that = this;
            if (ev.data.view.is('#AUTORIZZO_STAMPA', ':checked')) {
                ev.data.view.notify(CPAS.notification()
                    .withText('Prego confermare autorizzazione in ambedue i canali')
                    .withFeedback(CPAS.feedback(
                        function () { },
                        function () {
                            ev.data.view.reset(that);
                        }
                    )));
            }
        }
    },
    // TODO - pensa come implementare: se nessuno scelto, occorre conferma UNA VOLTA, altrimenti fallisce
    'validate': {
        '[name=AUTORIZZO]': function (ev, data) {
            if ($('[name=AUTORIZZO]:checked').length === 0 && !data.aux.confermaGiaData) {
                ev.data.view.notify(CPAS.notification()
                    .withText('Prego confermare che non si vuole dare alcuna autorizzazione')
                    .withFeedback(CPAS.feedback(
                        function () { data.aux.confermaGiaData = true; },
                        function () {
                            ev.data.view.placeWarning(this);
                            data.validationMessages['Occorre dare almeno una autorizzazione'] = true;
                        })));
            }
        }
    }
};


PRESE.resetClickHandler = function (ev) {
    ev.data.view.reset('[name=AUTORIZZO]');
    ev.data.view.reset('[name=PREMIO_1]');
};

PRESE.nextClickHandler = function (ev) {
    // se la validazione fallisce, si torna indietro
    var errorMessagesArray = ev.data.view.validationArray();
    if (errorMessagesArray.length > 0)
        ev.data.view.notify(CPAS.notification().withText(function () { return 'Validazione Fallita!\n' + errorMessagesArray.join('\n'); }));
    // altrimenti si colletta e poi si va avanti
    else {
        ev.data.view.collect(ev.data.model);
        ev.data.view.reset('[name=AUTORIZZO],[name=PREMIO_1]');
        STATEMACHINE.loadAdegu(ev.data.view);
    }
};

