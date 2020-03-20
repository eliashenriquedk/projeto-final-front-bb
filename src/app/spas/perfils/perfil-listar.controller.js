angular.module("hackaton-stefanini").controller("PerfilListarController", PerfilListarController);
PerfilListarController.$inject = ["$rootScope", "$scope", "$location",
    "$q", '$filter', '$routeParams', 'HackatonStefaniniService'];

function PerfilListarController($rootScope, $scope, $location,
    $q, $filter, $routeParams, HackatonStefaniniService) {
    
    vm = this;

    vm.qdePorPagina = 5;
    vm.ultimoIndex = 0;
    vm.contador = 0;

    /* conforme vem do back */
    vm.urlPerfil = "http://localhost:8080/treinamento/api/perfils/";

    vm.init = function () {
        HackatonStefaniniService.listar(vm.urlPerfil).then(
            function (responsePerfils) {
                if (responsePerfils.data !== undefined) {
                    console.log(responsePerfils)
                    vm.listaPerfils = responsePerfils.data;
                }
                vm.listaPerfilsMostrar = [];
                var max = vm.listaPerfils.length > vm.qdePorPagina ? vm.qdePorPagina : vm.listaPerfils.length;

                vm.qdePaginacao = new Array(vm.listaPerfils.length % vm.qdePorPagina === 0 ? vm.listaPerfils.length / vm.qdePorPagina : parseInt(vm.listaPerfils.length / vm.qdePorPagina) + 1);
                vm.currentPage = 1;
                for (var count = 0; count < max; count++) {
                    vm.listaPerfilsMostrar.push(vm.listaPerfils[count]);
                    vm.ultimoIndex++;
                }

                vm.listaPerfilsMostrar.sort(function (a, b) {
                    return a.id - b.id;
                });
            }
        );
    };

    vm.atualizarPaginanacao = function (index) {

        if (index >= vm.currentPage)
            vm.avancarPaginanacao(index);
        else
            vm.retrocederPaginanacao(index);
    };

    vm.avancarPaginanacao = function (index) {
        
        vm.listaPerfilsMostrar = [];
        vm.currentPage++;

        var idx = angular.copy(vm.ultimoIndex);
        var cont = vm.listaPerfils.length - vm.qdePorPagina;
        for (var count = cont > vm.qdePorPagina ? vm.qdePorPagina : cont; count > 0; count--) {
            vm.listaPerfilsMostrar.push(vm.listaPerfils[idx++]);
            vm.ultimoIndex++;
            vm.contador++;
        }
        vm.listaPerfilsMostrar.sort(function (a, b) {
            return a.id - b.id;
        });
    };

    vm.retrocederPaginanacao = function (index) {
        
        vm.listaPerfilsMostrar = [];

        vm.currentPage--;
        var idx = vm.contador - 1;
        vm.ultimoIndex = idx + 1;
        for (var count = vm.qdePorPagina; count > 0; count--) {
            vm.listaPerfilsMostrar.push(vm.listaPerfils[idx--]);
            vm.contador--;
        }
        vm.listaPerfilsMostrar.sort(function (a, b) {
            return a.id - b.id;
        });
    };

    vm.retornarTelaListagem = function () {
        $location.path("listarPerfils");
    }


    /* editar perfil selecionado da lista */
    vm.editar = function (id) {
        if (id !== undefined)
            $location.path("editarPerfils/" + id);
        else
            $location.path("editarPerfils");
    }


    /* remover perfil selecionado da lista */
    vm.remover = function (id) {
        HackatonStefaniniService.excluir(vm.urlPerfil + id).then(
            function (response) {
                console.log(response)
                if(response.mensagem){
                    alert(response.mensagem + " porque o perfil está vinculado a uma pessoa")
                } else {
                    vm.init()
                }
            }
        );
        
    }

}

