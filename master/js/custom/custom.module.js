(function() {
    'use strict';

    angular
        .module('custom', [
            // request the the entire framework
            'admin',
            // or just modules
            'app.core',
            'app.sidebar'
            /*...*/
        ]);
})();