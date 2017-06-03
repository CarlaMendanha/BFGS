var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "templates/main.html",
        controller: "mainCtrl"
    })
});

app.controller('mainCtrl', function(){
});
