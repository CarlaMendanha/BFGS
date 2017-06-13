angular.module('bfgs.controllers', [])

.controller('loginCtrl', function($scope, $ionicPopup,Usuario) {
    $scope.loginData = {
        email: '',
        password: ''
    }
    $scope.doLogin = function() {
        var user = $scope.loginData;
        if (!user.email || !user.password) {
            $ionicPopup.alert({
                title: 'Orra, meu!',
                template: 'Tem campo em branco ou inválido aí!'
            });
            return;
        }
        Usuario.login(user);
    };
})

.controller('cadastroCtrl', function($scope, $ionicPopup, Usuario) {
    $scope.loginData = {
        name: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    }
    $scope.doCadastro = function() {
        if ($scope.loginData.password !== $scope.loginData.passwordConfirmation) {
            $ionicPopup.alert({
                title: 'Brincadeira, meu!',
                template: 'As senhas que você digitou são diferentes, tanto no pessoal como no profissional.'
            });
            return;
        }
        var usuario = {
            nome: $scope.loginData.name,
            email: $scope.loginData.email,
            senha: $scope.loginData.password
        }
        if (!usuario.senha || !usuario.email || !usuario.nome) {
            $ionicPopup.alert({
                title: 'Orra, meu!',
                template: 'Tem campo em branco ou inválido aí!'
            });
            return;
        }
        Usuario.cadastrar(usuario);

    }

})

.controller('menuCtrl', function(Usuario){
    Usuario.temQueEstarLogado();
})

.controller('questaoCtrl', function($rootScope, $scope, $state, $timeout, $ionicModal, $ionicPopup, Pergunta, Partida, Usuario) {
    Usuario.temQueEstarLogado();
 
    //$rootScope.sounds.song.play(); //chato bagarai
    $scope.pergunta = {};
    $scope.animation = {
        state: 'in'
    }
    //Inicializa partida, se ela nao existe
    if (!$rootScope.partida) {
        $rootScope.partida = {
            pulos: 3,
            streak: 0,
            pontuacao: 0,
            finalizada: false
        }
    }
    //Prepara o modal do "TA PEGANDO FOGO BICHO"
    $ionicModal.fromTemplateUrl('templates/fogo.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    
    //Pega uma pergunta aleatoria do back
    Pergunta.aleatoria().then(function(p) {
        $scope.animation.state = '';
        $scope.pergunta = p;
    })
    
    //Funcao chamada quando o jogador escolhe uma alternativa
    $scope.escolher = function(index) {
        if ($scope.pergunta.respondeu) { //se ele ta tentando apertar o botao dps que ja respondeu alguma coisa
            return;
        }
        var a = $scope.pergunta.alternativas[index]; //acha a alternativa marcada
        if (a.certa) { //se ela ta certa, segue em frente
            a.className = 'button-balanced';
            if($rootScope.partida.streak >= 4){ //pegando fogo?
                $rootScope.partida.pontuacao += $scope.pergunta.pontos * 1.25;
            }else{
                $rootScope.partida.pontuacao += $scope.pergunta.pontos;
            }
            $rootScope.partida.streak++;
            if ($rootScope.partida.streak == 4) { //avisa o jogador que ele TA PEGANDO FOGO BICHO
                $timeout(function(){
                    $scope.modal.show();
                    $rootScope.sounds.fogo.play();
                }, 200);
            }else{
                $rootScope.sounds.acertou.play();
            }
        }
        else { //ERROU!
            a.className = 'button-assertive';
            var certa = $scope.pergunta.alternativas.find(x => x.certa); //acha qual era a alternativa certa, pra pintar de verde
            certa.className = 'button-balanced';
            $rootScope.sounds.errou.play();
            $rootScope.partida.finalizada = true;
        }
        $scope.pergunta.respondeu = true;
    }
    //Funcao chamada quando o jogador aperta pular/continuar
    $scope.continuar = function() {
        if ($rootScope.partida.finalizada) { //se ele errou essa questao, pergunta se ele quer jogar de novo
            Partida.salvar(); //manda a partida pro back
            $ionicPopup.confirm({
                title: 'Terminou! Vai jogar de novo, meu?',
                okText: 'Sim',
                okType: 'button-balanced',
                cancelText: 'Menu',
                cancelType: 'button-light'
            }).then(function(resposta) {
                $rootScope.partida = false; //joga fora os dados da partida
                if(resposta){ //ele quer jogar outra
                    $state.reload();
                }else{
                    $state.go('menu'); //volta pro menu
                }
            })
            return;
        }
        if (!$scope.pergunta.respondeu) { //Pulou a questao
            $rootScope.partida.streak = 0;
            $rootScope.partida.pulos--;
        }
        $scope.animation.state = 'out';
        $timeout(function() {
            $state.reload(); //recarrega a pagina, pra buscar uma nova questao sem zoar as animacoes
        }, 1000);
    }
})

.controller('placarCtrl', function($scope, $rootScope, Partida, Usuario){
    Usuario.temQueEstarLogado();
    $scope.placar = [];
    Partida.placar().then(function(placar){
        $scope.placar = placar;
        $rootScope.sounds.placar.play();
    });
})