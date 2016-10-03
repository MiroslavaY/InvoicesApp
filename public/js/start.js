(function () {
    "use strict";


    var paths= {

        customersPath:'/api/customers',
        oneCustomerPath:'/api/customers/:customer_id',
        productsPath: '/api/products',
        oneProductPath: '/api/products/:product_id',
        invoicesPath: '/api/invoices',
        oneInvoicePath:'/api/invoices/:invoice_id',
        invoiceItemPath:'/api/invoices/:invoice_id/items/:id',
        oneInvoiceItemPath:'/api/invoices/:invoice_id/items/:id'

    };

    var myApp = angular.module('invoicesApp', ['ngResource']);

    myApp.config(['$resourceProvider', function($resourceProvider) {

        $resourceProvider.defaults.stripTrailingSlashes = false;

    }]);

    myApp.factory("Products", ['$resource', function ($resource) {
        return $resource(paths.oneProductPath,{product_id:'@id'},

            {
                'get':    {method:'GET'},
                'save':   {method:'POST'},
                'query':  {method:'GET', isArray:true},
                'remove': {method:'DELETE'},
                'delete': {method:'DELETE'}
            }


        );
    }]);

    myApp.controller('invoicesCtrl', function ($scope, Products) {


        $scope.products = Products.query();



        $scope.addProduct = function () {
            var someth = {name :"CustomProd", price: 20};
            Products.save(someth, function() {
                console.log('saved');
                $scope.products.push(someth);

            });


        };
        $scope.deleteProduct = function(someId, index){

            Products.delete({ product_id: someId }, function() {
                console.log("deleted");
                $scope.products.splice(index, 1);

            })
        };

    });

    myApp.controller('modalController', function ($scope) {

        $scope.modalShown = false;
        $scope.toggleModal = function() {
            $scope.modalShown = !$scope.modalShown;
        };

    });


    //Directives

    myApp.directive('modalDialog', function() {

        return {
            restrict: 'E',
            scope: {
                show: '='
            },
            templateUrl: '/js/templates/modalTemplate.html',
            replace: true,
            transclude: true,
            link: function(scope, element, attrs) {
                scope.dialogStyle = {};

                if (attrs.width) {
                    scope.dialogStyle.width = attrs.width;
                }

                scope.hideModal = function() {
                    scope.show = false;
                };
            },

        };
    });

}());


