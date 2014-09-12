(function () {
    angular
        .module('gnap-example-app')
        .controller('TypographyController', TypographyController);

    TypographyController.$inject = ['sidebarService', 'breadcrumbsService'];

    function TypographyController(sidebarService, breadcrumbsService) {

        // configure breadcrumbs
        breadcrumbsService.setBreadcrumbs([
            {
                title: 'Home',
                url: '/'
            },
            {
                title: 'Typography'
            }
        ]);

        sidebarService.setActive('typography');
    };
})();