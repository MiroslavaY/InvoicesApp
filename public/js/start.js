(function () {
    "use strict";


    var paths = {

        customersPath: '/api/customers',
        oneCustomerPath: '/api/customers/:customer_id',
        productsPath: '/api/products',
        oneProductPath: '/api/products/:product_id',
        invoicesPath: '/api/invoices',
        oneInvoicePath: '/api/invoices/:invoice_id',
        invoiceItemPath: '/api/invoices/:invoice_id/items/:id',
        oneInvoiceItemPath: '/api/invoices/:invoice_id/items/:id'

    };

    var myApp = angular.module('invoicesApp', ['ngResource']);

    myApp.config(['$resourceProvider', function ($resourceProvider) {

        $resourceProvider.defaults.stripTrailingSlashes = false;

    }]);

    myApp.factory("Products", function ($resource) {

        return $resource(paths.oneProductPath, {product_id: '@id'},

            {
                'get': {method: 'GET'},
                'save': {method: 'POST'},
                'query': {method: 'GET', isArray: true},
                'update': {method: 'PUT'},
                'delete': {method: 'DELETE'}
            }
        );
    });

    myApp.controller('invoicesCtrl', function ($scope, $rootScope, Products) {


        $scope.products = Products.query();


        $scope.modalShown = false;
        $scope.toggleModal = function () {
            $scope.modalShown = !$scope.modalShown;
        };

        $rootScope.updateProduct = function (data) {
            $rootScope.data = data;
            $rootScope.upd = true;
            $scope.modalShown = true;

        };

        $rootScope.addProduct = function (name, prodPrice) {
            var oneProduct = {name: name, price: prodPrice};
            Products.save(oneProduct, function () {
                console.log('saved');
                $scope.products.push(oneProduct);

            });


        };
        $scope.deleteProduct = function (someId, index) {

            Products.delete({product_id: someId}, function () {
                console.log("deleted");
                $scope.products.splice(index, 1);

            })
        };


    });



    //Directives

    myApp.directive('modalDialog', function ($rootScope, Products) {


        return {
            restrict: 'E',
            scope: {
                show: '='
            },
            templateUrl: '/js/templates/modalTemplate.html',
            replace: true,
            // transclude: true,
            link: function (scope, element, attrs) {

                //PROBLEMES HERE
                scope.attr = {
                    name: $rootScope.data.name,
                    price: $rootScope.data.price
                };


                scope.dialogStyle = {};

                if (attrs.width) {
                    scope.dialogStyle.width = attrs.width;
                }

                scope.hideModal = function () {
                    this.show = false;
                    $rootScope.data = null;
                };

                scope.saveHandler = function (name, price) {
                    if ($rootScope.data) {

                        Products.update({product_id: $rootScope.data.id}, {name: name, price: price}, function () {
                                console.log('updated');
                            }
                        );
                    }
                    else {
                        $rootScope.addProduct(name, price);
                    }

                    this.hideModal();
                };
            },

        };
    });

}());


