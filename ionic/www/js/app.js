// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('bfgs', ['ionic', 'bfgs.controllers', 'bfgs.services'])

.run(function($ionicPlatform, $http, $rootScope) {
    $rootScope.sounds = {
        errou: new Audio('sound/errou.mp3'),
        fogo: new Audio('sound/fogo.mp3'),
        placar: new Audio('sound/placar.mp3'),
        song: new Audio('sound/song.ogg')
    }
    $rootScope.sounds.song.loop = true;
    $http.defaults.headers.post["Content-Type"] = "text/plain";
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });

    (function() {
        Date.prototype.toSQL = Date_toSQL;

        function Date_toSQL() {
            this.setHours(this.getHours() - 3);
            return this.toISOString().substring(0, 10); //.replace('T', ' ')
        }
    })();
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl'
        })


    .state('cadastro', {
        url: '/cadastro',
        templateUrl: 'templates/cadastro.html',
        controller: 'cadastroCtrl'
    })

    .state('questao', {
        url: '/questao',
        templateUrl: 'templates/questao.html',
        controller: 'questaoCtrl',
        cache: false
    })

    .state('regras', {
        url: '/regras',
        cache: false,
        templateUrl: 'templates/regras.html',
    })

    .state('menu', {
        url: '/menu',
        cache: false,
        controller: 'menuCtrl',
        templateUrl: 'templates/menu.html',
    })

    .state('placar', {
        url: '/placar',
        cache: false,
        templateUrl: 'templates/placar.html',
        controller: 'placarCtrl'
    })

    .state('logout', {
        url: '/logout',
        cache: false,
        resolve: {
            confirma: function($state, $ionicPopup, Usuario) {
                return $ionicPopup.confirm({
                    title: 'Tem certeza que deseja sair?',
                    okText: 'Sair',
                    cancelText: 'Ficar',
                    cancelType: 'button-positive',
                    okType: 'button-assertive'
                }).then(function(querSair) {
                    if (querSair) {
                        Usuario.logout();
                        $state.go('login');
                    }else{
                        $state.go('menu');
                    }
                })
            }
        }
    })


    $urlRouterProvider.otherwise('/login');
});