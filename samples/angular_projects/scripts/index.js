require('./store');

angular.module('project', ['store']).
config(function ($routeProvider, $locationProvider) {
	$routeProvider.
	when('/', {
		controller: ListCtrl,
		templateUrl: '/templates/list.html'
	}).
	when('/edit/:projectId', {
		controller: EditCtrl,
		templateUrl: '/templates/detail.html'
	}).
	when('/new', {
		controller: CreateCtrl,
		templateUrl: '/templates/detail.html'
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