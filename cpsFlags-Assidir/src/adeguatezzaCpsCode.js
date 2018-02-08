/* tutto il codice che compone la adeguatezza state machine in CPS mode
*/
var ADEGU = {};

(function (ns) {

    // handler per input:text PREMIO_2
    var premio2Validator = function (ev, data) {
        /*  NB - il validatore gira con this = DOM input:text field
        NB - data = { validationMessages }
        */
        if (!$(this).val() || (isNaN(parseInt($(this).val())))) {
            data.validationMessages['Occorre precisare il premio una seconda volta'] = true;
            $(this).val('');
            ev.data.view.placeWarning(this);
        }
        (parseInt($(this).val()) < parseInt(ev.data.model.PREMIO_1)) ? data.validationMessages['Il premio è inferiore a quanto indicato precedentemente'] = true : void (0);
    };

    // handler per input:radio rispondo (tutto il gruppo di radio!!!)
    // rispondoHandler.click.#RISPONDO_NO = handler per click su NO
    // rispondoHandler.validate.[name=RISPONDO] = handler per validate di tutto il gruppo
    var rispondoHandler = {
        // ogni handler verrà invocato in apply (this = DOM object)
        'click': {
            '#RISPONDO_NO': function (ev) { /* validate & show confirm dialog */
                // invocare validazione di tutta la form da parte della view
                var validationMessages = ev.data.view.validationArray();
                // stoppare eventualmente qui gli errori fatali di validazione
                if (validationMessages.length > 0) {
                    ev.data.view.notify(CPAS.notification()
                            .withText((function () {
                                var message = 'Richiesta inadeguata:\n';
                                $.each(validationMessages, function (index, currentMessage) {
                                    message += currentMessage + '\n';
                                });
                                return message;
                            } ()))
                            .withFeedback(CPAS.feedback(
                                function () {
                                    // invocare collect dalla view e ripartire
                                    ev.data.view.collect(ev.data.model); // model si modifica per _REFERENCE_ !!!!!!
                                    ev.data.view.navigate();
                                },
                                function () {
                                    ev.data.view.reset('[name=RISPONDO]');
                                }
                            )));
                }
            }
        },
        // validate DEVE avere un argument data, che conterrà i dati da confrontare per la specifica validazione
        'validate': {
            // data = { model: model, validationMessages: validationMessages}
            '[name=RISPONDO]': CPAS.genericChosenInputValidator('[name=RISPONDO]'),
            '#RISPONDO_NO': function (ev, data) {
                if ($(this).is(':checked')) {
                    $(this).addClass('errored_field');
                    data.validationMessages['Non rispondere alle domande può pregiudicare la vs. pratica'] = true;
                }
            }
        },
        'collect': {
            '[name=RISPONDO]': CPAS.genericRadioCollector
        }
    };


    // handler per input:radio protetto (tutto il gruppo di radio!!!)
    var protettoHandler = {
        // ogni handler verrà invocato in apply (this = DOM object)
        'validate': {
            '[name=PROTETTO]': CPAS.genericChosenInputValidator('[name=PROTETTO]'),
            /* TODO - rivedi come gestire bene il controllo ($(this).is(':checked'))
            p.es. CPAS.checked.call(this,function(){ev.data.validationMessages['Error!!!']});
            */
            '#PROTETTO_NO': function (ev, data) {
                ($(this).is(':checked')) ? data.validationMessages['La polizza potrebbe non tutelarvi sufficientemente'] = true : void (0);
            },
            '#PROTETTO_NR': function (ev, data) {
                ($(this).is(':checked')) ? data.validationMessages['Non avete risposto alla domanda sulla tutela'] = true : void (0);
            }
        },
        'collect': {
            '[name=PROTETTO]': CPAS.genericRadioCollector
        }
    };


    // TODO - completare!!!!
    var previousClickHandler = function (ev) {
        
    };

    var cancelClickHandler = function (ev) {
        ev.data.view.reset('[name=RISPONDO]');
        ev.data.view.reset('[name=PROTETTO]');
        ev.data.view.reset('[name=PREMIO_2]');
    };

    var nextClickHandler = function (ev) {
        var validationMessagesObj = ev.data.view.validate();
        var validationMessages = [];
        $.map(validationMessagesObj, function (value, key) {
            validationMessages.push(key);
        });
        // stoppare eventualmente qui gli errori fatali di validazione
        if (validationMessages.length > 0) {
            ev.data.view.notify(CPAS.notification()
                            .withText((function () {
                                var message = 'Richiesta inadeguata:\n';
                                $.each(validationMessages, function (index, currentMessage) {
                                    message += currentMessage + '\n';
                                });
                                return message;
                            } ())));
        } else {
            ev.data.view.collect(ev.data.model); // model si modifica per _REFERENCE_ !!!!!!
            ev.data.view.navigate(/*model*/);
        }
    };

    ns.premio2Validator = premio2Validator;
    ns.rispondoHandler = rispondoHandler;
    ns.protettoHandler = protettoHandler;
    ns.previousClickHandler = previousClickHandler;
    ns.cancelClickHandler = cancelClickHandler;
    ns.nextClickHandler = nextClickHandler;
} (ADEGU));
