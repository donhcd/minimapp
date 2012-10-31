require.config({
    paths: {
        handlebars: '../lib/handlebars-amd'
    }
});


require(['app'], function(App) {
    App.initialize();
});

