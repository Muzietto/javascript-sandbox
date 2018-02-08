/* http://keith-wood.name/validate.html
   Extra validation rules for jQuery.
   Requires Jörn Zaefferer's Validation plugin (http://bassistance.de/jquery-plugins/jquery-plugin-validation/).
   Written by Keith Wood (kbwood{at}iinet.com.au) March 2012.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it. */

(function($) { // Hide scope, no $ conflict

/* Custom validator to match a regular expression.
   @param  value    (string) the current field value
   @param  element  (jQuery) the current field
   @param  param    (string or RegExp) the pattern to match
   @return  (boolean) true if valid, false if not */
$.validator.addMethod('matches', function(value, element, param) {
		var re = param instanceof RegExp ? param : new RegExp(param);
		return this.optional(element) || re.test(value);
	},
	$.validator.format('Please match this format "{0}".'));

/* Create a validation rule for a given regular expression.
   @param  pattern  (string or RegExp) the pattern to match
   @return  (function) the validation function */
function createRegExpRule(pattern) {
	var re = pattern instanceof RegExp ? pattern : new RegExp(pattern);
	return function(value, element, param) {
		return this.optional(element) || re.test(value);
	};
}

/* Custom validator to match a US Social Security Number.
   @return  (boolean) true if valid, false if not */
$.validator.addMethod('ssn', createRegExpRule('^\\d{3}-\\d{2}-\\d{4}$'),
	'Please enter a SSN - nnn-nn-nnnn.');

/* Custom validator to ensure a summed total.
   @param  value    (string) the current field value
   @param  element  (jQuery) the current field
   @param  param    (number and string) the total required and the selector for all fields
   @return  (boolean) true if valid, false if not */
$.validator.addMethod('totals', function(value, element, param) {
		var sum = 0;
		$(param[1]).each(function() {
			sum += parseInt($(this).val(), 10);
		});
		return sum == param[0];
	},
	$.validator.format('The total must be {0}.'));

})(jQuery);