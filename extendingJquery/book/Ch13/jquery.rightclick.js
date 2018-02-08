/* http://keith-wood.name/rightclick.html
   Right-click special event for jQuery v1.0.0.
   Written by Keith Wood (kbwood{at}iinet.com.au) March 2012.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it. */

(function($) { // Hide scope, no $ conflict

$.event.rightclickDisabled = $([]);

/* Provide an event for a right mouse click. */
$.event.special.rightclick = {

	/* The type of event being raised. */
	eventType: 'rightclick',

	/* Initialise the right-click event handler.
	   @param  data        (object, optional) any data values passed to the bind
	   @param  namespaces  (string[]) any namespaces passed to the bind */
	setup: function(data, namespaces) {
		$(this).addClass('right-clickable').
			bind('contextmenu', $.event.special.rightclick.handler);
	},

	/* Destroy the right-click event handler.
	   @param  namespaces  (string[]) any namespaces passed to the unbind */
	teardown: function(namespaces) {
		$(this).removeClass('right-clickable').
			unbind('contextmenu', $.event.special.rightclick.handler);
	},

	/* Implement the actual event handling.
	   @param  event  (Event) the event details
	   @return  (boolean) false to suppress default behaviour */
	handler: function(event) {
		if ($.event.rightclickDisabled.length && $(this).is($.event.rightclickDisabled)) {
			event.stopPropagation();
			event.preventDefault();
			return;
		}
		event.type = $.event.special.rightclick.eventType;
		return $.event.handle.apply(this, arguments);
	}
};

/* Provide an event for a right mouse multiple click. */
$.event.special.rightmulticlick = {

	/* The type of event being raised. */
	eventType: 'rightmulticlick',

	/* Initialise the right-multi-click event handler.
	   @param  data        (object, optional) any data values passed to the bind
	   @param  namespaces  (string[]) any namespaces passed to the bind */
	setup: function(data, namespaces) {
		$(this).addClass('right-clickable');
	},

	/* Initialise the settings.
	   @param  handleObj  (object) details about the binding */
	add: function(handleObj) {
		var data = $.extend({clickCount: 2, clickNumber: 0, lastClick: 0, clickSpeed: 500,
			handler: handleObj.handler}, handleObj.data || {});
		var id = $.event.special.rightmulticlick.eventType + handleObj.guid;
		$(this).data(id, data).bind('contextmenu.' + id, {id: id},
				$.event.special.rightmulticlick.handler);
	},

	/* Remove the settings.
	   @param  handleObj  (object) details about the binding */
	remove: function(handleObj) {
		var id = $.event.special.rightmulticlick.eventType + handleObj.guid;
		$(this).removeData(id).unbind('contextmenu.' + id);
	},

	/* Destroy the right-click event handler.
	   @param  namespaces  (string[]) any namespaces passed to the unbind */
	teardown: function(namespaces) {
		$(this).removeClass('right-clickable');
	},

	/* Implement the actual event handling.
	   @param  event  (Event) the event details
	   @return  (boolean) false to suppress default behaviour */
	handler: function(event) {
		if ($.event.rightclickDisabled.length && $(this).is($.event.rightclickDisabled)) {
			event.stopPropagation();
			event.preventDefault();
			return;
		}
		var data = $(this).data(event.data.id);
		event.timeStamp = event.timeStamp || new Date().getTime();
		if (event.timeStamp - data.lastClick <= data.clickSpeed) {
			data.clickNumber++;
		}
		else {
			data.clickNumber = 1;
			data.lastClick = event.timeStamp;
		}
		var result = false;
		if (data.clickNumber == data.clickCount) {
			event.type = $.event.special.rightmulticlick.eventType;
			result = data.handler.apply(this, arguments);
		}
		return result;
	}
};

/* Add collection functions for these events. */
$.each([$.event.special.rightclick.eventType, $.event.special.rightmulticlick.eventType],
	function(i, eventType) {
		$.fn[eventType] = function(data, fn) {
			if (fn == null) {
				fn = data;
				data = null;
			}
			return arguments.length > 0 ? this.on(eventType, null, data, fn) :
				this.trigger(eventType);
		};
	}
);

})(jQuery);
