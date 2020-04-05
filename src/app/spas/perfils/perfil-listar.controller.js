angular.module("hackaton-stefanini").controller("PerfilListarController", PerfilListarController);
PerfilListarController.$inject = ["$rootScope", "$scope", "$location",
    "$q", '$filter', '$routeParams', 'HackatonStefaniniService'];

function PerfilListarController($rootScope, $scope, $location,
    $q, $filter, $routeParams, HackatonStefaniniService) {
    
    vm = this;

    vm.quantidadePorPagina = 5;
    vm.ultimoIndex = 0;
    vm.paginaAtual = 0;


    vm.urlPaginacaoPerfil = "http://localhost:8080/treinamento/api/perfils/paginacaoPerfil";
    vm.urlPerfil = "http://localhost:8080/treinamento/api/perfils/";

    /* --------------------------------------------------------------------------------------------------------------------------------  */

    vm.init = function () {
        vm.paginaAtual = 1;
        vm.paginar();
    }


    /* --------------------------------------------------------------------------------------------------------------------------------  */
    // http://localhost:8080/treinamento/api/perfils/paginacaoPerfil?indiceAtual=???????&quantidadePorPagina=???????

    vm.paginar = function () {
        HackatonStefaniniService.listar(
          vm.urlPaginacaoPerfil + "?indiceAtual=" + vm.ultimoIndex + "&quantidadePorPagina=" + vm.quantidadePorPagina
          ).then(
            function (responsePerfils) {
                // console.log(responsePerfils);
              vm.listaPerfilsMostrar = responsePerfils.data.resultado;
              vm.quantidadeDePaginas = new Array(responsePerfils.data.totalPaginas);
              vm.totalResultados = responsePerfils.data.quantidadeDeResultados;
            }
          );
      }


    /* --------------------------------------------------------------------------------------------------------------------------------  */
    //   Atualizar Paginação
    vm.atualizarPaginacao = function (index) {
        vm.paginaAtual = index + 1;
        vm.ultimoIndex = index * vm.quantidadePorPagina;
        vm.paginar();
      };
    
      vm.avancarPaginacao = function () {
        vm.atualizarPaginacao(vm.paginaAtual);
      };
    
      vm.retrocederPaginacao = function () {
        if(vm.paginaAtual > 1) {
          vm.atualizarPaginacao(vm.paginaAtual - 2);
        }
      };



    /* --------------------------------------------------------------------------------------------------------------------------------  */
    /* editar perfil selecionado da lista por id */
    vm.editar = function (id) {
        if (id !== undefined)
            $location.path("editarPerfils/" + id);
        else
            $location.path("cadastrarPerfils");
    }

    /* --------------------------------------------------------------------------------------------------------------------------------  */
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

