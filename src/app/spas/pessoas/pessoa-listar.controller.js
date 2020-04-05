angular.module("hackaton-stefanini").controller("PessoaListarController", PessoaListarController);
PessoaListarController.$inject = ["$rootScope", "$scope", "$location",
    "$q", '$filter', '$routeParams', 'HackatonStefaniniService'];

function PessoaListarController($rootScope, $scope, $location,
    $q, $filter, $routeParams, HackatonStefaniniService) {
    vm = this;

    vm.quantidadePorPagina = 5;
    vm.ultimoIndex = 0;
    vm.paginaAtual = 0;

    vm.urlPaginada = "http://localhost:8080/treinamento/api/pessoas/paginacao";
    vm.urlPessoa = "http://localhost:8080/treinamento/api/pessoas/";
    vm.urlEndereco = "http://localhost:8080/treinamento/api/enderecos/";


    /* --------------------------------------------------------------------------------------------------------------------------------  */

    vm.init = function () {
        vm.paginaAtual = 1;
        vm.paginar();
    }

    /* --------------------------------------------------------------------------------------------------------------------------------  */
    // "http://localhost:8080/treinamento/api/pessoas/"indiceAtual=????????&quantidadePorPagina=???????? 
    vm.paginar = function () {
        HackatonStefaniniService.listar(
          vm.urlPaginada + "?indiceAtual=" + vm.ultimoIndex + "&quantidadePorPagina=" + vm.quantidadePorPagina
          ).then(
            function (responsePessoas) {
              // console.log(responsePessoas.data);
              vm.listaPessoasMostrar = responsePessoas.data.resultado;
              vm.quantidadeDePaginas = new Array(responsePessoas.data.totalPaginas);
              vm.totalResultados = responsePessoas.data.quantidadeDeResultados;
            }
          );
      }


    /* --------------------------------------------------------------------------------------------------------------------------------  */

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
    vm.editar = function (id) {
        if (id !== undefined)
            $location.path("EditarPessoas/" + id);
        else
            $location.path("cadastrarPessoa");
    }


    /* --------------------------------------------------------------------------------------------------------------------------------  */
    vm.remover = function (id) {

        var liberaExclusao = true;

        angular.forEach(vm.listaEndereco, function (value, key) {
            if (value.idPessoa === id)
                liberaExclusao = false;
        });

        if (liberaExclusao)
            HackatonStefaniniService.excluir(vm.urlPessoa + id).then(
                function (response) {
                    if(response.mensagem) {
                        alert(response.mensagem);
                    } else {
                        vm.init();
                    }
                }
            );
        else {
            alert("Pessoa com Endereço vinculado, exclusão não permitida");
        }
    }
}
