define([
    'models/map',
    'collections/layers',
    'collections/entityset',
    'views/login',
    'views/signup',
    'views/settings',
    'views/entityinfo',
    'views/map',
    'views/filterlayers',
    'views/addentity',
    'views/explore'
], function(
        Map,
        Layers,
        EntitySet,
        LoginView,
        SignupView,
        SettingsView,
        EntityInfoView,
        MapView,
        FilterLayersView,
        AddEntityView,
        ExploreView
    ) {
    var AppRouter = Backbone.Router.extend({

        routes: {
            '': 'home',
            'logout': 'logout',
            'settings': 'settings',
            'layers': 'layers',
            'add_entity': 'add_entity',
            'sign_up': 'sign_up',
            'entity_info': 'entity_info',
            'explore': 'explore'
        },

        initialize: function() {
            Parse.initialize(
                'Q6TCdTd0MUgW5M3GYkuTwTRYiOBQZJIsClO8X6U5',
                '6nvtUl1BW2fJKDfs3XPS3DDDdR1qBDWFsI88a0cK');

            // Handle back button throughout the application
            // $('.back').live('click', function(event) {
            //     window.history.back();
            //     return false;
            // });

            var layers = new Layers();
            var map = new Map({layers: layers});
            var addedEntities = new EntitySet();
            var entitiesToDisplay = new EntitySet();

            // Instantiate all the views
            this.loginView = new LoginView();
            this.signupView = new SignupView();
            this.settingsView = new SettingsView();
            this.entityInfoView = new EntityInfoView({
                collection: entitiesToDisplay
            });
            this.mapView = new MapView({
                model: map,
                addedEntities: addedEntities,
                entitiesToDisplay: entitiesToDisplay
            });
            this.filterLayersView = new FilterLayersView({
                collection: layers
            });
            this.addEntityView = new AddEntityView({
                collection: addedEntities
            });
            this.exploreView = new ExploreView();

            this.firstPage = true;
        },

        home: function() {
            console.log('#home');
            var self = this;
            if (Parse.User.current()) {
                console.log('you are logged in');
                this.changePage(this.mapView);

            } else {
                console.log('you are not logged in, so log in');
                this.changePage(this.loginView);
            }
        },

        logout: function() {
            console.log('#logout');
            Parse.User.logOut();
            this.changePage(this.loginView);
        },

        settings: function() {
            console.log('#settings');
            this.changePage(this.settingsView);
        },

        layers: function() {
            console.log('#layers');
            this.changePage(this.filterLayersView);
        },

        add_entity: function() {
            console.log('#add_entity');
            this.changePage(this.addEntityView);
        },

        sign_up : function() {
            console.log('#sign_up');
            this.changePage(this.signupView);
        },

        entity_info : function() {
            console.log('#entity_info');
            if (this.entityInfoView.model) {
                this.changePage(this.entityInfoView);
            } else {
                this.navigate('', {trigger: true});
            }
        },
        explore : function() {
            console.log('#explore');
            this.changePage(this.exploreView);
        },

        changePage: function(page) {
            page.$el.attr('data-role', 'page');
            page.render();
            $('body').append(page.$el);
            this.currentPage = page;
            var transition = $.mobile.defaultPageTransition;
            // We don't want to slide the first page
            if (this.firstPage) {
                transition = 'none';
                this.firstPage = false;
            }
            $.mobile.changePage(page.$el, {
                changeHash:false,
                transition: transition
            });
        }

    });

    var initialize = function () {
        console.log('document ready');
        app = new AppRouter();
        $(document).bind('goto', function(e, uri) {
            e.preventDefault();
            app.navigate(uri, {trigger: true});
        });
        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});
