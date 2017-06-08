angular.module('bfgs.controllers', [])

.controller('loginCtrl', function($scope, $ionicPopup, Usuario){
    $scope.loginData = {
        email: '',
        password: ''
    }
    $scope.doLogin = function(){
        var user = $scope.loginData;
        if(!user.email || !user.password){
            $ionicPopup.alert({title: 'Preencha todos os campos!'});
            return;
        }
        Usuario.login(user);
    };
})

.controller('cadastroCtrl', function($scope, $ionicPopup, Usuario){
    $scope.loginData = {
        name: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    }
    $scope.doCadastro = function (){
        if ($scope.loginData.password !== $scope.loginData.passwordConfirmation){
            $ionicPopup.alert({title:'Senhas diferentes!'});
            return;
        }
        var usuario = {
            nome: $scope.loginData.name, 
            email: $scope.loginData.email, 
            senha: $scope.loginData.password
        }
        Usuario.cadastrar(usuario);
        
    }
    
})