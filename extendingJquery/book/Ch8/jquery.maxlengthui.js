/* http://keith-wood.name/maxlengthui.html
   Maxlength plugin for jQuery UI v1.0.0.
   Written by Keith Wood (kbwood{at}iinet.com.au) March 2012.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it. */

(function($) { // Hide scope, no $ conflict

var maxlengthOverrides = {

	// Global defaults for maxlength
	options: {
		max: 200, // Maximum length
		truncate: true, // True to disallow further input, false to highlight only
		showFeedback: true, // True to always show user feedback, 'active' for hover/focus only
		feedbackTarget: null, // jQuery selector or function for element to fill with feedback
		feedbackText: '{r} characters remaining ({m} maximum)',
			// Display text for feedback message, use {r} for remaining characters,
			// {c} for characters entered, {m} for maximum
		overflowText: '{o} characters too many ({m} maximum)',
			// Display text when past maximum, use substitutions above
			// and {o} for characters past maximum
		full: null // Callback when full or overflowing,
			// receives two parameters: the triggering event and
			// an object with attribute overflow set to true if overflowing, false if not
	},

	// Class name for the feedback section
	_feedbackClass: '-feedback',
	// Class name for indicating the textarea is full
	_fullClass: 'ui-state-highlight',
	// Class name for indicating the textarea is overflowing
	_overflowClass: 'ui-state-error',

	/* Initialise a new maxlength textarea. */
	_create: function() {
		this.feedbackTarget = $([]);
		var self = this;
		this.element.addClass(this.widgetBaseClass).
			bind('keypress.' + this.widgetEventPrefix, function(event) {
				if (!self.options.truncate) {
					return true;
				}
				var ch = String.fromCharCode(
					event.charCode == undefined ? event.keyCode : event.charCode);
				return (event.ctrlKey || event.metaKey || ch == '\u0000' ||
					$(this).val().length < self.options.max);
			}).
			bind('keyup.' + this.widgetEventPrefix, function() { self._checkLength($(this)); });
		this.refresh();
	},

	/* Custom option handling.
	   @param  key    (string) the name of the option being changed
	   @param  value  (any) its new value */
	_setOption: function(key, value) {
		switch (key) {
			case 'disabled':
				this.element.prop('disabled', value);
				this.feedbackTarget.toggleClass('ui-state-disabled', value);
				break;
		}
		// Base widget handling
		if (this._superApply) {
			this._superApply(arguments);
		}
		else {
			$.Widget.prototype._setOption.apply(this, arguments);
		}
	},

	/* Custom options handling.
	   @param  option  (object) the new option values */
	_setOptions: function(options) {
		// Base widget handling
		if (this._superApply {
			this._superApply(arguments);
		}
		else {
			$.Widget.prototype._setOptions.apply(this, arguments);
		}
		this.refresh();
	},

	/* Refresh the appearance of the maxlength textarea. */
	refresh: function() {
		if (this.feedbackTarget.length > 0) { // Remove old feedback element
			if (this.hadFeedbackTarget) {
				this.feedbackTarget.empty().val('').
					removeClass(this.widgetBaseClass + this._feedbackClass + ' ' +
						this._fullClass + ' ' + this._overflowClass);
			}
			else {
				this.feedbackTarget.remove();
			}
			this.feedbackTarget = $([]);
		}
		if (this.options.showFeedback) { // Add new feedback element
			this.hadFeedbackTarget = !!this.options.feedbackTarget;
			if ($.isFunction(this.options.feedbackTarget)) {
				this.feedbackTarget = this.options.feedbackTarget.apply(this.element[0], []);
			}
			else if (this.options.feedbackTarget) {
				this.feedbackTarget = $(this.options.feedbackTarget);
			}
			else {
				this.feedbackTarget = $('<span></span>').insertAfter(this.element);
			}
			this.feedbackTarget.addClass(this.widgetBaseClass + this._feedbackClass +
				' ui-state-default' + (this.options.disabled ? ' ui-state-disabled' : ''));
		}
		this.element.unbind('mouseover.' + this.widgetEventPrefix + ' focus.' + this.widgetEventPrefix +
			' mouseout.' + this.widgetEventPrefix + ' blur.' + this.widgetEventPrefix);
		if (this.options.showFeedback == 'active') { // Additional event handlers
			var self = this;
			this.element.bind('mouseover.' + this.widgetEventPrefix, function() {
					self.feedbackTarget.css('visibility', 'visible');
				}).bind('mouseout.' + this.widgetEventPrefix, function() {
					if (!self.focussed) {
						self.feedbackTarget.css('visibility', 'hidden');
					}
				}).bind('focus.' + this.widgetEventPrefix, function() {
					self.focussed = true;
					self.feedbackTarget.css('visibility', 'visible');
				}).bind('blur.' + this.widgetEventPrefix, function() {
					self.focussed = false;
					self.feedbackTarget.css('visibility', 'hidden');
				});
			this.feedbackTarget.css('visibility', 'hidden');
		}
		this._checkLength();
	},

	/* Retrieve the counts of characters used and remaining.
	   @return  (object) the current counts with attributes used and remaining */
	curLength: function() {
		var value = this.element.val();
		var len = value.replace(/\r\n/g, '~~').replace(/\n/g, '~~').length;
		return {used: len, remaining: this.options.max - len};
	},

	/* Check the length of the text and notify accordingly. */
	_checkLength: function() {
		var value = this.element.val();
		var len = value.replace(/\r\n/g, '~~').replace(/\n/g, '~~').length;
		this.element.toggleClass(this._fullClass, len >= this.options.max).
			toggleClass(this._overflowClass, len > this.options.max);
		if (len > this.options.max && this.options.truncate) { // Truncation
			var lines = this.element.val().split(/\r\n|\n/);
			value = '';
			var i = 0;
			while (value.length < this.options.max && i < lines.length) {
				value += lines[i].substring(0, this.options.max - value.length) + '\r\n';
				i++;
			}
			this.element.val(value.substring(0, this.options.max));
			this.element[0].scrollTop = this.element[0].scrollHeight; // Scroll to bottom
			len = this.options.max;
		}
		this.feedbackTarget.toggleClass(this._fullClass, len >= this.options.max).
			toggleClass(this._overflowClass, len > this.options.max);
		var feedback = (len > this.options.max ? // Feedback
			this.options.overflowText : this.options.feedbackText).
				replace(/\{c\}/, len).replace(/\{m\}/, this.options.max).
				replace(/\{r\}/, this.options.max - len).
				replace(/\{o\}/, len - this.options.max);
		try {
			this.feedbackTarget.text(feedback);
		}
		catch(e) {
			// Ignore
		}
		try {
			this.feedbackTarget.val(feedback);
		}
		catch(e) {
			// Ignore
		}
		if (len >= this.options.max) {
			this._trigger('full', null,
				$.extend(this.curLength(), {overflow: len > this.options.max}));
		}
	},

	/* Remove the maxlength textarea functionality. */
	_destroy: function() {
		if (this.feedbackTarget.length > 0) {
			if (this.hadFeedbackTarget) {
				this.feedbackTarget.empty().val('').css('visibility', 'visible').
					removeClass(this.widgetBaseClass + this._feedbackClass + ' ' +
						this._fullClass + ' ' + this._overflowClass);
			}
			else {
				this.feedbackTarget.remove();
			}
		}
		this.element.removeClass(this.widgetBaseClass + ' ' +
				this._fullClass + ' ' + this._overflowClass).
			unbind('.' + this.widgetEventPrefix);
	}
};

if ($.ui.version < '1.9') {
	$.extend(maxlengthOverrides, {
		/* Remove the maxlength textarea functionality. */
		destroy: function() {
			this._destroy();
		$.Widget.prototype.destroy.call(this); // Base widget handling
	}
	});
}

/* Maxlength restrictions for textareas.
   Depends on jquery.ui.widget. */
$.widget('kbw.maxlength', maxlengthOverrides);

// Make some things more accessible
$.kbw.maxlength.options = $.kbw.maxlength.prototype.options;

})(jQuery);
