// Persist data on the server
angular.module('store', []).
    factory('Project', function() {
		var projectsModelName = 'projects';
		var Project = {
			save: function() {
				var data, callback;
				if(arguments[1]) {
					data = arguments[0];
					callback = arguments[1];
				} else {
					callback = arguments[0];
				}
				$n.local.exec(projectsModelName, 'save', data, callback);
			},
			
			get: function() {
				var data, callback;
				if(arguments[1]) {
					data = arguments[0];
					callback = arguments[1];
				} else {
					callback = arguments[0]
				}
				$n.local.exec(projectsModelName, 'get', data, callback);
			},
			
			remove: function() {
				var data, callback;
				if(arguments[1]) {
					data = arguments[0];
					callback = arguments[1];
				} else {
					callback = arguments[0]
				}
				$n.local.exec(projectsModelName, 'remove', data, callback);
			}
		};
 
      return Project;
    });
	