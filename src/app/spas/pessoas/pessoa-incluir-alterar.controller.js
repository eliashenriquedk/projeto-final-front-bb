angular.module("hackaton-stefanini").controller("PessoaIncluirAlterarController", PessoaIncluirAlterarController);
PessoaIncluirAlterarController.$inject = [
    "$rootScope",
    "$scope",
    "$location",
    "$q",
    "$filter",
    "$routeParams",
    "HackatonStefaniniService"];

function PessoaIncluirAlterarController(
    $rootScope,
    $scope,
    $location,
    $q,
    $filter,
    $routeParams,
    HackatonStefaniniService) {

    /**ATRIBUTOS DA TELA */
    const vm = this;
    vm.isEdicao = false;
    vm.erroCep = false;

    vm.pessoa = {
        id: null,
        nome: "",
        email: "",
        dataNascimento: null,
        enderecos: [],
        perfils: [],
        situacao: false
    };
    vm.enderecoDefault = {
        id: null,
        idPessoa: null,
        cep: "",
        uf: "",
        localidade: "",
        bairro: "",
        logradouro: "",
        complemento: ""
    };

    vm.enderecoNovo = {
        cep: null,
        uf: null,
        localidade: null,
        bairro: null,
        logradouro: null,
        complemento: null
    };

    vm.urlEndereco = "http://localhost:8080/treinamento/api/enderecos/";
    vm.urlPerfil = "http://localhost:8080/treinamento/api/perfils/";
    vm.urlPessoa = "http://localhost:8080/treinamento/api/pessoas/";



    /**METODOS DE INICIALIZACAO */
    vm.init = function () {

        vm.tituloTela = "Cadastrar Pessoa";
        vm.acao = "Cadastrar";


        /**Recuperar a lista de perfil */
        vm.listar(vm.urlPerfil).then(
            function (response) {
                if (response !== undefined) {
                    vm.listaPerfil = response;
                    if ($routeParams.idPessoa) {
                        vm.tituloTela = "Editar Pessoa";
                        vm.acao = "Editar";
                        vm.isEdicao = true;

                        vm.recuperarObjetoPorIDURL($routeParams.idPessoa, vm.urlPessoa).then(
                            function (pessoaRetorno) {
                                if (pessoaRetorno !== undefined) {
                                    vm.pessoa = pessoaRetorno;
                                    vm.pessoa.dataNascimento = vm.formataDataTela(pessoaRetorno.dataNascimento);
                                    vm.perfil = vm.pessoa.perfils;
                                    console.log(pessoaRetorno);
                                    
                                    
                                }
                            }
                        );
                    }
                }
            }
        );
    };

    /**METODOS DE TELA */
    vm.cancelar = function () {
        vm.retornarTelaListagem();
    };

    vm.retornarTelaListagem = function () {
        $location.path("/");
    };

    vm.abrirModal = function (endereco) {
        vm.enderecoNovo = angular.copy(endereco)
        $("#modalEndereco").modal();
    };

    vm.limparTela = function () {
        $("#modalEndereco").modal("toggle");
        vm.endereco = undefined;
    };


    /* ------------------------------------------------------------------------------------------------------------------------------------- */
    /* cadastrar/editar */
    vm.incluir = function () {

        var objetoDados = angular.copy(vm.pessoa);
        objetoDados.dataNascimento = vm.formataDataJava(vm.pessoa.dataNascimento);
        vm.enviarFile();
        objetoDados.base64Imagem = vm.base64Imagem;
        var listaEndereco = [];
        angular.forEach(objetoDados.enderecos, function (value, key) {
            if (value.complemento.length > 0) {
                value.idPessoa = objetoDados.id;
                listaEndereco.push(angular.copy(value));
            }
        });

        objetoDados.enderecos = listaEndereco;
        if (vm.perfil !== null){

            var isNovoPerfil = true;
            
            angular.forEach(objetoDados.perfils, function (value, key) {
                if (value.id === vm.perfil.id) {
                    isNovoPerfil = false;
                }
            });
            if (isNovoPerfil)
                objetoDados.perfils = vm.perfil;
        }
        if (vm.acao == "Cadastrar") {

            vm.salvar(vm.urlPessoa, objetoDados).then(
                function (pessoaRetorno) {
                    vm.retornarTelaListagem();
                });
        } else if (vm.acao == "Editar") {
            vm.alterar(vm.urlPessoa, objetoDados).then(
                function (pessoaRetorno) {
                    vm.retornarTelaListagem();
                });
        }
    };


    /* ------------------------------------------------------------------------------------------------------------------------------------- */
    /**METODOS DE SERVICO */
    vm.recuperarObjetoPorIDURL = function (id, url) {

        var deferred = $q.defer();
        HackatonStefaniniService.listarId(url + id).then(
            function (response) {
                if (response.data !== undefined)
                    deferred.resolve(response.data);
                else
                    deferred.resolve(vm.enderecoDefault);
            }
        );
        return deferred.promise;
    };


    /* ------------------------------------------------------------------------------------------------------------------------------------- */
    /* Listagem de obj */
    vm.listar = function (url) {

        var deferred = $q.defer();
        HackatonStefaniniService.listar(url).then(
            function (response) {
                if (response.data !== undefined) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }


    /* ------------------------------------------------------------------------------------------------------------------------------------- */
    /* salvar  */
    vm.salvar = function (url, objeto) {

        var deferred = $q.defer();
        var obj = JSON.stringify(objeto);
        HackatonStefaniniService.incluir(url, obj).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                } else {
                    vm.pessoa.dataNascimento = vm.formataDataTela(vm.pessoa.dataNascimento)
                }
                if (vm.urlEndereco === url) {
                    vm.init();
                }
            }
        );
        return deferred.promise;
    }


    /* ------------------------------------------------------------------------------------------------------------------------------------- */
    /* chamando alterar da service */
    vm.alterar = function (url, objeto) {

        var deferred = $q.defer();
        var obj = JSON.stringify(objeto);
        HackatonStefaniniService.alterar(url, obj).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                }
                if (vm.urlEndereco === url) {
                    vm.init();
                }
            }
        );
        return deferred.promise;
    }


    /* ------------------------------------------------------------------------------------------------------------------------------------- */
    /* chamando excluir da service */
    vm.excluir = function (url, objeto) {

        var deferred = $q.defer();
        HackatonStefaniniService.excluir(url).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }


    /**METODOS AUXILIARES */
    vm.formataDataJava = function (data) {
        var dia = data.slice(0, 2);
        var mes = data.slice(2, 4);
        var ano = data.slice(4, 8);

        return ano + "-" + mes + "-" + dia;
    };

    vm.formataDataTela = function (data) {
        var ano = data.slice(0, 4);
        var mes = data.slice(5, 7);
        var dia = data.slice(8, 10);

        return dia + mes + ano;
    };


    /* ------------------------------------------------------------------------------------------------------------------------------------- */
    /* listas de uf  */
    vm.listaUF = [
        { "id": "RO", "desc": "RO" },
        { "id": "AC", "desc": "AC" },
        { "id": "AM", "desc": "AM" },
        { "id": "RR", "desc": "RR" },
        { "id": "PA", "desc": "PA" },
        { "id": "AP", "desc": "AP" },
        { "id": "TO", "desc": "TO" },
        { "id": "MA", "desc": "MA" },
        { "id": "PI", "desc": "PI" },
        { "id": "CE", "desc": "CE" },
        { "id": "RN", "desc": "RN" },
        { "id": "PB", "desc": "PB" },
        { "id": "PE", "desc": "PE" },
        { "id": "AL", "desc": "AL" },
        { "id": "SE", "desc": "SE" },
        { "id": "BA", "desc": "BA" },
        { "id": "MG", "desc": "MG" },
        { "id": "ES", "desc": "ES" },
        { "id": "RJ", "desc": "RJ" },
        { "id": "SP", "desc": "SP" },
        { "id": "PR", "desc": "PR" },
        { "id": "SC", "desc": "SC" },
        { "id": "RS", "desc": "RS" },
        { "id": "MS", "desc": "MS" },
        { "id": "MT", "desc": "MT" },
        { "id": "GO", "desc": "GO" },
        { "id": "DF", "desc": "DF" }
    ];


    /* ------------------------------------------------------------------------------------------------------------------------------------- */
    /* Salvar/alterar  endereço */
    vm.salvarEndereco = function () {
        if(vm.enderecoNovo.id){
            vm.alterar(vm.urlEndereco, angular.copy(vm.enderecoNovo));
        } else {
            
            if(vm.isEdicao) {
                vm.enderecoNovo.idPessoa = vm.pessoa.id
                vm.salvar(vm.urlEndereco, angular.copy(vm.enderecoNovo));
            } else {
                vm.pessoa.enderecos.push(angular.copy(vm.enderecoNovo));
            }
        }
        
        vm.enderecoNovo = {
            cep: null,
            uf: null,
            localidade: null,
            bairro: null,
            logradouro: null,
            complemento: null
        };
    };
    /* ------------------------------------------------------------------------------------------------------------------------------------- */
    /* remover endereco */    
    vm.removerEndereco = function (objeto, tipo, index) {
        if (objeto.id){
            var url = vm.urlPessoa + objeto.id;
            if (tipo === "ENDERECO")
                url = vm.urlEndereco + objeto.id;
    
            vm.excluir(url).then(
                function (ojetoRetorno) {
                    vm.init()
                    alert("Endereço removido com sucesso!")
                }); 
        } else {
            vm.pessoa.enderecos.splice(index, 1)
        }      
    };


    /* ------------------------------------------------------------------------------------------------------------------------------------- */
    /* passar cep para o buscarCep da service  */
    vm.buscarCep = function() {
        if(vm.enderecoNovo.cep.length < 8){
            vm.erroCep = true;
        } else {
            HackatonStefaniniService.buscarCep(vm.enderecoNovo.cep).then(
                function (responseCep) {
                        if(!responseCep.data.erro) {
                            vm.enderecoNovo.uf = responseCep.data.uf;
                            vm.enderecoNovo.localidade = responseCep.data.localidade;
                            vm.enderecoNovo.bairro = responseCep.data.bairro;
                            vm.enderecoNovo.logradouro = responseCep.data.logradouro;
                            vm.enderecoNovo.complemento = responseCep.data.complemento;
                            vm.erroCep = false;
                        } else {
                            vm.erroCep = true;
                        }
                }
            )
        }
    }


    /* ------------------------------------------------------------------------------------------------------------------------------------- */
    /* variavel base64Imagem para ser enviada ao back  */    
    vm.enviarFile = function(){
        vm.base64Imagem = angular.copy($("#base64Imagem").attr("src"));
        // if(!vm.base64Imagem) {
        //     vm.base64Imagem = angular.copy($("#base64Imagem").attr("ng-src"));
        // }
    }
    /* ------------------------------------------------------------------------------------------------------------------------------------- */
    /* file  */   
      vm.setarPreview = function () {
        var preview = document.querySelectorAll('img').item(0);
        var file = document.querySelector('input[type=file').files[0];
        var reader = new FileReader();
    
        reader.onloadend = function () {
            preview.src = reader.result; // Carrega a imagem em base64
        };
    
        if (file) {
            reader.readAsDataURL(file);
        } else {
            preview.src = "";
        }
        vm.enviarFile();
      }

}
