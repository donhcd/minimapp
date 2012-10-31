require.config({
    paths: {
        jquery: '../lib/jquery-1.8.1',
        jquerymobile: '../lib/jquery.mobile-1.2.0',
        underscore: '../lib/underscore-amd',
        backbone: '../lib/backbone-amd',
        parse: '../lib/parse-1.1.5',
        handlebars: '../lib/handlebars-1.0.rc.1'
    }
});

require([
    'app'
], function(App) {
    App.initialize();
});

