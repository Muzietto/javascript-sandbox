/* http://keith-wood.name/rightclick2.html
   Right-click enhancement for click event for jQuery v1.0.0.
   Written by Keith Wood (kbwood{at}iinet.com.au) March 2012.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it. */

(function($) { // Hide scope, no $ conflict

$.event.clickDisabled = $([]);

/* Add support for right mouse click. */
$.event.special.click = {

	/* Add a right-click event handler.
	   @param  data        (object, optional) any data values passed to the bind
	   @param  namespaces  (string[]) any namespaces passed to the bind */
	setup: function(data, namespaces) {
		$(this).addClass('right-clickable').
			bind('contextmenu', $.event.special.click.handler);
		return false;
	},

	/* Destroy the right-click event handler.
	   @param  namespaces  (string[]) any namespaces passed to the unbind */
	teardown: function(namespaces) {
		$(this).removeClass('right-clickable').
			unbind('contextmenu', $.event.special.click.handler);
		return false;
	},

	/* Implement the actual event handling.
	   @param  event  (Event) the event details
	   @return  (boolean) false to suppress default behaviour */
	handler: function(event) {
		if ($.event.clickDisabled.length && $(this).is($.event.clickDisabled)) {
			event.stopPropagation();
			event.preventDefault();
			return;
		}
		event.type = 'click';
		event.which = 3;
		return $.event.handle.apply(this, arguments);
	}
};

})(jQuery);
