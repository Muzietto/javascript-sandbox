/* http://keith-wood.name/implode.html
   Implode effect for jQuery UI v1.8.x and 1.9.x.
   Written by Keith Wood (kbwood{at}iinet.com.au) March 2012.
   Based on Explode effect.
   Depends on jquery.effects.core.js.
   Licensed under the MIT (https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt) license.
   Please attribute the author if you use it. */

(function($) { // Hide scope, no $ conflict

var newEffects = !!$.effects.effect; // Using new effects framework?

if (newEffects) {
	$.effects.effect.implode = function(options, done) {
		implodeIt.apply(this, arguments);
	};
}
else {
	$.effects.implode = function(o) {
		var options = $.extend({complete: o.callback}, o, o.options);
		return this.queue(function() {
			var el = $(this);
			implodeIt.apply(this, [options, function() { el.dequeue(); }]);
		});
	};
}

/* Apply the implode effect immediately.
   @param  options  (object) settings for this effect
   @param  done     (function) callback when the effect is finished */
function implodeIt(options, done) {

	var rows = cells = options.pieces ? Math.round(Math.sqrt(options.pieces)) : 3;

	options.mode = $.effects.setMode($(this), options.mode);
	var el = $(this).show().css('visibility', 'hidden');

	var offset = el.offset();
	// Subtract the margins - not fixing the problem yet
	offset.top -= parseInt(el.css('marginTop'), 10) || 0;
	offset.left -= parseInt(el.css('marginLeft'), 10) || 0;

	var cellWidth = el.outerWidth(true) / cells;
	var cellHeight = el.outerHeight(true) / rows;

	var remaining = rows * cells; 
	var completed = function() { // Countdown to full completion
		if (--remaining == 0) {
			options.mode == 'show' ? el.css({visibility: 'visible'}) :
				el.css({visibility: 'visible'}).hide();
			if (options.complete) {
				options.complete.apply(el[0]); // Callback
			}
			$('div.ui-effects-implode').remove();
			done();
		}
	};

	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cells; j++) {
			el.clone().appendTo('body').wrap('<div></div>').
				css({position: 'absolute', visibility: 'visible',
					left: -j * cellWidth, top: -i * cellHeight}).
				parent().addClass('ui-effects-implode').
				css({position: 'absolute', overflow: 'hidden', width: cellWidth, height: cellHeight,
					left: offset.left + j * cellWidth +
						(options.mode == 'show' ? -(j - cells / 2 + 0.5) * cellWidth : 0),
					top: offset.top + i * cellHeight +
						(options.mode == 'show' ? -(i - rows / 2 + 0.5) * cellHeight : 0),
					opacity: options.mode == 'show' ? 0 : 1}).
				animate({left: offset.left + j * cellWidth +
						(options.mode == 'show' ? 0 : -(j - cells / 2 + 0.5) * cellWidth),
					top: offset.top + i * cellHeight +
						(options.mode == 'show' ? 0 : -(i - rows / 2 + 0.5) * cellHeight),
					opacity: options.mode == 'show' ? 1 : 0
				}, options.duration || 500, completed);
		}
	}
}

})(jQuery);
