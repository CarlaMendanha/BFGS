var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "templates/main.html",
        controller: "mainCtrl"
    })
    .when("/pergunta/nova", {
        templateUrl : "templates/pergunta/form.html",
        controller: "novaPergunta",
        resolve: {
            categorias: function(Categoria){
                return Categoria.all();
            }
        }
    })
    .when("/pergunta/editar/:id", {
        templateUrl : "templates/pergunta/form.html",
        controller: "editarPergunta",
        resolve: {
            categorias: function(Categoria){
                return Categoria.all();
            },
            pergunta: function(Pergunta, $routeParams){
                return Pergunta.get($routeParams.id)
            },
        }
    })
    .when("/pergunta/:id", {
        templateUrl : "templates/pergunta/show.html",
        controller: "showPergunta",
        resolve: {
            pergunta: function(Pergunta, $routeParams){
                return Pergunta.get($routeParams.id)
            }
        }
    })

    .otherwise("/");
});

app.controller('mainCtrl', function($rootScope){
    $rootScope.titulo = 'Perguntas'
});

app.controller('novaPergunta', function($rootScope, $scope, $location, categorias){
    $rootScope.titulo = 'Nova pergunta';
    $scope.categorias = categorias;
    $scope.botaoSalvar = "Adicionar";
    $scope.model = {
        id: 0,
        enunciado: '',
        pontos: 0
    }
    $scope.voltar = function(){
        $location.path( "/" );
    };
    $scope.salvar = function(){
        var data = Object.assign({}, $scope.model);
        data.categoriaId = data.categoria.id;
        delete data.categoria;
        delete data.id;
        console.log(data);
    }
});

app.controller('editarPergunta', function($rootScope, $scope, $location, categorias, pergunta){
    $rootScope.titulo = 'Editar pergunta';
    $scope.categorias = categorias;
    $scope.botaoSalvar = "Adicionar";
    $scope.model = pergunta;
    $scope.voltar = function(){
        $location.path( "/" );
    };
    $scope.salvar = function(){
        var data = Object.assign({}, $scope.model);
        data.categoriaId = data.categoria.id;
        delete data.categoria;
        delete data.id;
        console.log(data);
    }
});

app.controller('showPergunta', function($rootScope, $scope, $routeParams, pergunta){
    $rootScope.titulo = 'Pergunta #'+$routeParams.id;

    $scope.pergunta = pergunta;

    $scope.alternativas = [
        {id:1, texto: "Alt1", certa: true},
        {id:2, texto: "Alt2", certa: false},
    ];
    $scope.editar = function(index){
        var a = $scope.alternativas[index];
        var novoTexto = prompt("Digite o novo texto para a pergunta:");
        if(novoTexto.length > 0){
            a.texto = novoTexto;
            //TODO REQUISICAO
        }
    }
    $scope.remover = function(index){
        $scope.alternativas.splice(index, 1);
        //TODO REQUISICAO
    }
    $scope.marcar = function(index){
        var a = $scope.alternativas[index];
        a.certa = !a.certa;
        //TODO REQUISICAO
    }


    $scope.add = function(){
        var novoTexto = prompt("Digite o novo texto para a pergunta:");
        if(novoTexto.length > 0){
            var a = {texto: novoTexto, certa: false};
            //TODO REQUISICAO E SALVAR ID NA ALTERNATIVA
            $scope.alternativas.push(a);
        }
    }
});

app.service('Categoria', function(){
    this.all = function(){
        return [
            {id : 1, nome : "Variedades"},
            {id : 2, nome : "Esportes"},
        ];
    }
});

app.service('Pergunta', function(){
    this.get = function(id){
        /*{
          "pontos": 800,
          "categoria": {
            "nome": "Esportes",
            "id": 1
          },
          "id": 2,
          "enunciado": "tal tal"
        }*/
        return {id : 1, enunciado : "Qual a diferença entre o charme e o funk?", pontos: 3000, categoria: {id : 2, nome : "Esportes"}}
    }
})
