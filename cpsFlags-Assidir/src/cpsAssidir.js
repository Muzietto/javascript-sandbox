/* CPS ASSIDIR - contiene clickHandlers e altri oggetti del mio sistema
*/
var CPAS = {};

(function (ns) {
    // la VIEW!!!!!!!!
    var view = function (model) {
        // archivio dei legami coseDaValidare-handlers
        var _bounds = {
            'click': {},
            'validate': {},
            'collect': {}
        };
        return {
            /*  
            CUORE CONTROVERSO DEL SISTEMA - binda passando sè stessa e il model al click event!!!
            target è un singolo selector o uno handlerObject (in tal caso non ci sono altri parametri)
            */
            bind: function (target, handler, eventType) {
                var that = this;
                if ($.isPlainObject(target)) {
                    // ciclo tra gli eventType, e.g. 'validate'
                    $.each(target, function (eventTypeKey, handlers) {
                        // ciclo tra i selector, e.g. '#RISPONDO_NO'
                        $.each(handlers, function (selector, handlerFunction) {
                            $(selector).bind(eventTypeKey, {view: that, model: model}, handlerFunction);
                            _bounds[eventTypeKey][selector] = handlerFunction;
                        });
                    });
                }
                else {
                    $(target).bind(eventType, {view: that, model: model}, handler);
                    _bounds[eventType][target] = handler;
                }
            },
            unbindAll: function() {
                $.each(_bounds, function(eventType, handlerMap){
                    $.each(handlerMap, function(selector, handler){
                        $(selector).unbind(eventType, handler);
                    });
                });
            },
            /*
            this != model (no apply!!!), selector may be optional;
            returns object with error messages as properties & true as values
            TODO - verifica il funzionamento di #formName per triggerare il validate su tutti gli input di una form
            */
            validate: function (selector) {
                var that = this;
                var validationMessages = {};
                var aux = {}; // general purpose object ref. PRESE.autorizzoHandler.validate['[name=AUTORIZZO]']
                if (selector) $(selector).trigger('validate', [{ validationMessages: validationMessages, aux: aux }]);
                // TODO - rivedi come gestire bene il controllo ($(this).is(':checked')) - usare $target.prop()
                else $.each(_bounds.validate, function (key, value) { 
                    $(key).trigger('validate', [{ validationMessages: validationMessages, aux: aux }]); 
                });
                return validationMessages;
            },
            // helper method - ritorna array con error messages
            validationArray: function() {
                var validationMessages = [];
                $.map(this.validate(), function (value, key) {
                    validationMessages.push(key);
                });
                return validationMessages;
            },
            // selector may be optional. returns filled model
            collect: function (model, selector) {
                if (selector) $(selector).trigger('collect', [{ model: model}]);
                // TODO - riflettere sul selettore per catturare tutta la form!!!!!!!
                // TODO - come gestire l'esclusione dei submit?
                else $('input:not(.volatile),textarea:not(.volatile),select:not(.volatile)').each(function () { 
                    $(this).trigger('collect', [{ model: model}]); 
                });
                return model;
            },
            // per contenuti e scelte utente
            // TODO - creare una resetAll basata su _bounds
            reset: function(selector){  // può essere un DOM element!!
                // TODO evitare di togliere i value ai checkbox+radio!!!
                $(selector).prop('checked',false).val('');
                this.removeWarning(selector);
            },
            is: function(selector, condition) {
                return $(selector).is(condition);
            },
            // embrione di navigazione statemachine-style
            navigate: function () {
                this.unbindAll();
                this.reset('[name=RISPONDO],[name=PROTETTO],[name=PREMIO_2]');
                this.showModel(/*model*/);alert('Sail away...'); 
            },
            /* IMPLEMENTAZIONE SEMI-SPECIFICA
            (richiede un parent div.validation_placeholder)
            */
            placeWarning: function(target){
                var that = this;
                var placeholder = $('<div/>',{
                    css:{  position:'relative' }
                    });
               
                var warningTriangle = $('<img/>',{
                    src:'./img/triangle_alert_small.png',
                    class:'warning_triangle',
                    css:{position:'absolute',bottom:'-17px',left:'-20px'}
                    }).appendTo(placeholder);
    
                this.removeWarning(target);
                $(target).parent('.validation_placeholder').prepend(placeholder).one('click',function(){that.removeWarning(target);});
            },
            /* IMPLEMENTAZIONE SEMI-SPECIFICA
            (richiede un parent div.validation_placeholder)
            */
            removeWarning: function(target){
                $('.warning_triangle',$(target).parent('.validation_placeholder')).remove();
            },
            /* IMPLEMENTAZIONE SPECIFICA con alert/confirm 
            prende una CPAS.notification come argomento
            */
            notify: function (notification) {
                if (!notification.feedback()) alert(notification.text());
                else {
                    if (confirm(notification.text())) notification.onConfirm();
                    else notification.onCancel();
                }
            },
            /* IMPLEMENTAZIONE SPECIFICISSIMA
            (gira SOLO in YUI-CpsAssidir.htm)
            */
            showModel:function(/*model*/){
                var message='<h4>MODEL</h4>';
                $.each(model, function(key,value) {
                    message += '<p>'+key + ': '+value + '</p>';
                });            
                $('#risultatiDiv').html(message);
            }
        }
    };

    /*  NB - il collettore gira con this = DOM input:text field
    */
    // dovrebbe valere anche per le textarea e per le select
    var genericTextCollector = function (ev) {
        if ($(this).attr('name').length === 0) return false; // no name ==> no collector
        ev.data.model[$(this).attr('name')] = $(this).val();
    }
    var genericRadioCollector = function (ev) {
        if ($(this).attr('name').length === 0) return false; // no name ==> no collector
        if ($(this).is(':checked')) ev.data.model[$(this).attr('name')] = $(this).val();
    }
    /* colletta in comma-separated string
    TODO - implementare la collection in array
    */
    var genericCheckboxCollector = function (ev) {
        if ($(this).attr('name').length === 0) return false; // no name ==> no collector
        if ($(this).is(':checked')) {
            var currentValue = $(this).val();
            var valuesCollection = ev.data.model[$(this).attr('name')] ? ev.data.model[$(this).attr('name')] : '';
            valuesCollection += (valuesCollection.length === 0) ? currentValue : ',' + currentValue;
            ev.data.model[$(this).attr('name')] = valuesCollection;
        }
    };
    // controlla che almeno uno sia :checked
    var genericChosenInputValidator = function(selector) {
        // girerà con this = DOM element
        return function(ev,data) {
            if ($(selector + ':checked').length === 0) { // almeno uno sia schiacciato
                ev.data.view.placeWarning(this);
                data.validationMessages['Prego scegliere un valore per ' + $(this).attr('name')] = true;
            }            
        };
    };

    var genericSelectedSelectValidator = function(selector){
        return function(ev, data) {
            if (!$(selector).val()) { // rifiuta options con value=""
                ev.data.view.placeWarning(this);
                data.validationMessages['Prego scegliere un valore per ' + $(this).attr('name')] = true;                
            }
        };
    };


    ns.view = view;
    ns.genericTextCollector = genericTextCollector;
    ns.genericRadioCollector = genericRadioCollector;
    ns.genericCheckboxCollector = genericCheckboxCollector;
    ns.genericChosenInputValidator = genericChosenInputValidator;
    ns.genericSelectedSelectValidator = genericSelectedSelectValidator;
})(CPAS);

// Stuff from Giudici example.
CPAS.notification = function () {
    var _text, _feedback;
    return {
        withText: function (aText) { _text = aText; return this; },
        withFeedback: function (aFeedback) { _feedback = aFeedback; return this; },
        text: function () { return $.isFunction(_text) ? _text() : _text; },
        feedback: function () { return _feedback; },
        onConfirm: function () { _feedback ? _feedback.onConfirm() : void(0); },
        onCancel: function () { _feedback ? _feedback.onCancel() : void(0); }
    };
};

CPAS.feedback = function (confirmCallback, cancelCallback) {
    var _confirm = confirmCallback;
    var _cancel = cancelCallback;
    return {
        onConfirm: function () { _confirm ? _confirm() : void(0); },
        onCancel: function () { _cancel ? _cancel() : void(0); }
    }
};

