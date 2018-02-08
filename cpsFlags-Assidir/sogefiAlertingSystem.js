// contiene il codice per varie pagine con javascript "leggero" e ripetitivo

SOGEFI.alert = {};

/* alerting systems
    NB: SOGEFI.alert.view deve essere globale per potervi accedere dalla main closure.
    Quando il click handler venisse gestito dalla view stessa, il global potrà essere evitato
*/
(function (ns) {

    var validators = {
            // validate DEVE avere un argument data, che conterrà i dati da confrontare per la specifica validazione
            // data = { model: model, validationMessages: validationMessages}
            '.mandatory_field': function (ev, data) {
                // mandatory field
                if ($(this).val() === ''){
                    $(this).addClass('errored_field');  
                    data.validationMessages['Prego scegliere un valore per ' + $(this).attr('name')] = true;
                    $(this).one('click',function(){$(this).removeClass('errored_field');});
                    return;
                }
            },
            '[name=usrEmail]': function (ev, data) {
                // is email
                var emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                if (!emailRegex.test($(this).val())) {
                    $(this).addClass('errored_field');  
                    data.validationMessages['Il campo ' + $(this).attr('name') + ' deve essere un valido indirizzo email'] = true;
                    $(this).one('click',function(){$(this).removeClass('errored_field');});
                    return;
                }
            },
            '[name=cfrPassword]': function (ev, data) {
                if (!$(this).val() || $(this).val() !== $('[name=usrPassword]').val()) {
                    $(this).addClass('errored_field');  
                    data.validationMessages['La password non è stata correttamente confermata'] = true;
                    $(this).one('click',function(){$(this).removeClass('errored_field');});
                }
            },
            '[name=subscriptionType]': function (ev, data) {
                if ($('[name=subscriptionType]:checked').length === 0) { // almeno uno sia schiacciato
                    data.view.placeWarning(this);
                    //$(this).one('click',function(){data.view.removeWarning(this)});
                    // così si evita di scrivere più volte la stessa stringa negli validationMessages
                    data.validationMessages['Prego scegliere un valore per ' + $(this).attr('name')] = true;
                }
            },
            '[name=subscriberLanguage]': function (ev, data) {
                if ($('[name=subscriberLanguage]:checked').length === 0) { // almeno uno sia schiacciato
                    data.view.placeWarning(this);
                    //$(this).one('click',function(){data.view.removeWarning(this)});
                    // così si evita di scrivere più volte la stessa stringa negli validationMessages
                    data.validationMessages['Prego scegliere un valore per ' + $(this).attr('name')] = true;
                }
            },
            '[name=usrPrivacy]': function (ev, data) {
                if (!$(this).is(':checked')) {
                    data.view.placeWarning(this);
                    //$(this).one('click',function(){data.view.removeWarning(this)});
                    data.validationMessages['Prego accettare la clausola sul trattamento dati personali'] = true;
                }
            }
    };

    var callback = function (data) {
        var returnMessage = data.Table[0].returnMessage;
        if (returnMessage === 'subscriber.JSON.create.ok') {
            var okMessage = StringResources[returnMessage].replace('{0}', data.Table1[0].usrEmail).replace('{1}', data.Table1[0].usrPassword);
            $('#registrazioneSubscriberFormDiv').hide();
            $('#registrazioneSubscriberMessagesDiv').removeClass('errored').html(okMessage).show();
        } else {
            var errorMessage = StringResources[returnMessage] ? StringResources[returnMessage] : returnMessage;
            $('#registrazioneSubscriberMessagesDiv').html(errorMessage).addClass('errored').show();
            $('#registrazioneSubscriberForm').one('click', function () { $('#registrazioneSubscriberMessagesDiv').hide(); });
        }
    };
    var ass = function (ev) {
        // utilizzo del global per accedere alla view
        var errorMessages = ns.view.validationArray();
        if (errorMessages.length > 0) {ns.view.alert(errorMessages);return false;}

        var qs = $('#registrazioneSubscriberForm').not('.volatile').serialize();
        var props = {
            dataTypeString: 'json',
            url: '/web/insertSubscription.aspx?output=JSON&ts=' + new Date().getTime(),
            method: 'get',
            async: true,
            data: qs,
            success: callback,
            error: function () { alert('server error!'); }
        };
        $.ajax(props);
        return false;
    };

    ns.onSubmit = ass;
    ns.validators = validators;
})(SOGEFI.alert);

