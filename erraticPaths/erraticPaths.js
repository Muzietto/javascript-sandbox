
var Erratic = {};

Erratic.path = function(origin, destination, distance) {
	var _origin = origin;
	var _destination = destination;
	var _distance = distance;
	return {
		getOrigin : function() {
			return _origin;
		},
		getDestination : function() {
			return _destination;
		},
		getDistance : function() {
			return _distance;
		},
		equals : function(path) {
			return (this.getOrigin() == path.getOrigin() && this.getDestination() == path.getDestination());
		}
	}
};

Erratic.chain = function(){
	var _paths = [];
	return {
		getPaths : function() {
			return _paths;
		},
		addPath : function(path) {
			_paths.push(path);
			return this;
		},
		contains : function(path) {
			return this.getPaths().some(equals(path));
		},
		connects : function(origin, destination) {
			// trovato un path complesso da or a dest?	
		},
		distanceFrom_To : function(origin, destination) {
			// trovata o calcolata la distanza complessiva?
		}
	}
};
