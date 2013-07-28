// Persist data on the server
angular.module('store', []).
factory('Project', function () {
	var projectsModelName = 'projects';
	var Project = {
		save: function () {
			var data, callback;
			if (arguments[1]) {
				data = arguments[0];
				callback = arguments[1];
			} else {
				callback = arguments[0];
			}
			$n.local.exec(projectsModelName, 'save', data, callback);
		},

		get: function () {
			var data, callback;
			if (arguments[1]) {
				data = arguments[0];
				callback = arguments[1];
			} else {
				callback = arguments[0]
			}
			$n.local.exec(projectsModelName, 'get', data, callback);
		},

		remove: function () {
			var data, callback;
			if (arguments[1]) {
				data = arguments[0];
				callback = arguments[1];
			} else {
				callback = arguments[0]
			}
			$n.local.exec(projectsModelName, 'remove', data, callback);
		},
		
		projectsChanged: function(callback) {
			/*
				Watch for changes to the project list on the server.
				This event will be triggered if another open tab within the same session updates the projects data.
				This will keep all open tabs in sync.
			*/
			$n.local.watch('projectschanged', callback);
		}
	};

	return Project;
});