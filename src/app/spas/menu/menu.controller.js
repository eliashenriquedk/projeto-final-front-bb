angular.module("hackaton-stefanini").controller("MenuController", MenuController);
MenuController.$inject = ["$rootScope", "$scope", "$location",
    "$q", '$filter', '$routeParams', 'HackatonStefaniniService'];

function MenuController($rootScope, $scope, $location,
    $q, $filter, $routeParams, HackatonStefaniniService) {
    vm = this;

    vm.chamarPagina = function (pagina) {

        switch (pagina) {
            case 'cadastrarPessoa':
                $location.path("cadastrarPessoa");
                break;

            case 'EditarPessoa':
                $location.path("EditarPessoas");
                break;

            case 'listarPessoa':
                $location.path("listarPessoas");
                break;

            case 'cadastrarPerfils':
                $location.path("cadastrarPerfils");
                break;

            case 'EditarPerfils':
                $location.path("editarPerfils");
                break;
                
            case 'listarPerfils':
                $location.path("listarPerfils");
                break;

            case 'cadastrarEnderecos':
                $location.path("cadastrarEnderecos");
                break;

            case 'editarEnderecos':
                $location.path("editarEnderecos");
                break;
                
            case 'listarEnderecos':
                $location.path("listarEnderecos");
                break;

            case 'home':
                $location.path("/");
                break;

            default:
                $location.path("/");
                break;
        }

        //vm.executaConsultaModelo();
    };

    vm.executaConsultaModelo = function () {
        var dados = {

        };

        HackatonStefaniniService.teste(dados).then(
            function (response) {
                if (response.data !== undefined)
                    console.log(response.data);
            }
        );
    };
}
