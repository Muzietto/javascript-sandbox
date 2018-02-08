/*
File JS con:
- le regole di validazione specifiche per la form di member confirmation.
- codice di inizializzazione form confirmation
*/
(function (ns) { // ns = namespace è in qsto caso un subpackage del main
    ns.confirmation = {
        testFlag: 'STIC.confirmation',
        errorMessages: [],
        erroredFieldIds: [],

        /* metodo principale di validazione form
        da customizzare a seconda dei campi utente da validare
        */
        validate: function (savingData) {
            this.errorMessages = [];
            this.erroredFieldIds = [];
            try {
                $.each(this.erroredFieldIds, function (i, v) { $(v).removeClass('error') });
                $("#errormessages").hide();

                // verifica di tutti i campi obbligatori (css class 'required')
                $('.required', $('#memberAcceptationForm')).each(function (index, input) {
                    // deve chiamare 'ns.confirmation.errorMessages' perchè $.each sostituisce il this
                    ns.rules.isMandatory(input.id, ns.confirmation.errorMessages, ns.confirmation.erroredFieldIds);
                });
                // il prossimo andrebbe fuso nella funzione precedente, rendendola 'polimorfica'
                ns.rules.isCheckboxChecked('memberPrivacyDisclaimer', this.errorMessages, '1', StringResources['validate.usrprivacydisclaimer']);
                // verifica dei campi su cui si è svolta verifica ajax
                ns.rules.isNotOnError('memberEmail', this.errorMessages, this.erroredFieldIds);

                // verifiche specifiche
                ns.rules.isEmail('memberEmail', this.errorMessages, this.erroredFieldIds);
                ns.rules.isPhone('memberPhone', this.errorMessages, this.erroredFieldIds);
            } catch (err) {
                this.errorMessages.push(StringResources['validate.genericerror'] + ': ' + err.message);
            }
            // preparazione error repo
            if (this.errorMessages.length > 0) {
                var listerrors = "<li>" + this.errorMessages.join("</li><li>") + "</li>";
                for (var i = 0; i < this.erroredFieldIds.length; i++) {
                    $(this.erroredFieldIds[i]).addClass('error');
                    $(this.erroredFieldIds[i]).blur(function () {
                        $(this).removeClass('error');
                    });
                }
                $("#messages").html(listerrors);
                $("#errormessages").show();
                $.scrollTo(0, 800, { queue: true });
                return false;
            }
            return true;
        }
    };
} (STIC.validation));

// funzioni specifiche pagina di member confirmation
(function (ns) {
    ns.confirmation = {
        testFlag: 'STIC.confirmation',

        // richiede dispatcher precipua
        verifyUniqueMemberEmail: function () {
            var data = {};
            data.memberEmail = $('#memberEmail').val();
            data.memberHash = $('#memberHash').val();
            $.getJSON('/web/verificaMemberEmail.aspx?output=JSON',
                data,
                function (data) {
                    if (data.Table[0].emailfound == "1") {
                        $('#memberEmail').addClass("error");
                        $('#lblErrorEmailAlreadyPresentInDb').show();
                    } else {
                        $('#memberEmail').removeClass("error");
                        $('#lblErrorEmailAlreadyPresentInDb').hide();
                    }
                });
        }
    };

    // inizializzazione pagina di member confirmation
    $(document).ready(function () {
        $('.tooltip').tipsy({ opacity: 1, gravity: 's', html: true });
        $('.required').each(function () { $(this).prev().html($(this).prev().html() + '<sub style="font-size:x-large;">*</sub>') })

        //alert(STIC.confirmation.testFlag + ': init completed');
    });
} (STIC));