(function () {
    'use strict';

    angular
        .module('pmc')
        .controller('CompanyNameCtrl', CompanyNameCtrl);

    CompanyNameCtrl.$inject = ['$scope', '$log', '$cookies', '$timeout', 'paymentService'];

    function CompanyNameCtrl($scope, $log, $cookies, $timeout, paymentService) {
        $log.info('Company Name controller loaded');
        var self = this;

        self.company = {
            id: 0,
            name: 'undefined'
        };

        if (typeof $cookies.get('company') !== 'undefined') {
            self.company = angular.fromJson($cookies.get('company'));
        }
        self.name4validation = self.company.name;

        self.$name = angular.element('.subscr_comp_name .comp_name');
        self.isEdit = false;
        reset();

        function reset() {
            self.$name.text(self.company.name);
            if ($scope.form_comp_name)
                $scope.form_comp_name.$setPristine();
        }

        function save(newCompanyName) {
            var token = $cookies.get('token');
            var organizationId = self.company.id;
            if (!token || !organizationId) return; // log out
            var data = {
                name: newCompanyName
            };
            paymentService.editOrganization(token, organizationId, data).then(function (response) {
                self.company.name = response.data.data.name;
                $cookies.put('company', angular.toJson(self.company));
                self.toggleState();
            });
        }

        self.toggleState = function () {
            if (self.isEdit) reset();

            self.isEdit = !self.isEdit;
        };

        self.validate = function () {
            var nameForm = $scope.form_comp_name;
            if (typeof nameForm === 'undefined') return;

            nameForm.$setDirty();
            self.name4validation = self.$name.text();

            $timeout(function () {
                if (nameForm.$valid && self.name4validation)
                    save(self.name4validation);
            }, 0);
        };
    }
})();