$(document).ready(function () {
    SOGEFI.alert.view = CPS.view();
    var view = SOGEFI.alert.view;

    $.each(SOGEFI.alert.validators, function(key,value) { view.bind(key, value, 'validate'); });


    view.reset($('input:text',$('#registrazioneSubscriberForm')).not('textarea'));
    $('#alertSubscriptionSubmitButton').click(SOGEFI.alert.onSubmit);
});

// gestione view
var CPS = {};

(function (ns) {
    // la VIEW!!!!!!!!
    var view = function (model) {
        model = model | {};
        // archivio dei legami coseDaValidare-handlers
        var _bounds = {
            'click': {},
            'validate': {},
            'collect': {}
        };
        return {
            /*
            binda passando sè stessa al click event, così il widget se la spacchetta e la usa!!!
            target è un singolo selector o uno handlerObject (in tal caso non ci sono altri parametri)
            */
            bind: function (target, handler, eventType) {
                var that = this;
                if ($.isPlainObject(target)) {
                    // ciclo tra gli eventType, e.g. 'validate'
                    $.each(target, function (eventTypeKey, handlers) {
                        // ciclo tra i selector, e.g. '#RISPONDO_NO'
                        $.each(handlers, function (selector, handlerFunction) {
                            // CUORE controverso del sistema - avessi model passerei anche quello?!?
                            $(selector).bind(eventTypeKey, {view: that}, handlerFunction);
                            _bounds[eventTypeKey][selector] = handlerFunction;
                        });
                    });
                }
                else {
                    // CUORE controverso del sistema - avessi model passerei anche quello?!?
                    $(target).bind(eventType, {view: that}, handler);
                    _bounds[eventType][target] = handler;
                }
            },
            /*
            this != model (no apply!!!), selector may be optional;
            returns object with error messages as properties & true as values
            TODO - verifica il funzionamento di #formName per triggerare il validate su tutti gli input di una form
            */
            validate: function (selector) {
                var that = this;
                var validationMessages = {};
                if (selector) $(selector).trigger('validate', [{ model: model, validationMessages: validationMessages, view:that }]);
                // TODO - rivedi come gestire bene il controllo ($(this).is(':checked')) - usare $target.prop()
                else $.each(_bounds.validate, function (key, value) {
                    $(key).trigger('validate', [{ model: model, validationMessages: validationMessages, view:that }]); 
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
            // contenuti e scelte utente - NB: selector may be a jQuery object
            reset: function(selector){
                // TODO evitare di togliere i value ai checkbox+radio!!!
                $(selector).prop('checked',false).val('');
            },
            // prende una CPAS.notification come argomento
            notify: function (notification) {
                if (!notification.feedback()) alert(notification.text());
                else {
                    if (confirm(notification.text())) notification.onConfirm();
                    else notification.onCancel();
                }
            },
            // specific implementation - messages is always an array
            alert: function(messages){
                var result = '';
                $.each(messages,function(index, value) {
                    result += value + '\n';
                });
                alert(result);
            },
            placeWarning: function(target){
                var that = this;
                var placeholder = $('<div/>',{
                    css:{  position:'relative' }
                    });
               
                var warningTriangle = $('<img/>',{
                    src:'/includes/img/triangle_alert_small.png',
                    class:'warning_triangle',
                    css:{position:'absolute',bottom:'-17px',left:'-20px'}
                    }).appendTo(placeholder);
    
                this.removeWarning(target);
                $(target).parent('.validation_placeholder').prepend(placeholder).one('click',function(){that.removeWarning(target);});
            },
            removeWarning: function(target){
                $('.warning_triangle',$(target).parent('.validation_placeholder')).remove();
            }
        }
    };

    ns.view = view;
})(CPS);