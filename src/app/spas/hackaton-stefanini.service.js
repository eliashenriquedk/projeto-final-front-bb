(function () {"use strict";
    angular.module("hackaton-stefanini").factory("HackatonStefaniniService", HackatonStefaniniService);
        HackatonStefaniniService.$inject = ["$http"];
        function HackatonStefaniniService($http) {
            var service = {
                listar: function (url) {
                    return $http.get(url).then(tratarResposta, tratarErro);
                },
                listarId: function (url) {
                    return $http.get(url).then(tratarResposta, tratarErro);
                },
                excluir: function (url) {
                    return $http.delete(url).then(tratarResposta, tratarErro);
                },
                alterar: function (url, data) {
                    return $http.put(url, data).then(tratarResposta, tratarErro);
                },
                incluir: function (url, data) {
                    return $http.post(url, data).then(tratarResposta, tratarErro);
                },
                buscarCep: function (cep) {
                    return $http.get("http://localhost:8080/treinamento/api/viaCep/" + cep).then(tratarResposta, tratarErro);
                }
            };

            /**METODOS TRATAMENTO ERROS */
            function tratarResposta(response) {
                return response;
            }
            function tratarErro(error) {
                console.log(error.data)
                return error.data;
            }
            return service;
        }
})(angular);
