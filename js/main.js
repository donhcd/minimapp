// Log in View
window.LoginView = Parse.View.extend({

    template: _.template(this.$('#login').html()),

    events: {
        "submit form.login-form": "logIn",
        "submit form.signup-form": "signUp"
    },

    initialize: function() {
        console.log("initialized LoginView");
        _.bindAll(this, "logIn", "signUp");
    },

    logIn: function(e) {
        var self = this;
        var username = this.$("#login-username").val();
        var password = this.$("#login-password").val();
        console.log("attempting to log in with user: " +
            username + " pass: " + password);

        // Will eventually change this to our own user
        Parse.User.logIn(username, password, {
            success: function(user) {
                console.log("log in succeded!");
                $(document).trigger('gotohome');
                // REVIEW(donaldh) not sure if this stuff is necessary but whatever
                self.undelegateEvents();
            },
            error: function(user, error) {
                this.$(".login-form .error")
                    .html("Invalid username or password. Please try again.")
                    .show();
                this.$(".login-form button").removeAttr("disabled");
                console.log("log in failure!");
            }
        });

        //this.$(".login-form button").attr("disabled", "disabled");
        return false;
    },

    signUp: function(e) {
        var self = this;
        var username = this.$("#signup-username").val();
        var password = this.$("#signup-password").val();
        console.log("attempting to sign up with user: " + username +
                " pass: " + password);

        Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
            success: function(user) {
                $(document).trigger('gotohome');
                console.log("sign up succeded!");
                // REVIEW(donaldh) not sure if this stuff is necessary but whatever
                self.undelegateEvents();
            },
            error: function(user, error) {
                this.$(".signup-form .error").html(error.message).show();
                this.$(".signup-form button").removeAttr("disabled");
                console.log("sign up Failed...");
            }
        });

        //this.$(".signup-form button").attr("disabled", "disabled");

        return false;
    },

    render: function() {
        this.$el.html(this.template());
        this.delegateEvents();
        console.log("rendered login view");
    }
});
// Layers View
window.LayersView = Backbone.View.extend({

    template: _.template(this.$('#layers').html()),

    layerNames: ["penis", "dickweed"],

    layerNamesToIds: {
        "penis": "wuasdt",
        "dickweed" : "waasdt"
    },

    render: function() {
        this.delegateEvents();
        this.$el.html(this.template({
            layerNames: this.layerNames
        }));
        console.log("rendered layers view");
    }
});
// Handle Settings page
window.SettingsView = Backbone.View.extend({

    template: _.template(this.$('#settings').html()),

    checkboxNames: ["Setting1", "Setting2"],

    checkboxNamesToIds: { "Setting1": "wat", "Setting2": "wut" },

    render: function() {
        this.delegateEvents();
        this.$el.html(this.template({
            checkboxNames: this.checkboxNames
        }));
    }
});
// Handles Add Entity page
window.AddEntityView = Backbone.View.extend({

    template:_.template(this.$('#addentity').html()),

    events: {
        "submit form.add-entity-form": "save"
    },

    save: function(e) {
        console.log("saving entity");

        // Go to home,
        var variables = {
            name: this.$('#marker_name').val(),
            layerNameSingular: this.$('#layer_select').val(),
            time: this.$('time').val(),
            ownerId: Parse.User.current().id,
            ownerUsername: Parse.User.current().getUsername(),
            text: this.$('#textarea').val(),
            useLocation: $('input[name="use-position"]:checked').length > 0
        };
        this.collection.add(new Entity(variables));
        console.log(variables);
        // TODO(donaldh) add entity with the above variables.
        $(document).trigger("gotohome");
        return false;
    },

    render: function() {
        this.delegateEvents();
        this.$el.html(this.template({
        }));
        console.log("rendered add entity view");
    }
});
// Handle mapview page
window.MapView = Backbone.View.extend({

    template: _.template(this.$('#mappage').html()),

    prepAddEntity: function(entity) {
        var self = this;
        this.stuffToDo = function() {
            google.maps.event.addListener(
                self.gmap, 'click', function(e) {
                    google.maps.event.clearListeners(self.gmap, 'click');
                    alert(e.latLng.lat()+", "+e.latLng.lng());
                    entity.set({
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng()
                    });
                    self.model.addEntity(entity);
                });
        };
    },

    initialize: function() {
        this.shownLayers = layerids;
    },

    setAddedEntitiesCollection: function(addedEntities) {
        this.addedEntities = addedEntities;
        this.addedEntities.bind('add', this.prepAddEntity, this);
    },

    render: function() {
        this.$el.html(this.template({
            user : Parse.User.current().getUsername()
        }));
//        this.$('#map_canvas').height(
//            window.innerHeight - this.$('#header').height() - $('#footer').height());
        this.$('#map_canvas').height(400);

        this.gmap = new google.maps.Map(this.$('#map_canvas')[0], {
            center: new google.maps.LatLng(40.4430322, -79.9429397),
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        console.log(this.gmap);
        if (this.stuffToDo) {
            this.stuffToDo();
            this.stuffToDo = null;
        }
        this.delegateEvents();
        gmap = this.gmap;
        return this;
    },

    DrawEntity: function(entity) {
        markers[entity.get("name")].setMap(this.gmap);
    },

    EraseEntity: function(entity) {
        markers[entity.get("name")].setMap(null);
    },

    DisplayInfoWindow: function(entity){
        console.log("display info window called on marker: "+
            markers[entity.get("name")].title);
        //map,marker,x,y){
        // update_dialog(entity);
        infoBubble.content =
            '<a STYLE="text-decoration:none" href="#info_window_page" ' +
            'class="phoneytext">'+markers[entity.get("name")].title+'</a>';
        selected_entity=entity;
        console.log("selected entity: "+ markers[selected_entity.get("name")].title);
        this.$(infoBubble.bubble_).live("click", function() {
            console.log('clicked!');
            infoWindowView.render(selected_entity);
        });
        // Will do later if I hit a deadend (JIM)
        //infoBubble.content= '<div class="phoneytext" onclick="createDialog()" >'+marker.title+'</div>';
        infoBubble.open(this.gmap, markers[entity.get("name")]);
    },

    AddEntityAnimated: function(entity) {
        this.get("map").AddEntity(entity);
        // TODO(donaldh) this should be done in DrawEntity
        markers[entity.get("name")].setMap(this.gmap);
    },

    onNextClick: function(HandleClickCoordinates) {
        google.maps.event.addListener(
            this.gmap, 'click',
            function(e) {
                console.log('google maps listener got click');
                console.log(this.gmap);
                google.maps.event.clearListeners(this.gmap, 'click');
                HandleClickCoordinates(e.latLng);
            }.bind(this));
    },

    Center: function(lat,lng) {
        this.gmap.setCenter(new google.maps.LatLng(lat,lng));
    },

    TriggerGmapEvent: function(eventname) {
        google.maps.event.trigger(this.gmap, eventname);
    },

    RenderLayers: function(layerids) {
        _.each(
                layerids,
                function(layerid) {
                    this.DoWithEntities(layerid, function(entities) {
                        _.each(entities, this.DrawEntity, this);
                    });
                },
                this);
    },

    ClearLayers: function(layerids) {
        _.each(
                layerids,
                function(layerid) {
                    this.DoWithEntities(layerid, function(entities) {
                        _.each(entities, this.EraseEntity, this);
                    });
                },
                this);
    },

    ForceRefreshLayers: function(layerids) {
        this.ClearLayers(layerids);
        this.RenderLayers(shownLayers);
        this.set(entitiesAdded, {});
    },

    // This function should be called after the user modifies the
    // "Select Layer(s)" dialog with an array of the layerids that
    // should now be shown.
    UpdateShownLayers: function(newShownLayers) {
        this.set("layersNowShown",
                _.difference(newShownLayers, this.get("shownLayers")));
        console.log(this.get("shownLayers"));
        console.log(this.get("layersNowShown"));
        this.set("layersNowHidden",
                _.difference(this.get("shownLayers"), newShownLayers));
        console.log(this.get("layersNowHidden"));
        this.set("shownLayers", newShownLayers);
        console.log(this.get("shownLayers"));
        this.RefreshLayers();
    },

    RefreshLayers: function() {
        _.each(
                this.get("layersNowShown"),
                function(layerid) {
                    this.get("map").DoWithEntities(layerid, function(entities) {
                        _.each(entities, this.DrawEntity, this);
                    }.bind(this));
                }.bind(this),
                this);
        _.each(
                this.get("layersNowHidden"),
                function(layerid) {
                    this.get("map").DoWithEntities(layerid, function(entities) {
                        _.each(entities, this.EraseEntity, this);
                    }.bind(this));
                }.bind(this),
                this);
        _.each(this.get("entitiesAdded"), this.DrawEntity, this);
        this.set({
            layersNowShown: [],
            layersNowHidden: [],
            entitiesAdded: {}
        });
    }
});

var AppRouter = Backbone.Router.extend({

    routes:{
        "":"home",
        "logout":"logout",
        "settings":"settings",
        "layers":"layers",
        "add_entity":"add_entity"
    },

    initialize: function () {
        Parse.initialize(
            "Q6TCdTd0MUgW5M3GYkuTwTRYiOBQZJIsClO8X6U5",
            "6nvtUl1BW2fJKDfs3XPS3DDDdR1qBDWFsI88a0cK");
        // Handle back button throughout the application
//        $('.back').live('click', function(event) {
//            window.history.back();
//            return false;
//        });

        var map = new Map();
        var addedEntities = new EntitySet();

        // Instantiate all the views
        this.loginView = new LoginView();
        this.settingsView = new SettingsView();
        this.mapView = new MapView({model: map});
        this.mapView.setAddedEntitiesCollection(addedEntities);
        this.layersView = new LayersView({map: map});
        this.addEntityView = new AddEntityView({collection: addedEntities});

        this.firstPage = true;
    },

    home: function () {
        console.log('#home');
        var self = this;
        if (Parse.User.current()) {
            console.log('you are logged in');
            this.changePage(this.mapView);
            // TODO(donaldh) this is kind of terrible, so figure out a better way

            setInterval(function() {
                google.maps.event.trigger(self.mapView.gmap, "resize");
            }, 1);
        } else {
            console.log('you are not logged in, so log in');
            this.changePage(loginView);
        }
    },

    logout: function () {
        console.log('#logout');
        Parse.User.logOut();
        this.changePage(this.loginView);
    },

    settings: function () {
        console.log('#settings');
        this.changePage(this.settingsView);
    },

    layers: function () {
        console.log('#layers');
        this.changePage(this.layersView);
    },

    add_entity: function () {
        console.log('#add_entity');
        this.changePage(this.addEntityView);
    },

    changePage:function (page) {
        page.$el.attr('data-role', 'page');
        page.render();
        $('body').append(page.$el);
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
    $(document).bind('gotohome', function(e) {
        e.preventDefault();
        console.warn("poop.");
        app.navigate("#/", {trigger: true});
    });
    Backbone.history.start();
});
