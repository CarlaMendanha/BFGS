var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "templates/main.html",
        controller: "mainCtrl",
        resolve: {
            perguntas: function(Pergunta){
                return Pergunta.all().then(function(d){
                    if(d){
                        return d.data
                    }
                })
            }
        }
    })
    .when("/pergunta/nova", {
        templateUrl : "templates/pergunta/form.html",
        controller: "novaPergunta",
        resolve: {
            categorias: function(Categoria){
                return Categoria.all().then(function(d){
                    if(d){
                        return d.data
                    }
                });
            }
        }
    })
    .when("/pergunta/editar/:id", {
        templateUrl : "templates/pergunta/form.html",
        controller: "editarPergunta",
        resolve: {
            categorias: function(Categoria){
                return Categoria.all().then(function(d){
                    if(d){
                        return d.data
                    }
                });
            },
            pergunta: function(Pergunta, $route){
                return Pergunta.get($route.current.params.id).then(function(d){
                    if(d){
                        return d.data
                    }
                });
            },
        }
    })
    .when("/pergunta/:id", {
        templateUrl : "templates/pergunta/show.html",
        controller: "showPergunta",
        resolve: {
            pergunta: function(Pergunta, $route){
                return Pergunta.get($route.current.params.id).then(function(d){
                    if(d){
                        return d.data
                    }
                });
            }
        }
    })

    .otherwise("/");
});

app.run(function($rootScope){
    $rootScope.dismiss = function(){
        $rootScope.flashMsg = null;
    }
    $rootScope.showError = function(e){
        console.log(e);
        $rootScope.flashMsg = {
            tipo: 'danger',
            texto: 'Erro na requisição: '+e.statusText
        }
    }
})

app.controller('mainCtrl', function($rootScope, $scope, perguntas, Pergunta){
    $rootScope.titulo = 'Perguntas'
    $scope.perguntas = perguntas;
    $scope.remover = function(index){
        if(confirm('Tem certeza que deseja remover esta pergunta?')){
            var p = $scope.perguntas[index];
            Pergunta.remove(p.id).then(function(r){
                if(r){
                    $scope.perguntas.splice(index, 1);
                }
            });
        }
    }
});

app.controller('novaPergunta', function($rootScope, $scope, $location, categorias, Pergunta){
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
        if(!data.enunciado || !data.pontos || !data.categoria){
            $rootScope.flashMsg = {
                tipo: 'warning',
                texto: 'Preencha todos os campos!'
            }
            return;
        }
        data.categoriaId = data.categoria.id;
        delete data.categoria;
        delete data.id;
        console.log(data);
        Pergunta.add(data).then(function(e){
            if(e){
                $rootScope.flashMsg = {
                    tipo: 'success',
                    texto: 'Pergunta cadastrada com sucesso!'
                }
                $location.path( "/" );
            }
        });
    }
});

app.controller('editarPergunta', function($rootScope, $scope, $location, categorias, pergunta, Pergunta){
    $rootScope.titulo = 'Editar pergunta';
    $scope.categorias = categorias;
    $scope.botaoSalvar = "Adicionar";
    $scope.model = pergunta;
    $scope.voltar = function(){
        $location.path( "/" );
    };
    $scope.salvar = function(){
        var data = Object.assign({}, $scope.model);
        var id = data.id;
        data.categoriaId = data.categoria.id;
        delete data.categoria;
        delete data.id;
        delete data.alternativas
        Pergunta.update(id, data).then(function(r){
            if(r){
                $rootScope.flashMsg = {
                    tipo: 'success',
                    texto: 'Pergunta modificada com sucesso!'
                }
                $location.path( "/" );
            }
        });
    }
});

app.controller('showPergunta', function($rootScope, $scope, $routeParams, pergunta, Alternativa){
    var perguntaId = parseInt($routeParams.id, 10);
    $rootScope.titulo = 'Pergunta #'+perguntaId;
    $scope.pergunta = pergunta;
    $scope.editar = function(index){
        var a = $scope.pergunta.alternativas[index];
        var novoTexto = prompt("Digite o novo texto para a pergunta:");
        if(novoTexto.length > 0){
            var data ={
                certa: a.certa,
                texto: novoTexto,
                perguntaId: perguntaId
            };
            Alternativa.update(a.id, data).then(function(r){
                if(r){
                    a.texto = novoTexto;
                }
            })
        }
    }
    $scope.remover = function(index){
        var a = $scope.pergunta.alternativas[index];
        if(confirm("Tem certeza que deseja remover esta alternativa?")){
            Alternativa.remove(a.id).then(function(r){
                if(r){
                    $scope.pergunta.alternativas.splice(index, 1);
                }
            })
        }
    }
    $scope.marcar = function(index){
        var a = $scope.pergunta.alternativas[index];
        var atual = $scope.pergunta.alternativas.find((x) => x.certa);
        if(atual){
            var novaAtual = {
                certa: false,
                texto: atual.texto,
                perguntaId: perguntaId
            };
            Alternativa.update(atual.id, novaAtual);
            atual.certa = false;
        }
        var data ={
            certa: !a.certa,
            texto: a.texto,
            perguntaId: perguntaId
        };
        Alternativa.update(a.id, data);
        a.certa = !a.certa;
    }

    $scope.add = function(){
        var novoTexto = prompt("Digite o novo texto para a pergunta:");
        if(novoTexto.length > 0){
            var data ={
                certa: false,
                texto: novoTexto,
                perguntaId: perguntaId
            };
            Alternativa.add(data).then(function(r){
                if(r){
                    data.id = r.data.id;
                    delete data.perguntaId;
                    $scope.pergunta.alternativas.push(data);
                }
            });
        }
    }
});

app.service('Categoria', function($http, $rootScope){
    this.all = function(){
        return $http.get('/categoria/').catch(console.error);
    }
});

app.service('Pergunta', function($http, $rootScope){
    this.get = function(id){
        return $http.get('/pergunta/'+id).catch($rootScope.showError);
        //return {id : 1, enunciado : "Qual a diferença entre o charme e o funk?", pontos: 3000, categoria: {id : 2, nome : "Esportes"}}
    }
    this.all = function(){
        //return [{id : 1, enunciado : "Qual a diferença entre o charme e o funk?", pontos: 3000, categoria: {id : 2, nome : "Esportes"}}]
        return $http.get('/pergunta').catch($rootScope.showError);
    }
    this.update = function(id, data){
        return $http.put('/pergunta/'+id, data).catch($rootScope.showError);
    }
    this.add = function(data){
        return $http.post('/pergunta/', data).catch($rootScope.showError);
    }
    this.remove = function(id){
        return $http.delete('/pergunta/'+id).catch($rootScope.showError);
    }
});

app.service('Alternativa', function($http, $rootScope){
    this.update = function(id, data){
        return $http.put('/alternativa/'+id, data).catch($rootScope.showError);
    }
    this.add = function(data){
        return $http.post('/alternativa/', data).catch($rootScope.showError);
    }
    this.remove = function(id){
        return $http.delete('/alternativa/'+id).catch($rootScope.showError);
    }
})
