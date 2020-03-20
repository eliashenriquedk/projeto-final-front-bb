(function(angular){
    "use strict";

    angular.module('hackaton-stefanini').config(function ($routeProvider) {
        $routeProvider

            /** Rota para Home */
            .when('/', {
                templateUrl: 'app/spas/homePage/template/home.tpl.html',
                controller: 'HomeController as vm'
            })
            /** Rotas para Pessoas */
            .when('/listarPessoas', {
                templateUrl: 'app/spas/pessoas/template/pessoa-listar.tpl.html',
                controller: 'PessoaListarController as vm'
            })
            .when('/cadastrarPessoa', {
                templateUrl: 'app/spas/pessoas/template/pessoa-incluir-alterar.tpl.html',
                controller: 'PessoaIncluirAlterarController as vm'
            })
            .when('/EditarPessoas/:idPessoa', {
                templateUrl: 'app/spas/pessoas/template/pessoa-incluir-alterar.tpl.html',
                controller: 'PessoaIncluirAlterarController as vm'
            })
            
            
            /** Rotas para Perfis */
            .when('/listarPerfils', {
                templateUrl: 'app/spas/perfils/template/perfil-listar.tpl.html',
                controller: 'PerfilListarController as vm'
            })
            .when('/cadastrarPerfils', {
                templateUrl: 'app/spas/perfils/template/perfil-incluir-alterar.tpl.html',
                controller: 'PerfilIncluirAlterarController as vm'
            })
            .when('/editarPerfils/:idPerfil', {
                templateUrl: 'app/spas/perfils/template/perfil-incluir-alterar.tpl.html',
                controller: 'PerfilIncluirAlterarController as vm'
            })


            /** Rotas para Endereços */
            .when('/listarEnderecos', {
                templateUrl: 'app/spas/enderecos/template/endereco-listar.tpl.html',
                controller: 'EnderecoListarController as vm'
            })
            .when('/cadastrarEnderecos', {
                templateUrl: 'app/spas/enderecos/template/endereco-incluir-alterar.tpl.html',
                controller: 'EnderecoIncluirAlterarController as vm'
            })
            .when('/editarEnderecos/:idEndereco', {
                templateUrl: 'app/spas/enderecos/template/endereco-incluir-alterar.tpl.html',
                controller: 'EnderecoIncluirAlterarController as vm'
            })


            .otherwise({
                templateUrl: 'index_ERROR.html'
            });
    });

}(angular));

