window.SignupView = Parse.View.extend({

    template: Handlebars.compile(this.$('#signup').html()),

    events: {
        'submit form.signup-form': 'signUp'
    },

    initialize: function() {
        console.log('initialized SignupView');
        _.bindAll(this, 'signUp');
    },

    signUp: function(e) {
        var self = this;
        var username = this.$('#signup-username').val();
        var password = this.$('#signup-password').val();
        console.log('attempting to sign up with user: ' + username +
                    ' pass: ' + password);
        Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
            success: function(user) {
                $(document).trigger('goto', '');
                console.log('sign up succeded!');
                // REVIEW(donaldh) not sure if this stuff is necessary but
                // whatever
                self.undelegateEvents();
            },
            error: function(user, error) {
                this.$('.signup-form .error').html(error.message).show();
                this.$('.signup-form button').removeAttr('disabled');
                console.log('sign up Failed...');
            }
        });
        //this.$('.signup-form button').attr('disabled', 'disabled');
        return false;
    },

    render: function() {
        this.$el.html(this.template());
        this.delegateEvents();
        console.log('rendered sign up view');
    }
});

// Log in View
window.LoginView = Parse.View.extend({

    template: Handlebars.compile(this.$('#login').html()),

    events: {
        'submit form.login-form': 'logIn'
    },

    initialize: function() {
        console.log('initialized LoginView');
        _.bindAll(this, 'logIn');
    },

    logIn: function(e) {
        var self = this;
        var username = this.$('#login-username').val();
        var password = this.$('#login-password').val();
        console.log('attempting to log in with user: ' +
                    username + ' pass: ' + password);

        // Will eventually change this to our own user
        Parse.User.logIn(username, password, {
            success: function(user) {
                console.log('log in succeded!');
                $(document).trigger('goto', '');
                // REVIEW(donaldh) not sure if this stuff is necessary but
                // whatever
                self.undelegateEvents();
            },
            error: function(user, error) {
                this.$('.login-form .error')
                    .html('Invalid username or password. Please try again.')
                    .show();
                this.$('.login-form button').removeAttr('disabled');
                console.log('log in failure!');
            }
        });

        //this.$('.login-form button').attr('disabled', 'disabled');
        return false;
    },

    render: function() {
        this.$el.html(this.template());
        this.delegateEvents();
        console.log('rendered login view');
    }
});

// Layers View
window.FilterLayersView = Backbone.View.extend({

    template: Handlebars.compile(this.$('#layers').html()),

    render: function() {
        this.delegateEvents();
        this.$el.html(this.template({
            layers: this.collection.toJSON()
        }));
        console.log('rendered layers view');
    }
});

// Handle Settings page
window.SettingsView = Backbone.View.extend({

    template: Handlebars.compile(this.$('#settings').html()),

    checkboxNames: ['Setting1', 'Setting2'],

    checkboxNamesToIds: { 'Setting1': 'wat', 'Setting2': 'wut' },

    render: function() {
        this.delegateEvents();
        this.$el.html(this.template({
            checkboxNames: this.checkboxNames
        }));
    }
});

window.EntityInfoView = Backbone.View.extend({

    template: Handlebars.compile(this.$('#entity-info-view').html()),

    initialize: function() {
        this.collection.bind('add', function(entity) {
            this.model = entity;
            this.collection.remove(entity);
        }, this);
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
    }
});

// Handles Add Entity page
window.AddEntityView = Backbone.View.extend({

    template:Handlebars.compile(this.$('#addentity').html()),

    events: {
        'submit form.add-entity-form': 'save'
    },

    save: function(e) {
        console.log('saving entity');
        // Go to home,
        var variables = {
            name: this.$('#marker-name').val(),
            layerNameSingular: this.$('#layer-select').val(),
            time: this.$('time').val(),
            ownerId: Parse.User.current().id,
            ownerUsername: Parse.User.current().getUsername(),
            text: this.$('#textarea').val(),
            useLocation: $('input[name="use-position"]:checked').length > 0
        };
        this.collection.add(new Entity(variables));
        console.log(variables);
        // TODO(donaldh) add entity with the above variables.
        $(document).trigger('goto', '');
        return false;
    },

    render: function() {
        this.delegateEvents();
        this.$el.html(this.template({
        }));
        console.log('rendered add entity view');
    }
});

window.EntityMarkerView = Backbone.View.extend({

    initialize: function() {
        var self = this;
        this.model.bind('change:lat change:lng', function() {
            this.marker.setPosition(new google.maps.LatLng(
                    self.model.get('lat'),
                    self.model.get('lng')));
        });
    },

    render: function() {
        this.marker = this.marker || new MarkerWithLabel({
            title: this.model.get('name'),
            labelContent: this.model.get('name'),
            // drop marker with animation
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(
                this.model.get('lat'),
                this.model.get('lng')),
            icon: this.options.image
        });
        this.marker.setMap(this.options.gmap);
        google.maps.event.addListener(this.marker, 'click', function() {
            console.log('added event listener ' + this.marker.title);
            this.collection.add(this.model);
            $(document).trigger('goto', '#/entity_info');
        }.bind(this));
    },

    remove: function() {
        if (this.marker) {
            this.marker.setMap(null);
        }
    }

});

