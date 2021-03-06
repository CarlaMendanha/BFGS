angular.module('bfgs.services', [])

.service('Usuario', function($http, $ionicLoading, $ionicPopup){
    this.cadastrar = function(user){
        var that = this;
        $ionicLoading.show();
        $http.post ('https://haskcamaro-romefeller.c9users.io/cadastro',user)
            .then(function(response){
                if(response){
                    console.log(response.data)
                }
            }).catch(function(e){
                console.error(e);
                $ionicPopup.alert({
                    title: e.statusText
                });
                that.salvarUsuario(user.id, user.nome)
            }).finally(function(){
                $ionicLoading.hide();
            })
    }
    
    this.login = function(user){
        var that = this;
        $ionicLoading.show();
        $http.get('https://haskcamaro-romefeller.c9users.io/login/'+user.email+'/'+user.password)
            .then(function(response){
                if(response){
                    console.log(response.data)
                    that.salvarUsuario(response.data.id, user.nome)
                }
            }).catch(function(){
                $ionicPopup.alert({
                    title: 'Login inválido'
                })
            }).finally(function(){
                $ionicLoading.hide();
            })
        }
    this.salvarUsuario = function(id, nome){
        localStorage.setItem('id', id);
        localStorage.setItem('nome', nome);
    }
    
    this.get = function(){
        return {
            id: localStorage.getItem('id') || 0,
            nome: localStorage.getItem('nome') || ''
        }
    }
})