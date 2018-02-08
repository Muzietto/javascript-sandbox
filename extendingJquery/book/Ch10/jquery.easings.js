/* http://keith-wood.name/easings.html
   Additional easings for jQuery.
   Written by Keith Wood (kbwood{at}iinet.com.au) March 2012.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses.
   Please attribute the author if you use it. */

(function($) { // Hide scope, no $ conflict

$.support.newEasing = ($.easing.linear(1.0) == 1.0); // Changed in jQuery 1.7.2 and jQuery UI 1.8.23

/* Bump easing. */
function bumpEasing(p) {
	return (p < 0.5 ? Math.sin(p * Math.PI * 1.46) * 2 / 3 :
		1 - (Math.sin((1 - p) * Math.PI * 1.46) * 2 / 3));
}

if ($.support.newEasing) {
	$.easing.bump = bumpEasing;
}
else {
	$.easing.bump = function(p, n, firstNum, diff) {
		return firstNum + diff * bumpEasing(p);
	};
}

/* Zigzag easing. */
function zigzagEasing(p) {
	return 3 * (p < 0.333 ? p : (p < 0.667 ? 0.667 - p : p - 0.667));
}

if ($.support.newEasing) {
	$.easing.zigzag = zigzagEasing;
}
else {
	$.easing.zigzag = function(p, n, firstNum, diff) {
		return firstNum + diff * zigzagEasing(p);
	};
}

/* Run-up easing. */
function runupEasing(p) {
	return (p < 0.333 ? p : (p < 0.667 ? (p - 0.333) * 2 : (p - 0.667) * 3));
}

if ($.support.newEasing) {
	$.easing.runup = runupEasing;
}
else {
	$.easing.runup = function(p, n, firstNum, diff) {
		return firstNum + diff * runupEasing(p);
	};
}

/* Flash easing. */
function flashEasing(p) {
	return Math.floor(p * 4 + 1) % 2;
}

if ($.support.newEasing) {
	$.easing.flash = flashEasing;
}
else {
	$.easing.flash = function(p, n, firstNum, diff) {
		return firstNum + diff * flashEasing(p);
	};
}

})(jQuery);