window.LayerView = Backbone.View.extend({

    initialize: function() {
        this.collection = this.model.entities;
        _.bindAll(this, 'render', 'drawEntity');
        this.collection.bind('add', this.drawEntity);
        this.collection.bind('reset', this.render);
    },

    render: function() {
        this.entityViews = {};
        this.collection.each(this.drawEntity);
    },

    drawEntity: function(entity) {
        var entityView = new EntityMarkerView({
            model: entity,
            collection: this.options.entitiesToDisplay,
            gmap: this.options.gmap,
            image: this.model.getImage()
        });
        entityView.render();
        this.entityViews[entity.get('name')] = entityView;
    }

});

// Handle mapview page
window.MapView = Backbone.View.extend({

    template: Handlebars.compile(this.$('#mappage').html()),

    initialize: function() {
        this.options.addedEntities.bind('add', this.prepareToAddEntity, this);
    },

    render: function() {
        this.$el.html(this.template({
            user : Parse.User.current().getUsername()
        }));
        // this.$('#map-canvas').height(
        //     window.innerHeight - this.$('#header').height() -
        //     $('#footer').height());
        this.$('#map-canvas').height(400);

        var gmap = this.gmap = new google.maps.Map(this.$('#map-canvas')[0], {
            center: new google.maps.LatLng(40.4430322, -79.9429397),
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        // TODO(donaldh) this is kind of terrible, so figure out a better way
        var interval = setInterval((function() {
            var i = 0;
            return function() {
                i++;
                google.maps.event.trigger(gmap, 'resize');
                if (i > 1) {
                    clearInterval(interval);
                }
            };
        })(), 100);
        if (this.stuffToDo) {
            this.stuffToDo();
            this.stuffToDo = null;
        }

        this.layerViews = {};
        this.model.layers.each(function(layer) {
            var layerView = new LayerView({
                model: layer,
                entitiesToDisplay: this.options.entitiesToDisplay,
                gmap: gmap
            });
            layerView.render();
            this.layerViews[layer.get('layerid')] = layerView;
        }, this);

        this.delegateEvents();
        return this;
    },

    prepareToAddEntity: function(entity) {
        var self = this;
        self.options.addedEntities.remove(entity);
        self.stuffToDo = function() {
            google.maps.event.addListener(
                self.gmap, 'click', function(e) {
                    google.maps.event.clearListeners(self.gmap, 'click');
                    entity.set({
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng()
                    });
                    self.model.addEntity(entity);
                });
        };
    },

    center: function(lat,lng) {
        this.gmap.setCenter(new google.maps.LatLng(lat,lng));
    },

    renderLayers: function(layerids) {
        _.each(
            layerids,
            function(layerid) {
                this.doWithEntities(layerid, function(entities) {
                    _.each(entities, this.drawEntity, this);
                });
            },
            this);
    },

    clearLayers: function(layerids) {
        _.each(
            layerids,
            function(layerid) {
                this.doWithEntities(layerid, function(entities) {
                    _.each(entities, this.eraseEntity, this);
                });
            },
            this);
    },

    forceRefreshLayers: function(layerids) {
        this.clearLayers(layerids);
        this.renderLayers(shownLayers);
        this.set(entitiesAdded, {});
    },

    // This function should be called after the user modifies the
    // 'Select Layer(s)' dialog with an array of the layerids that
    // should now be shown.
    updateShownLayers: function(newShownLayers) {
        this.set('layersNowShown',
                 _.difference(newShownLayers, this.get('shownLayers')));
        console.log(this.get('shownLayers'));
        console.log(this.get('layersNowShown'));
        this.set('layersNowHidden',
                 _.difference(this.get('shownLayers'), newShownLayers));
        console.log(this.get('layersNowHidden'));
        this.set('shownLayers', newShownLayers);
        console.log(this.get('shownLayers'));
        this.refreshLayers();
    },

    refreshLayers: function() {
        _.each(
            this.get('layersNowShown'),
            function(layerid) {
                this.get('map').doWithEntities(layerid, function(entities) {
                    _.each(entities, this.drawEntity, this);
                }.bind(this));
            }.bind(this),
            this);
        _.each(
            this.get('layersNowHidden'),
            function(layerid) {
                this.get('map').doWithEntities(layerid, function(entities) {
                    _.each(entities, this.eraseEntity, this);
                }.bind(this));
            }.bind(this),
            this);
        _.each(this.get('entitiesAdded'), this.drawEntity, this);
        this.set({
            layersNowShown: [],
            layersNowHidden: [],
            entitiesAdded: {}
        });
    }
});

window.AppRouter = Backbone.Router.extend({

    routes: {
        '':'home',
        'logout':'logout',
        'settings':'settings',
        'layers':'layers',
        'add_entity':'add_entity',
        'sign_up':'sign_up',
        'entity_info':'entity_info'
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

        var map = new Map();
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
        this.filterLayersView = new FilterLayersView({collection: map.layers});
        this.addEntityView = new AddEntityView({collection: addedEntities});

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

$(document).ready(function () {
    console.log('document ready');
    app = new AppRouter();
    $(document).bind('goto', function(e, uri) {
        e.preventDefault();
        app.navigate(uri, {trigger: true});
    });
    Backbone.history.start();
});
