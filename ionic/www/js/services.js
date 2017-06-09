angular.module('bfgs.services', [])

.service('Usuario', function($http, $ionicLoading, $ionicHistory, $ionicPopup, $state) {
    this.cadastrar = function(user) {
        var self = this;
        $ionicLoading.show();
        return $http.post('https://haskcamaro-romefeller.c9users.io/cadastro', user)
            .then(function(response) {
                if (response) {
                    self.salvarUsuario(response.data.id, user.nome)
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('menu');
                }
            }).catch(function(e) {
                console.error(e);
                $ionicPopup.alert({
                    title: e.statusText
                });
            }).finally(function() {
                $ionicLoading.hide();
            })
    }

    this.login = function(user) {
        var self = this;
        $ionicLoading.show();
        return $http.get('https://haskcamaro-romefeller.c9users.io/login/' + user.email + '/' + user.password)
            .then(function(response) {
                if (response) {
                    self.salvarUsuario(response.data.id, response.data.nome);
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('menu');
                }
            }).catch(function() {
                $ionicPopup.alert({
                    title: 'Login inválido'
                })
            }).finally(function() {
                $ionicLoading.hide();
            })
    }
    this.salvarUsuario = function(id, nome) {
        console.log(id, nome);
        localStorage.setItem('id', id);
        localStorage.setItem('nome', nome);
    }

    this.get = function() {
        return {
            id: parseInt(localStorage.getItem('id'), 10) || 0,
            nome: localStorage.getItem('nome') || ''
        }
    }

    this.temQueEstarLogado = function() {
        var u = this.get();
        if (!u.id || !u.nome || u.nome === 'undefined') {
            $state.go('login');
        }
    }

    this.logout = function() {
        localStorage.removeItem('id');
        localStorage.removeItem('nome');
    }
})

.service('Pergunta', function($http) {
    this.aleatoria = function() {
        var self = this;
        return $http.get('https://haskcamaro-romefeller.c9users.io/aleatoria').then(function(r) {
            if (r) {
                return r.data;
            }
        })
    }
})

.service('Partida', function($http, $rootScope, $ionicPopup, $state, $ionicLoading, Usuario) {
    this.salvar = function() {
        var uid = Usuario.get().id;
        if (uid) {
            var partida = {
                pontuacao: $rootScope.partida.pontuacao,
                usuarioId: uid,
                dia: new Date().toSQL()
            }
            console.info(partida);
            $http.post('https://haskcamaro-romefeller.c9users.io/partida', partida).then(console.log).catch(console.error);
        }
    }

    this.placar = function() {
        $ionicLoading.show()
        return $http.get('https://haskcamaro-romefeller.c9users.io/placar').then(function(r) {
            if (r) {
                return r.data;
            }
        }).catch(function() {
            $ionicPopup.alert({
                    title: 'Houve um erro ao buscar o placar!',
                    message: 'Você está conectado à internet?'
                })
                .then(function() {
                    $state.go('menu');
                })
        }).finally(function() {
            $ionicLoading.hide();
        });
    }
})