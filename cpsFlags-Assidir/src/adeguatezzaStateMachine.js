var ASD = { mvc: {} };
/* arricchimento namespace ASD.mvc 
State machine costruita secondo http://www.ibm.com/developerworks/library/wa-finitemach1/
Si riconoscono tre stati:
- WSARCRIFINF-Dialog: comparsa dialogo iniziale conferma rifiuto a fornire le risposte
- TEMP_CONFERMA_INADEGUATEZZA-Dialog: comparsa dialogo a fondo pagina per conferma scelte inadeguate
- Main: ogni altra condizione
*/
ASD.mvc.ASM = function (model) {
    var _model = model;
    return {
        // valore iniziale
        currentState: 'Main',
        // le flags vengono inizializzate sulla base del model
        flags: {
            WSARCRIFINF: false,
            WSARCNECASS: false,
            WSARCSUFTUT: false,
            WSARCDISFIN: false,
            WSARCMASASS: false,
            WSARCOBBLEG: false
        },
        initialState: 'Main',
        undefinedState: function (nextState) {
            alert('Undefined state: ' + nextState + ' - resetting!');
            return 'Main'
        },
        /* return new state if it's changed
        event e.g. {type:WSARCRIFINF_SI, target:getElementDyId('WSARCRIFINF_SI')}
        */
        actionTransitionFunctions: {
            'Main': {
                WSARCRIFINF_SI: function (event) {
                    // si chiude il dialog di conferma, re-enable and reappear form
                    $('#WSARCRIFINF-Dialog').hide('slow');
                    $('#restantiDomandeDiv').show('slow');
                    $('input,textarea', $('#garanziaAdeguatezzaForm')).add('#garanziaAdeguatezza_Previous,#garanziaAdeguatezza_Next').removeAttr('disabled');
                    // tutto il resto ritorna rilevante
                    $('input,textarea', $('#restantiDomandeDiv')).removeClass('volatile');
                },
                WSARCRIFINF_NO: function (event) {
                    // si apre il dialog di conferma, disable form and disappear form
                    $('#WSARCRIFINF-Dialog').show('slow');
                    $('#restantiDomandeDiv').hide('slow');
                    // disabilito le frecce previous/next
                    $('.preventivi_anchor').addClass('disabled_anchor').attr('disabled', 'disabled');
                    return 'WSARCRIFINF-Dialog';
                },
                WSARCNECASS_01: function (event) { this.flags.WSARCNECASS = false; },
                WSARCNECASS_02: function (event) {
                    alert(StringResources['flagAdeguatezza.JSON.WSARCNECASS']);
                    this.flags.WSARCNECASS = true;
                },
                WSARCNECASS_03: function (event) {
                    alert(StringResources['flagAdeguatezza.JSON.WSARCNECASS']);
                    this.flags.WSARCNECASS = true;
                },
                WSARCNECASS_04: function (event) {
                    alert(StringResources['flagAdeguatezza.JSON.WSARCNECASS']);
                    this.flags.WSARCNECASS = true;
                },
                WSARCNECASS_05: function (event) {
                    alert(StringResources['flagAdeguatezza.JSON.WSARCNECASS']);
                    this.flags.WSARCNECASS = true;
                },
                WSARCMASASS_01: function (event) {
                    /* verify se quaglia col massimale scelto prima */
                    if (_model.WSDSDETTAGLIO.WSD1IMPMASSU !== '150000000') {
                        alert(StringResources['flagAdeguatezza.JSON.WSARCMASASS']);
                        this.flags.WSARCMASASS = true;
                    } else {
                        this.flags.WSARCMASASS = false;
                    }
                },
                WSARCMASASS_02: function (event) {
                    /* verify se quaglia col massimale scelto prima */
                    if (_model.WSDSDETTAGLIO.WSD1IMPMASSU === '150000000') {
                        alert(StringResources['flagAdeguatezza.JSON.WSARCMASASS']);
                        this.flags.WSARCMASASS = true;
                    } else {
                        this.flags.WSARCMASASS = false;
                    }
                },
                // comparsa/scomparsa popups WSARCVALSOM + WSARCSUFTUT
                WSARCALTRPO_SI: function (event) {
                    $('#WSARCVALSOM-Div,#WSARCSUFTUT-Div').show('slow');
                    $('[name=WSARCVALSOM],[name=WSARCSUFTUT]').addClass('required_field');
                },
                WSARCALTRPO_NO: function (event) {
                    $('#WSARCVALSOM-Div,#WSARCSUFTUT-Div').hide('slow');
                    $('[name=WSARCVALSOM],[name=WSARCSUFTUT]').removeClass('required_field').attr('checked', false);
                },
                WSARCSUFTUT_NO: function (event) {
                    this.flags.WSARCSUFTUT = true;
                    alert(StringResources['flagAdeguatezza.JSON.WSARCSUFTUT']);
                },
                // non risponde è lo stesso che rispondere NO
                WSARCSUFTUT_NR: function (event) { return this.actionTransitionFunctions.Main.WSARCSUFTUT_NO.call(this, event); },
                WSARCSUFTUT_SI: function (event) { this.flags.WSARCSUFTUT = false; },
                // handler per tutti e quattro gli WSARCDISFIN
                WSARCDISFIN: function (event) {
                    // test valore preventivo: NR || fascia inadatta ==> warning
                    var _calculatedPremio = parseInt(_model.WSDSDETTAGLIO.WSD1PREMIO);
                    var _ranges = {
                        '01': function (value) { return (_calculatedPremio <= 10000); },
                        '02': function (value) { return (_calculatedPremio <= 15000); },
                        '03': function (value) { return true; },
                        'NR': function (value) { return false; }
                    };
                    var chosenValue = $(event.target).attr('value');
                    if (!_ranges[chosenValue]()) {
                        alert(StringResources['flagAdeguatezza.JSON.WSARCDISFIN']);
                        this.flags.WSARCDISFIN = true;
                    }
                    else this.flags.WSARCDISFIN = false;
                },
                WSARCDISFIN_01: function (event) { return this.actionTransitionFunctions.Main.WSARCDISFIN.call(this, event); },
                WSARCDISFIN_02: function (event) { return this.actionTransitionFunctions.Main.WSARCDISFIN.call(this, event); },
                WSARCDISFIN_03: function (event) { return this.actionTransitionFunctions.Main.WSARCDISFIN.call(this, event); },
                WSARCDISFIN_NR: function (event) { return this.actionTransitionFunctions.Main.WSARCDISFIN.call(this, event); },
                WSARCOBBLEG_NO: function (event) { this.flags.WSARCOBBLEG = false; },
                WSARCOBBLEG_SI: function (event) {
                    alert(StringResources['flagAdeguatezza.JSON.WSARCOBBLEG']);
                    this.flags.WSARCOBBLEG = true;
                },
                WSARCOBBLEG_NR: function (event) {
                    alert(StringResources['flagAdeguatezza.JSON.WSARCOBBLEG']);
                    this.flags.WSARCOBBLEG = true;
                },
                // in state Main, WSARCRIFINF-Dialog_cancel ha la stessa funzione di quando siamo in state WSARCRIFINF-Dialog
                'WSARCRIFINF-Dialog_cancel': function (event) { return this.actionTransitionFunctions['WSARCRIFINF-Dialog']['WSARCRIFINF-Dialog_cancel'].call(this, event); },
                // in state Main, TEMP_CONFERMA_INADEGUATEZZA-Dialog_cancel ha la stessa funzione di quando siamo in state TEMP_CONFERMA_INADEGUATEZZA-Dialog
                'TEMP_CONFERMA_INADEGUATEZZA-Dialog_cancel': function (event) { return this.actionTransitionFunctions['TEMP_CONFERMA_INADEGUATEZZA-Dialog']['TEMP_CONFERMA_INADEGUATEZZA-Dialog_cancel'].call(this, event); },
                // anchor di rientro allo schermo precedente
                garanziaAdeguatezza_Previous: function () { /* resetta e rincula */
                    ASD.gestionePreventivi.view.onPrevious('garanziaAdeguatezza');
                },
                // passaggio al prossimo schermo --> verifica flags
                garanziaAdeguatezza_Next: function () {



                    /* se TEMP_CONFERMA_INADEGUATEZZA-Dialog hidden && 
                    almeno un flag true --> goto state TEMP_CONFERMA_INADEGUATEZZA-Dialog */
                    var flagged = false;
                    $.each(this.flags, function (key, value) { if (value) flagged = true; });
                    if ($('#TEMP_CONFERMA_INADEGUATEZZA-Dialog').is(':hidden') && flagged) { // svuota e ri-riempi lista flags

                        // faustoption(callbackOption)
                        return faustOption();

                        $('#listaRagioniInadeguatezza').empty();
                        $.each(this.flags, function (key, value) {
                            if (value) {
                                var currentLi = $('<li>' + StringResources['flagAdeguatezza.JSON.' + key] + '</li>');
                                $('#listaRagioniInadeguatezza').append(currentLi);
                            };
                        });
                        // mostro il dialog e lo rendo modale
                        $('#TEMP_CONFERMA_INADEGUATEZZA-Dialog').show('slow');
                        $('.preventivi_anchor').addClass('disabled_anchor');
                        return 'TEMP_CONFERMA_INADEGUATEZZA-Dialog';
                    }
                    // altrimenti naviga
                    else {
                        ASD.gestionePreventivi.view.onNext('garanziaAdeguatezza');
                        return false;
                    }
                }
            },
            // gestione dialog rifiuto a fornire risposte
            'WSARCRIFINF-Dialog': {
                'WSARCRIFINF-Dialog_confirm': function (event) {
                    this.flags.WSARCRIFINF = true;
                    // tutto il resto diventa irrilevante
                    $('input:radio', $('#restantiDomandeDiv')).attr('checked', false);
                    $('textarea', $('#restantiDomandeDiv')).val('');
                    // TODO - rifletti se volatile qui è corretto logicamente
                    $('input', $('#restantiDomandeDiv')).not('textarea').addClass('volatile').removeClass('required_field');
                    this.flags.WSARCNECASS = false;
                    this.flags.WSARCSUFTUT = false;
                    this.flags.WSARCDISFIN = false;
                    this.flags.WSARCMASASS = false;
                    $('[name=WSARCRIFINF]').filter('[value=NO]').attr('checked', 'checked');
                    $('#WSARCRIFINF-Dialog_confirm').addClass('disabled_anchor');
                    $('.preventivi_anchor').removeClass('disabled_anchor');
                    return 'Main';
                },
                'WSARCRIFINF-Dialog_cancel': function (event) {
                    this.flags.WSARCRIFINF = false;
                    $('[name=WSARCRIFINF]').filter('[value=SI]').attr('checked', 'checked');
                    $('#WSARCRIFINF-Dialog').hide('slow');
                    $('#WSARCRIFINF-Dialog_confirm,.preventivi_anchor').removeClass('disabled_anchor');
                    $('#restantiDomandeDiv').show('slow');
                    $('input,textarea', $('#garanziaAdeguatezzaForm')).add('.preventivi_anchor').removeAttr('disabled');
                    // tutto il resto ritorna rilevante
                    // TODO - rifletti se volatile qui è corretto logicamente
                    $('input', $('#restantiDomandeDiv')).not('textarea').removeClass('volatile').addClass('required_field');
                    return 'Main';
                },
                garanziaAdeguatezza_Next: function () { alert('prego confermare o annullare'); },
                garanziaAdeguatezza_Previous: function () { alert('prego confermare o annullare'); }
            },
            'TEMP_CONFERMA_INADEGUATEZZA-Dialog': {
                'TEMP_CONFERMA_INADEGUATEZZA-Dialog_confirm': function () {
                    $('#TEMP_CONFERMA_INADEGUATEZZA-Dialog_confirm').addClass('disabled_anchor');
                    $('.preventivi_anchor').removeClass('disabled_anchor');
                    // qui andrebbe settato TEMP_CONFERMA_INADEGUATEZZA nel model
                    return 'Main';
                },
                'TEMP_CONFERMA_INADEGUATEZZA-Dialog_cancel': function () {
                    $('#TEMP_CONFERMA_INADEGUATEZZA-Dialog').hide('slow');
                    $('#TEMP_CONFERMA_INADEGUATEZZA-Dialog_confirm,.preventivi_anchor').removeClass('disabled_anchor');
                    // qui andrebbe settato TEMP_CONFERMA_INADEGUATEZZA nel model
                    return 'Main';
                },
                garanziaAdeguatezza_Next: function () { alert('prego confermare o annullare'); },
                garanziaAdeguatezza_Previous: function () { alert('prego confermare o annullare'); }
            }
        },
        /* main method della state machine - 
        e.g. stateMachine.handleClick({ type: $(this).attr('id'), target: this });
        */
        handleClick: function (event) {
            var actionTransitionFunction = this.actionTransitionFunctions[this.currentState][event.type];
            // se non abbiamo un handler per questo click event, forniamo un handler di default
            if (!actionTransitionFunction) actionTransitionFunction = this.defaultHandler;
            var nextState = actionTransitionFunction.call(this, event);
            // se nextState è specificato ma non ha handlers, alert!
            if (nextState && !this.actionTransitionFunctions[nextState]) nextState = this.undefinedState(nextState);
            this.currentState = nextState ? nextState : this.currentState;
        },
        defaultHandler: function (event) {
            // TODO - remove next line after testing
            // alert('AdeguatezzaStateMachine received unexpected event ' + event.type + ' in state ' + this.currentState);
            return this.currentState;
        }
    }
};


