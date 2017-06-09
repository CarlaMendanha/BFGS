angular.module('bfgs.services', [])

.service('Usuario', function($http, $ionicLoading, $ionicPopup) {
    this.cadastrar = function(user) {
        var that = this;
        $ionicLoading.show();
        return $http.post('https://haskcamaro-romefeller.c9users.io/cadastro', user)
            .then(function(response) {
                if (response) {
                    console.log(response.data)
                }
            }).catch(function(e) {
                console.error(e);
                $ionicPopup.alert({
                    title: e.statusText
                });
                that.salvarUsuario(user.id, user.nome)
            }).finally(function() {
                $ionicLoading.hide();
            })
    }

    this.login = function(user) {
        var that = this;
        $ionicLoading.show();
        return $http.get('https://haskcamaro-romefeller.c9users.io/login/' + user.email + '/' + user.password)
            .then(function(response) {
                if (response) {
                    console.log(response.data)
                    that.salvarUsuario(response.data.id, user.nome)
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
        localStorage.setItem('id', id);
        localStorage.setItem('nome', nome);
    }

    this.get = function() {
        return {
            id: parseInt(localStorage.getItem('id'),10) || 0,
            nome: localStorage.getItem('nome') || ''
        }
    }
})

.service('Pergunta', function($http) {
    this.aleatoria = function() {
        var that = this;
        return $http.get('https://haskcamaro-romefeller.c9users.io/aleatoria').then(function(r) {
            if (r) {
                return r.data;
            }
        })
    }
})

.service('Partida', function($http, $rootScope, Usuario) {
    this.salvar = function() {
        var uid = Usuario.get().id;
        if (uid) {
            var partida = {
                    pontuacao: $rootScope.partida.pontuacao,
                    usuarioId: uid,
                    dia: new Date().toSQL()
                }
                console.info(partida);
            $http.post('https://haskcamaro-romefeller.c9users.io/partida', partida).then(console.log).catch(console.log);
        }
    }
})