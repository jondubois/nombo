require('./store');

angular.module('project', ['store']).
  config(function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {controller:ListCtrl, templateUrl:'/templates/list.html'}).
      when('/edit/:projectId', {controller:EditCtrl, templateUrl:'/templates/detail.html'}).
      when('/new', {controller:CreateCtrl, templateUrl:'/templates/detail.html'}).
      otherwise({redirectTo:'/'});
  });
 
function ListCtrl($scope, Project) {
	Project.get(function(err, projects) {
		$scope.$apply(function() {
			$scope.projects = projects;
		});
	});
}

function CreateCtrl($scope, $location, Project) {
	$scope.save = function() {
		Project.save($scope.project, function(err, project) {
			$location.path('/edit/' + project._id);
		});
	}
}

function EditCtrl($scope, $location, $routeParams, Project) {
  var self = this;
 
  Project.get({_id: $routeParams.projectId}, function(err, project) {
    self.original = project;
	$scope.$apply(function() {
		$scope.project = self.original;
	});
  });
 
  $scope.destroy = function() {
	Project.remove(self.original, function(err) {
      $location.path('/list');
    });
  };
 
  $scope.save = function() {
	Project.save(self.original, function(err) {
		console.log(4444);
		$scope.$apply(function() {
		$location.path('/');
		});
    });
  };
}