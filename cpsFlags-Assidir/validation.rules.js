/*
File JS con le regole di validazione.
Settare il namespace di VALIDAZIONE alla fine del file.
*/
(function (ns) {
    ns.rules = {
        // 1) building blocks
        numericEU: function (val) {
            var value = jQuery.trim(val);
			var filter = /^(?:-?)(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/;
            return filter.test(value);
        },
        numericEUNoDecimal: function (val) {
            var value = jQuery.trim(val); 
			var filter = /^(?:-?)(?:\d+|\d{1,3}(?:\.\d{3})+)$/;
            return filter.test(value)
        },
        email: function (val) {
            var value = jQuery.trim(val);
            var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!filter.test(value)) {
                return false;
            }
            return true;
        },
        phone: function (val) {
            var value = jQuery.trim(val);
            return /^[\-\+\/\. 0-9]+$/.test(value);
        },
        digits: function (val) {
            var value = jQuery.trim(val);
            return /^\d+$/.test(value);
        },
        range: function (val, min, max) {
            var value = jQuery.trim(val);
            return (value >= min && value <= max);
        },
        size: function (val, size) {
            return val.length === size;
        },
        // NB - il prossimo cerca per NAME!!
        radioChecked: function (name, val) {
            return ($('input[name="' + name + '"]:radio:checked').val() === val);
        },
        // NB - il prossimo cerca per NAME!!
        checkboxChecked: function (name, value) {
            return ($('input[name="' + name + '"]:checkbox:checked').val() === value);
        },
        // soddisfatto da campi vuoti o inizianti per '-- ' ( -- seleziona un valore -- )
        empty: function (fieldId) {
            var value = jQuery.trim($('#' + fieldId).val());
            return (value == '' || (value.substring(0, 3) == '-- '));
        },
        // 2) validation functions
        isMandatory: function (id, errorMessages, erroredFieldIds) {
            if (ns.rules.empty(id)) {
                if (id.indexOf(' ') > 0) { id = id.substr(0, id.indexOf(' ')); }
                errorMessages.push(StringResources['validate.missing'].replace('#fieldname#', $('label[for="' + id + '"]').contents().filter(function () { return this.nodeType == 3; }).text()));
                erroredFieldIds.push('#' + id);
                return false;
            }
            return true;
        },
        // AAA - non gestisce direttamente gli ids!!!!!
        isOneOfTheseMandatory: function (jQueryHandlesArray, errorMessages, erroredFieldIds) {
            var result = false;
            $.each(jQueryHandlesArray, function (index, jQueryHandle) {
                if (!ns.rules.empty(jQueryHandle.id)) result = true;
            });
            if (!result) {
                var errorString = '';
                $.each(jQueryHandlesArray, function (index, jQueryHandle) {
                    errorString += $('label[for="' + jQueryHandle.id + '"]').contents().filter(function () { return this.nodeType == 3; }).text() + ',';
                    erroredFieldIds.push('#' + jQueryHandle.id);
                });
                errorMessages.push(StringResources['validate.allmissing'].replace('#fieldnames#', errorString));
            }
            return result;
        },
        isNotOnError: function (id, errorMessages, erroredFieldIds) {
            if ($('#' + id).hasClass('error')) {
                if (id.indexOf(' ') > 0) { id = id.substr(0, id.indexOf(' ')); }
                errorMessages.push(StringResources['validate.onerror'].replace('#fieldname#', $('label[for="' + id + '"]').contents().filter(function () { return this.nodeType == 3; }).text()));
                erroredFieldIds.push('#' + id);
                return false;
            }
            return true;
        },
        // NB - non gestisce la colorazione in rosso del radiobutton incriminato
        isRadioButtonChecked: function (name, errorMessages, val, str) {
            if (!ns.rules.radioChecked(name, val)) {
                if (name.indexOf(' ') > 0) { name = name.substr(0, name.indexOf(' ')); }
                var message = str ? str : StringResources['validate.choose'].replace('#fieldname#', $('label[for="' + name + '"]').contents().filter(function () { return this.nodeType == 3; }).text());
                errorMessages.push(message);
                return false;
            }
            return true;
        },
        // NB - non gestisce la colorazione in rosso del checkbox incriminato
        isCheckboxChecked: function (name, errorMessages, value, str) {
            if (!ns.rules.checkboxChecked(name, value)) {
                if (name.indexOf(' ') > 0) { name = name.substr(0, name.indexOf(' ')); }
                var message = str ? str : StringResources['validate.choose'].replace('#fieldname#', $('label[for="' + name + '"]').contents().filter(function () { return this.nodeType == 3; }).text());
                errorMessages.push(message);
                return false;
            }
            return true;
        },
        isNumber: function (id, errorMessages, erroredFieldIds) {
            // empty is always OK
            if (ns.rules.empty(id)) { return true; }
            if (!ns.rules.digits($('#' + id).val())) {
                if (id.indexOf(' ') > 0) { id = id.substr(0, id.indexOf(' ')); }
                errorMessages.push(StringResources['validate.notanumber'].replace('#fieldname#', $('label[for="' + id + '"]').contents().filter(function () { return this.nodeType == 3; }).text()));
                erroredFieldIds.push('#' + id);
                return false;
            }
            return true;
        },
        // tre alpha characters
        isCurrency: function (id, errorMessages, erroredFieldIds) {
            // empty is always OK
            if (ns.rules.empty(id)) { return true; }
            if (ns.rules.digits($('#' + id).val()) || !($('#' + id).val().length === 3)) {
                if (id.indexOf(' ') > 0) { id = id.substr(0, id.indexOf(' ')); }
                errorMessages.push(StringResources['validate.notacurrency'].replace('#fieldname#', $('label[for="' + id + '"]').contents().filter(function () { return this.nodeType == 3; }).text()));
                erroredFieldIds.push('#' + id);
                return false;
            }
            return true;
        },
        isPhone: function (id, errorMessages, erroredFieldIds) {
            // empty is always OK
            if (ns.rules.empty(id)) { return true; }
            if (!ns.rules.phone($('#' + id).val())) {
                if (id.indexOf(' ') > 0) { id = id.substr(0, id.indexOf(' ')); }
                errorMessages.push(StringResources['validate.notaphone'].replace('#fieldname#', $('label[for="' + id + '"]').contents().filter(function () { return this.nodeType == 3; }).text()));
                erroredFieldIds.push('#' + id);
                return false;
            }
            return true;
        },
        isEmail: function (id, errorMessages, erroredFieldIds) {
            // empty is always OK
            if (ns.rules.empty(id)) { return true; }
            if (!ns.rules.email($('#' + id).val())) {
                if (id.indexOf(' ') > 0) { id = id.substr(0, id.indexOf(' ')); }
                errorMessages.push(StringResources['validate.notaemail'].replace('#fieldname#', $('label[for="' + id + '"]').contents().filter(function () { return this.nodeType == 3; }).text()));
                erroredFieldIds.push('#' + id);
                return false;
            }
            return true;
        },
        // 5 cifre
        isCap: function (id, errorMessages, erroredFieldIds) {
            // empty is always OK
            if (ns.rules.empty(id)) { return true };
            if (!ns.rules.digits($('#' + id).val()) || !($('#' + id).val().length === 5)) {
                if (id.indexOf(' ') > 0) { id = id.substr(0, id.indexOf(' ')); }
                errorMessages.push(StringResources['validate.notacap'].replace('#fieldname#', $('label[for="' + id + '"]').contents().filter(function () { return this.nodeType == 3; }).text()));
                erroredFieldIds.push('#' + id);
                return false;
            }
            return true;
        },
        // 11 cifre
        isPartitaIva: function (id, errorMessages, erroredFieldIds) {
            // empty is always OK
            if (ns.rules.empty(id)) { return true };
            if (!ns.rules.digits($('#' + id).val()) || !($('#' + id).val().length === 11)) {
                if (id.indexOf(' ') > 0) { id = id.substr(0, id.indexOf(' ')); }
                errorMessages.push(StringResources['validate.notaiva'].replace('#fieldname#', $('label[for="' + id + '"]').contents().filter(function () { return this.nodeType == 3; }).text()));
                erroredFieldIds.push('#' + id);
                return false;
            }
            return true;
        },
        isNumericEUNoDecimal: function (id, errorMessages, erroredFieldIds) {
            // empty is always OK
            if (ns.rules.empty(id)) { return true; }
            var valore = jQuery.trim($('#' + id).val());
            if (!ns.rules.numericEUNoDecimal(valore)) {
                if (id.indexOf(' ') > 0) { id = id.substr(0, id.indexOf(' ')); }
                errorMessages.push(StringResources['validate.notaninteger'].replace('#fieldname#', $('label[for="' + id + '"]').contents().filter(function () { return this.nodeType == 3; }).text()));
                erroredFieldIds.push('#' + id);
                return false;
            } else {
                $('#' + id).val(valore.replace(".", ""));
                return true;
            }
        },
        isNumericEU: function (id, errorMessages, erroredFieldIds) {
            // empty is always OK
            if (ns.rules.empty(id)) { return true; }
            var valore = jQuery.trim($('#' + id).val());
            if (!ns.rules.numericEU(valore)) {
                if (id.indexOf(' ') > 0) { id = id.substr(0, id.indexOf(' ')); }
                errorMessages.push(StringResources['validate.notnumericeu'].replace('#fieldname#', $('label[for="' + id + '"]').contents().filter(function () { return this.nodeType == 3; }).text()));
                erroredFieldIds.push('#' + id);
                return false;
            } else {
                $('#' + id).val(valore.replace(".", ""));
                return true;
            }
        },
        areEqual: function (id1, id2, errorMessages, erroredFieldIds) {
            var valore1 = jQuery.trim($('#' + id1).val());
            var valore2 = jQuery.trim($('#' + id2).val());
            if (valore1 !== valore2) {
                if (id1.indexOf(' ') > 0) { id1 = id1.substr(0, id1.indexOf(' ')); }
                if (id2.indexOf(' ') > 0) { id2 = id2.substr(0, id2.indexOf(' ')); }
                errorMessages.push(StringResources['validate.arenotequal'].replace('#fieldname1#', $('label[for="' + id1 + '"]').contents().filter(function () { return this.nodeType == 3; }).text()).replace('#fieldname2#', $('label[for="' + id2 + '"]').contents().filter(function () { return this.nodeType == 3; }).text()));
                erroredFieldIds.push('#' + id1);
                erroredFieldIds.push('#' + id2);
                return false;
            }
            return true;
        }
    }
} (STIC.validation))