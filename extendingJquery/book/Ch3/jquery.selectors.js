/* http://keith-wood.name/selectors.html
   Selectors for jQuery v1.0.0.
   Written by Keith Wood (kbwood{at}iinet.com.au) December 2010.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it. */

(function($) { // Hide scope, no $ conflict

var is18 = /^1\.8/.test($.fn.jquery); // jQuery 1.8

function allText(element) {
	return element.textContent || element.innerText || $.text([element]) || '';
}

var standardMatchTrailer = /(?![^\[]*\])(?![^\(]*\))/;

/* Exact match of content. */
if (is18) {
	$.expr.filters.content = $.expr.createPseudo(function(text) {
		return function(element) {
			return allText(element) == text;
		};
	});
}
else {
	$.expr.filters.content = function(element, i, match) {
		return allText(element) == match[3];
	};
}

/* Regular expression match of content. */
if (is18) {
	$.expr.filters.matches = $.expr.createPseudo(function(text) {
		return function(element) {
			var flags = (text[0] || '') == '~' ? 'i' : '';
			return new RegExp(text.substring(flags ? 1 : 0), flags).test(allText(element));
		};
	});
}
else {
	$.expr.filters.matches = function(element, i, match) {
		var flags = (match[3][0] || '') == '~' ? 'i' : '';
		return new RegExp(match[3].substring(flags ? 1 : 0), flags).test(allText(element));
	};
}

/* All lists. */
$.expr.filters.list = function(element) {
	return /^(ol|ul)$/i.test(element.nodeName);
};

/* Emphasised text. */
$.expr.filters.emphasis = function(element) {
	return /^(b|em|i|strong)$/i.test(element.nodeName);
};

/* Foreign language elements. */
var defaultLanguage = new RegExp(
	'^' + (navigator.language || navigator.userLanguage).substring(0, 2), 'i');
if (is18) {
	$.expr.filters.foreign = $.expr.createPseudo(function(language) {
		return function(element) {
			var lang = $(element).attr('lang');
			return !!lang && (!language ? !defaultLanguage.test(lang) :
				new RegExp('^' + language.substring(0, 2), 'i').test(lang));
		};
	});
}
else {
	$.expr.filters.foreign = function(element, i, match) {
		var lang = $(element).attr('lang');
		return !!lang && (!match[3] ? !defaultLanguage.test(lang) :
			new RegExp('^' + match[3].substring(0, 2), 'i').test(lang));
	};
}

// Custom selectors
$.extend($.expr[":"], {
	// http://docs.jquery.com/Plugins/Validation/blank
	blank: function(a) {return !$.trim("" + a.value);},
	// http://docs.jquery.com/Plugins/Validation/filled
	filled: function(a) {return !!$.trim("" + a.value);},
	// http://docs.jquery.com/Plugins/Validation/unchecked
	unchecked: function(a) {return !a.checked;}
});

/* Middle elements. */
if (is18) {
	$.expr.match.POS = new RegExp($.expr.match.POS.source.replace(/odd/, 'odd|middle'), 'ig');
	$.expr.setFilters.middle = function(elements, argument, not) {
		var firstLast = [elements.shift(), elements.pop()];
		return not ? firstLast : elements;
	};
}
else {
	$.expr.match.POS = new RegExp($.expr.match.POS.source.replace(/odd/, 'odd|middle'));
	$.expr.leftMatch.POS = new RegExp($.expr.leftMatch.POS.source.replace(/odd/, 'odd|middle'));
	$.expr.setFilters.middle = function(element, i, match, list) {
		return i > 0 && i < list.length - 1;
	};
}

/* Allow index from end of list. */
if (is18) {
	$.expr.match.POS = new RegExp($.expr.match.POS.source.replace(/\\d\*/, '-?\\d*'), 'ig');
	$.expr.setFilters.eq = function(elements, argument, not) {
		argument = parseInt(argument, 10);
		argument = (argument < 0 ? elements.length + argument : argument);
		var element = elements.splice(argument, 1);
		return not ? elements : element;
	};
}
else {
	$.expr.match.POS = new RegExp($.expr.match.POS.source.replace(/\\d\*/, '-?\\d*'));
	$.expr.leftMatch.POS = new RegExp($.expr.leftMatch.POS.source.replace(/\\d\*/, '-?\\d*'));
	$.expr.setFilters.eq = function(element, i, match, list) {
		var index = parseInt(match[3], 10);
		index = (index < 0 ? list.length + index : index);
		return index === i;
	};
}

})(jQuery);
