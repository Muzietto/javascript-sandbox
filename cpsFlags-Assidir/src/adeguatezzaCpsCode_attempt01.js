/* tutto il codice che compone la adeguatezza state machine in CPS mode
    NB - mai fatto girare. Il modello con gli handlers per ogni singolo widget non può funzionare,
    visto che:
    - il click si applica al singolo control
    - la raccolta valori nel model si applica a famiglie di controls
    - il validate si può applicare a uno o + controls
*/

$(document).ready(function () {

    // il MODEL!!! - rifletti come passarlo al momento dell'evento 'collect'
    var model = { PREMIO_1: 100 };

    // versione da usare in apply - this = jQuery wrapper
    var rispondoHandler = function (eventType) {
        // ogni handler verrà invocato in apply (this = DOM object)
        var handlers = {
            'click': {
                'NO': function () { /* validate & show confirm dialog */
                    // collect list of errormessages
                    var errorMessages = [];
                    // invocare validazione da parte della view (mmmh...)
                    CPAS.view.validate(errorMessages);
                    if (errorMessages.length > 0) {
                        CPAS.view.notify(CPAS.notification()
                            .withText((function () {
                                var message = 'Richiesta inadeguata:\n';
                                $.each(errorMessages, function (index, currentMessage) {
                                    errorMessages += currentMessage + '\n';
                                });
                                return message;
                            } ()))
                            .withFeedback(CPAS.feedback(
                                function () {
                                    // invocare collect dalla view e ripartire
                                    CPAS.view.collectAndNavigate(model);
                                },
                                function () { return false; }
                            )));
                    }



                },
                /*  come dare un validatore al gruppo e non ai singoli radio?
                come controllare che almeno uno sia schiacciato?
                */
                'validate': {
                }
            }
        };
        // se non trova handler, binda una funzione che non fa nulla
        this.bind(eventType, handlers[eventType][this.val()] ? handlers[eventType][this.val()] : function () { void (0); });
    };

    $('[name=RISPONDO]').each(function (index, element) {
        rispondoHandler.call($(this), 'click');
    });

    // versione da usare in apply - this = jQuery wrapper
    var protettoHandler = function (eventType) {
        // ogni handler verrà invocato in apply (this = DOM object)
        var handlers = {
            'click': {
                'NO': function () { alert('NO')/* */ },
                'NR': function () { alert('NR')/* */ }
            },
            'validate': {
                'NO': function (ev, data) {
                    data.errorMessages.push('La polizza potrebbe non tutelarvi sufficientemente');
                },
                'NR': function (ev, data) {
                    data.errorMessages.push('Non avete risposto alla domanda sulla tutela');
                }
            }
        };
        // se non trova handler, binda una funzione che non fa nulla
        this.bind(eventType, handlers[eventType][this.val()] ? handlers[eventType][this.val()] : function () { void (0); });
    };

    $('[name=PROTETTO]').each(function () {
        protettoHandler.call($(this), 'click');
        protettoHandler.call($(this), 'validate');
    });

    // next lines works fine
    // $('[name=PROTETTO][value=SI]').trigger('validate');

    var errorMessages = [];
    $('[name=PROTETTO]').trigger('validate', [{ errorMessages: errorMessages}]);

    alert('end');
});