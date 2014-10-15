(function () {
    angular
        .module('gnap-example-app')
        .config(tooltipConfiguration)
        .config(urlRouterConfiguration)
        .config(translationConfiguration)
        .config(localeConfiguration)
        .config(titleConfiguration)
        .config(authConfiguration)
        .run(localeInitalization)
        .run(select2Initialization)
        .run(handleStateChangeError);

    var defaultPage = '/about';

    var supportedLanguages = [
        { name: 'nl', title: 'Nederlands', default: true },
        { name: 'fr', title: 'Français' },
        { name: 'en', title: 'English' }
    ];

    titleConfiguration.$inject = ['titleServiceProvider'];

    function titleConfiguration(titleServiceProvider) {
        titleServiceProvider.setDefaultTitle({ text: '' });
        titleServiceProvider.setSeparator('-');

        titleServiceProvider.setPrefix({ text: 'GNaP &raquo;' });
        titleServiceProvider.setSuffix({ text: '' });
    };

    tooltipConfiguration.$inject = ['$tooltipProvider'];

    function tooltipConfiguration($tooltipProvider) {
        $tooltipProvider.options({
            appendToBody: true
        });
    };

    urlRouterConfiguration.$inject = ['$urlRouterProvider'];

    function urlRouterConfiguration($urlRouterProvider) {
        $urlRouterProvider.otherwise(defaultPage);
    };

    translationConfiguration.$inject = ['$translateProvider'];

    function translationConfiguration($translateProvider) {
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '{part}/translations.{lang}.json', // if not local, e.g.: https://server/translations/{lang}/{part}
            loadFailureHandler: 'partialLoaderErrorHandler'
        });
    };

    localeConfiguration.$inject = ['tmhDynamicLocaleProvider'];

    function localeConfiguration(tmhDynamicLocaleProvider) {
        tmhDynamicLocaleProvider.localeLocationPattern('js/angular/i18n/angular-locale_{{locale}}.min.js');
    };

    select2Initialization.$inject = ['uiSelect2Config'];

    function select2Initialization(uiSelect2Config) {
        uiSelect2Config.allowClear = true;
        uiSelect2Config.shouldFocusInput = function () { return false; }
    };

    localeInitalization.$inject = ['localeService'];

    function localeInitalization(localeService) {
        localeService.initialize(supportedLanguages);
    };

    authConfiguration.$inject = ['$httpProvider'];

    function authConfiguration($httpProvider) {
        $httpProvider.interceptors.push('authenticationInterceptor');
    };

    handleStateChangeError.$inject = ['$rootScope', '$state', '$location', 'sessionService'];

    function handleStateChangeError($rootScope, $state, $location, sessionService) {
        $rootScope.$on('$stateChangeError',
            function (event, toState, toParams, fromState, fromParams, error) {
                
                // unauthorized
                if (error.status === 401) {
                    event.preventDefault();

                    // end the current session
                    sessionService.abandonSession();
                    
                    // go to login screen (only once!)
                    if (toState.name != "public.login") {
                        var redirectState = toState.name;
                        $location.url('/login').search({ redirect_state: redirectState });
                    }
                }

                // forbidden
                if (error.status === 403) {
                    event.preventDefault();
                    
                    // redirect to 'forbidden' error page
                    $state.go('main.error-403');
                }
            });
    }
})();