/* http://faustinelli.wordpress.com/
   Select Xor for jQuery 
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it. */

(function($) { // Hide scope, no $ conflict
var SelectX, getters, isNotChained, plugin
;

/* SelectX */
SelectX = function() {
	this._defaults = {
		/* selected options disappear from the list 
		     and reappear when related selection widget is destroyed */
		selectOnce: true,
		/* handlers for various events to attach to widget elements */
		handlers: {
			/* elementSelector: {event1:handler1, event2:handler2}*/
		},
		/* jQuery selector of the container where the plugin creates a widget for each selection made */
		selectionsContainer: null,
		/* flag for usage template engine - only jtemplates allowed so far */
		templateEngine: false,
		/* widget for displaying selections made */
		templateHtml: String()
			+ '<div class="selectx-option-widget">'
			+ '	<label class="selectx-option-value" style="width:200px;min-height:18px;display:inline-block;"></label>'
			+ '	<button class="selectx-delete-widget" title="click to delete widget">delete selection</button>'
			+ '</div>',
		/* data for template engine processing */
		dataModel: {},
		optionsList: [
			{text:'1st option',value:1,data:null},
			{text:'2nd option',value:2,data:null},
			{text:'3rd option',value:3,data:null},
		],
		nullOptionMessage: 'pick one',
		onSelectCallback : null,   // executes at the end of the inner callback - this is ... ???
		onUnselectCallback : null // executes at the end of the inner callback
	};
}

$.extend(SelectX.prototype, {
	/* Class name added to elements to indicate already configured with max length. */
	markerClassName: 'hasSelectX',
	/* Name of the data property for instance settings. */
	pluginName: 'selectx',
	/* marks the selections container */
	selectionsClassName: 'selectx-selections-container',
	/*marks the already selected options */
	selectedOptionClass: 'selectx-selected-option',
	/*marks each option widget built in the DOM by the plugin */
	optionWidgetClass: 'selectx-option-widget',
	/*marks the value label in each option widget */
	optionValueClass: 'selectx-option-value',
	/*marks the 'delete widget' item in each option widget */
	deleteWidgetClass: 'selectx-delete-widget',
	/*marks each option widget container built in the DOM by the plugin 
		a option widget container contains a single option widget and it is
		necessary to give the templating engine an empty div to fill 
	*/
	optionWidgetContainerClass: 'selectx-option-widget-container',

	/* Override the default settings for all SelectXinstances in the current page.
	   @param  options  (object) the new settings to use as defaults
	   @return  (SelectX) this object */
	setDefaults: function(options) {
		$.extend(this._defaults, options || {});
		return this;
	},

	/* Attach the plugin to an existing select, adding all functionalities that do not depend on option values.
	   @param  $target   (element) the control to affect - IT MUST BE AN HTML SELECT!!!
	   @param  options  (object) the custom options for this instance */
	_attachPlugin: function($target, options) {
		var inst
		;
		$target = $($target);  // better safe than sorry!
		if ($target.hasClass(this.markerClassName) /* || target is not a select */) {
			return;
		}
		inst = {
			options: $.extend({}, this._defaults), // this = SelectX object (am I right?!?!)
			selectionsContainer: $([]) 
		};

		//$("#tree li:parent").unbind("collapse.TreeEvent"); // just remove the collapse event  
		//$("#tree li:parent").unbind(".TreeEvent"); // remove all events under the TreeEvent namespace
		
		$target.addClass(this.markerClassName).
			data(this.pluginName, inst).
			bind('change.' + this.pluginName, function() { 
				plugin._changeSelect($(this),inst.options); // attach main handler
			});
		this._optionPlugin($target, options);
	},

	/* Retrieve or reconfigure the settings for a control.
	   @param  $target   (element) the control to affect - IT MUST BE AN HTML SELECT!!!
	   @param  options  (object) the new options for this instance or
	                    (string) an individual property name
	   @param  value    (any) the individual property value (omit if options
	                    is an object or to retrieve the value of a setting)
	   @return  (any) if retrieving a value */
	_optionPlugin: function($target, options, value) {
		var inst = $target.data(this.pluginName)
		;
		
		/* start options preprocessing */
		if (!options || (typeof options == 'string' && value == null)) { // Get option
			var name = options;
			options = (inst || {}).options;
			return (options && name ? options[name] : options);
		}

		if (!$target.hasClass(this.markerClassName)) {
			return;
		}
		options = options || {};
		if (typeof options == 'string') {
			var name = options;
			options = {};
			options[name] = value;
		}
		$.extend(inst.options, options); // user options are mixed with previous instance options
		/* end options preprocessing */
		
		/* start true operations of this method */
		// 1) construction selections container
		if ($.isFunction(inst.options.selectionsContainer)) {
			inst.selectionsContainer = inst.options.selectionsContainer.apply(target[0], []);
		}
		else if (inst.options.selectionsContainer) {
			inst.selectionsContainer = $(inst.options.selectionsContainer);
		}
		else {
			inst.selectionsContainer = $('<div/>').insertAfter($target);
		}
		inst.selectionsContainer.addClass(this.selectionsClassName);

		// 2) -optional- construction of select options
		if ($('option',$target).length===0){
			$target.append($('<option/>',{text:inst.options.nullOptionMessage,value:''}));
			_(inst.options.optionsList).each(function(optObj){
				var $option = $('<option/>',optObj);
				if (optObj.data) {
					$option.data() = optObj.data;
				}
				$target.append($option);				
			});
		}
	},

	/* Remove the plugin functionality from a control.
	   @param  target  (element) the control to affect */
	_destroyPlugin: function($target) {
		var inst
		;
		$target = $($target);
		if (!$target.hasClass(this.markerClassName)) {
			return;
		}
		inst = $target.data(this.pluginName);
		// remove all stuff: selectionsContainer and whatever
		
		// clean up options (if not added by the plugin)

		// clean up target
		$target.removeClass(this.markerClassName).  // plus any further class
			removeData(this.pluginName).
			unbind('.' + this.pluginName);  // all plugin event handlers
	},
	
	/* Manages all activities following a user choice on the $target select
		'this' is the SelectX object
		@param $target is the select the plugin is attached to
		@param options is the whole set of instance options
	*/
	_changeSelect: function($target,options) {
		var $optionsWidgetContainer, $optionsWidget, 
			$widgetDeleter,
			$chosenOption = $(':selected',$target),
			inst = $target.data(this.pluginName),
			that = this
		;
		// create options widget inside a brand new empty options widget container
		$optionsWidgetContainer = $('<div/>').addClass(this.optionWidgetContainerClass);
		if (!options.templateEngine){  // vanilla process - no templating engine
			$optionsWidget = $(options.templateHtml)
			inst.selectionsContainer.append($optionsWidgetContainer.append($optionsWidget));
			$('.'+this.optionValueClass,$optionsWidget).text($chosenOption.text());
		}
		else { // jtemplates stuff here
            // REM processTemplate removes existing html in the container
            $optionsWidgetContainer.setTemplate(options.templateHtml)
				.processTemplate({value:$chosenOption.text()}/*options.dataModel*/);
			// only now I can instantiate $optionsWidget
			$optionsWidget = $('.'+this.optionWidgetClass,$optionsWidgetContainer);
			inst.selectionsContainer.append($optionsWidgetContainer.append($optionsWidget));
		}
		
		// TODO - apply handlers from options.handlers
		
		// implement widget deleter
		$widgetDeleter = $('.'+this.deleteWidgetClass,$optionsWidget);
		$widgetDeleter.data(this.pluginName+'-option',$chosenOption);  // attach option to $deleter
		//$widgetDeleter.data(this.pluginName+'-widget',$optionsWidget);  // attach widget to $deleter
		$widgetDeleter.click(function(event){  
			/* NB - here 'this' = $widgetDeleter[0] !!!
				gotta use 'that' to refer to the plugin instance
			*/
			// -optional- implement selectOnce
			if (options.selectOnce) {
				// option returns visible
				$(this).data(that.pluginName+'-option')
					.removeClass(that.selectedOptionClass);
			}
			$optionsWidgetContainer.remove();
			//$(this).data(that.pluginName+'-widget').remove();
		})
		
		// -optional- implement selectOnce
		if (options.selectOnce) {
			// find and mark selected option - it becomes invisible
			$chosenOption.addClass(this.selectedOptionClass);
		}
		
		// execute custom callback
		if (options.onSelectCallback) {
			options.onSelectCallback();  // TODO - check value of 'this' and use apply
		}
		$target.val('');  // reset select to 'please choose item'
	}
	
});

// The list of methods that return values and don't permit chaining
getters = [''];

/* Determine whether a method is a getter and doesn't permit chaining.
   @param  method     (string, optional) the method to run
   @param  otherArgs  ([], optional) any other arguments for the method
   @return  true if the method is a getter, false if not */
isNotChained = function(method, otherArgs) {
	if (method == 'option' && (otherArgs.length == 0 ||
			(otherArgs.length == 1 && typeof otherArgs[0] == 'string'))) {
		return true;
	}
	return $.inArray(method, getters) > -1;
}

/* Attach the selectx functionality to a jQuery selection.
   @param  options  (object) the new settings to use for these instances (optional) or
                    (string) the method to run (optional)
   @return  (jQuery) for chaining further calls or
            (any) getter value */
$.fn.selectx = function(options) {
	var otherArgs = Array.prototype.slice.call(arguments, 1);
	if (isNotChained(options, otherArgs)) {
		return plugin['_' + options + 'Plugin'].apply(plugin, [this[0]].concat(otherArgs));
	}
	return this.each(function() {
		if (typeof options == 'string') {
			if (!plugin['_' + options + 'Plugin']) {
				throw 'Unknown method: ' + options;
			}
			plugin['_' + options + 'Plugin'].apply(plugin, [this].concat(otherArgs));
		}
		else {
			plugin._attachPlugin(this, options || {});
		}
	});
};

/* Initialise the max length functionality. */
plugin = $.selectx = new SelectX(); // Singleton instance

})(jQuery);
