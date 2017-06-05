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
        console.error(e);
        $rootScope.stopLoading();
        $rootScope.flashMsg = {
            tipo: 'danger',
            texto: 'Erro na requisição: '+e.statusText
        }
    }
    $rootScope.loading = false;
    $rootScope.stopLoading = function(a){
        $rootScope.loading = false;
        return a;
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
    
    $scope.filtro = {
        texto: '',
        filtrar: function(){
            if($scope.filtro.texto.length > 0){
                var regex = new RegExp($scope.filtro.texto, 'i');
                $scope.perguntas = perguntas.filter((x) => regex.test(x.enunciado));
            }else{
                $scope.perguntas = perguntas;
            }
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
    $scope.botaoSalvar = 'Salvar';
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
            Alternativa.update(atual.id, novaAtual).then(function(r){
                if(r){
                    atual.certa = false;
                }
            });
        }
        var data ={
            certa: !a.certa,
            texto: a.texto,
            perguntaId: perguntaId
        };
        Alternativa.update(a.id, data).then(function(r){
            if(r){
                a.certa = !a.certa;
            }
        });
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
        $rootScope.loading = true;
        return $http.get('/categoria/').then($rootScope.stopLoading).catch($rootScope.showError);
    }
});

app.service('Pergunta', function($http, $rootScope){
    this.get = function(id){
        $rootScope.loading = true;
        return $http.get('/pergunta/'+id).then($rootScope.stopLoading).catch($rootScope.showError);
    }
    this.all = function(){
        $rootScope.loading = true;
        return $http.get('/pergunta').then($rootScope.stopLoading).catch($rootScope.showError);
    }
    this.update = function(id, data){
        $rootScope.loading = true;
        return $http.put('/pergunta/'+id, data).then($rootScope.stopLoading).catch($rootScope.showError);
    }
    this.add = function(data){
        $rootScope.loading = true;
        return $http.post('/pergunta/', data).then($rootScope.stopLoading).catch($rootScope.showError);
    }
    this.remove = function(id){
        $rootScope.loading = true;
        return $http.delete('/pergunta/'+id).then($rootScope.stopLoading).catch($rootScope.showError);
    }
});

app.service('Alternativa', function($http, $rootScope){
    this.update = function(id, data){
        $rootScope.loading = true;
        return $http.put('/alternativa/'+id, data).then($rootScope.stopLoading).catch($rootScope.showError);
    }
    this.add = function(data){
        $rootScope.loading = true;
        return $http.post('/alternativa/', data).then($rootScope.stopLoading).catch($rootScope.showError);
    }
    this.remove = function(id){
        $rootScope.loading = true;
        return $http.delete('/alternativa/'+id).then($rootScope.stopLoading).catch($rootScope.showError);
    }
})
