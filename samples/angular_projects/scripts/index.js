require('./store');

$(document.body).html($n.grab.app.template('index').toString());

angular.module('project', ['store', 'ngRoute']).
config(function ($routeProvider, $locationProvider) {
	/*
		The $n.grab.app.templateURL() is optional, you also simply type out the full URL.
		Note that Nombo app URLs have a short from and a long form - The long form should be used when
		multiple apps are sharing the same domain name.
		The short URL for 'list.html' is simply: /template/list.html
		and the long URL is /angular_projects/scripts/list.html (the /angular_projects/ bit can be 
		used for URL rewriting as a way to distinguish this app from others on the same domain.
		$n.grab.app.templateURL('list.html') expands into the long URL.
	*/
	$routeProvider.
	when('/', {
		controller: ListCtrl,
		templateUrl: $n.grab.app.templateURL('list.html')
	}).
	when('/edit/:projectId', {
		controller: EditCtrl,
		templateUrl: $n.grab.app.templateURL('detail.html')
	}).
	when('/new', {
		controller: CreateCtrl,
		templateUrl: $n.grab.app.templateURL('detail.html')
	}).
	otherwise({
		redirectTo: '/'
	});
});

function ListCtrl($scope, Project) {
	var loadProjects = function(projects) {
		$scope.$apply(function () {
			$scope.projects = projects;
		});
	}
	Project.get(function (err, projects) {
		loadProjects(projects);
	});
	
	/*
		Register a callback which will be called whenever the project list is changed on the server side.
		This is used to keep data in sync across all open tabs which share the same session.
	*/
	Project.projectsChanged(loadProjects);
}

function CreateCtrl($scope, $location, Project) {
	$scope.save = function () {
		Project.save($scope.project, function (err, project) {
			$scope.$apply(function () {
				$location.path('/edit/' + project._id);
			});
		});
	}
}

function EditCtrl($scope, $location, $routeParams, Project) {
	var self = this;

	Project.get({
		_id: $routeParams.projectId
	}, function (err, project) {
		self.original = project;
		$scope.$apply(function () {
			$scope.project = self.original;
		});
	});

	$scope.destroy = function () {
		Project.remove(self.original, function (err) {
			$scope.$apply(function () {
				$location.path('/list');
			});
		});
	};

	$scope.save = function () {
		Project.save(self.original, function (err) {
			$scope.$apply(function () {
				$location.path('/');
			});
		});
	};
}

angular.bootstrap(document, ['project']);