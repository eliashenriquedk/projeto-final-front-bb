angular.module("hackaton-stefanini").controller("PerfilIncluirAlterarController", PerfilIncluirAlterarController);
PerfilIncluirAlterarController.$inject = [
    "$rootScope",
    "$scope",
    "$location",
    "$q",
    "$filter",
    "$routeParams",
    "HackatonStefaniniService"];

function PerfilIncluirAlterarController(
    $rootScope,
    $scope,
    $location,
    $q,
    $filter,
    $routeParams,
    HackatonStefaniniService) {

    /**ATRIBUTOS DA TELA */
    vm = this;

    vm.perfil = {
        id: null,
        nome: "",
        descricao: "",
        dataHoraInclusao: ""
    };
    vm.perfilDefault = {
        id: null,
        nome: "",
        descricao: "",
        dataHoraInclusao: ""
    };


    vm.perfilNovo = {
        nome: "",
        descricao: "",
        dataHoraInclusao: ""
    };


    /* vm.urlPessoa = "http://localhost:8080/treinamento/api/pessoas/"; */
    vm.urlPerfil = "http://localhost:8080/treinamento/api/perfils/";
    vm.isEdicao = false;




    /**METODOS DE INICIALIZACAO */
    vm.init = function () {

        vm.tituloTela = "Cadastrar Perfil";
        vm.acao = "Cadastrar";


        /* chamando função listar passando urlperfil*/
        vm.listar(vm.urlPerfil).then(
            function (response) {
                if (response !== undefined) {
                    vm.listaPerfil = response;
                    if ($routeParams.idPerfil) {
                        vm.tituloTela = "Editar Perfil";
                        vm.acao = "Editar";
                        vm.isEdicao = true;
                        
                        vm.recuperarObjetoPorIDURL($routeParams.idPerfil, vm.urlPerfil).then(
                            function (perfilRetorno) {
                                if (perfilRetorno !== undefined) {
                                    vm.perfil = perfilRetorno;
                                }
                            }
                        );
                    }
                }
            }
        );
    };

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

    /**metodo recupera objeto selecionado e preenche novamente os campos para edicao */
    vm.recuperarObjetoPorIDURL = function (id, url) {

        var deferred = $q.defer();
        HackatonStefaniniService.listarId(url + id).then(
            function (response) {
                if (response.data !== undefined)
                    deferred.resolve(response.data);
                else
                    deferred.resolve(vm.perfilDefault);
            }
        );
        return deferred.promise;
    };

        /* ------------------------------------------------------------------------------------------------------------------------------------- */
        /* INCLUIR */
        vm.incluir = function () {
            var objetoDados = angular.copy(vm.perfil);
            vm.perfil.dataHoraInclusao = new Date()


            objetoDados.dataHoraInclusao = new Date(
                vm.perfil.dataHoraInclusao.toISOString(0, 26)
            )

            if (vm.acao == "Cadastrar") {
                HackatonStefaniniService.incluir(vm.urlPerfil, objetoDados).then(
                    function (perfilRetorno) {
                        vm.retornarTelaListagem();
                        console.log("cadastrado teste123");
                    });
            } else if (vm.acao == "Editar") {
                vm.alterar(vm.urlPerfil, objetoDados).then(
                    function (perfilRetorno) {
                        vm.retornarTelaListagem();
                    });
            }
        };


        /* ------------------------------------------------------------------------------------------------------------------------------------- */
        /* Alterar perfil passando pra service 'alterar' */
        vm.alterar = function (url, objeto) {
            
            var deferred = $q.defer();
            var obj = JSON.stringify(objeto);
            HackatonStefaniniService.alterar(url, obj).then(
                function (response) {
                    if (response.status == 200) {
                        deferred.resolve(response.data);
                    }
                }
                );
                return deferred.promise;
            }



        /* ------------------------------------------------------------------------------------------------------------------------------------- */
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
        /**METODOS DE TELA */
        vm.cancelar = function () {
            vm.retornarTelaListagem();
        };

        vm.retornarTelaListagem = function () {
            $location.path("listarPerfils");
        };



        /* ------------------------------------------------------------------------------------------------------------------------------------- */
        /* função salvar novo perfil */
        vm.salvarPerfil = function () {
            vm.perfil.push(angular.copy(vm.perfilNovo))
            vm.perfilNovo = {
                nome: "",
                descricao: "",
                dataHoraInclusao: ""
            }
        };

    }

