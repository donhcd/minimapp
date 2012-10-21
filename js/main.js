window.HomeView = Backbone.View.extend({

    render:function (eventName) {
        if (Parse.User.current()) {
        } else {
            new LoginView();
        }
        return this;
    }
});

// Log in View
window.LoginView = Parse.View.extend({
    template:_.template($('#login').html()),

    events: {
        "submit form.login-form": "logIn",
        "submit form.signup-form": "signUp"
    },

    initialize: function() {
        console.log("initialized LoginView");
        _.bindAll(this, "logIn", "signUp");
        this.render();
    },

    logIn: function(e) {
        var username = this.$("#login-username").val();
        var password = this.$("#login-password").val();
        console.log("attempting to log in with user: " +
            username + " pass: " + password);
  
        // Will eventually change this to our own user
        Parse.User.logIn(username, password, {
            success: function(user) {
                //self.undelegateEvents();
                //delete this;
//                ApplyUser(0, username);
//                $("#sign_in_page").dialog("close");
                
                console.log("log in succeded!");
                window.location.replace("#");
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
        var username = this.$("#signup-username").val();
        var password = this.$("#signup-password").val();
        console.log("attempting to sign up with user: " + username +
                " pass: " + password);
  
        Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
            success: function(user) {
                //self.undelegateEvents();
                //delete self;
//                ApplyUser(1,username);
//                $("#sign_in_page").dialog("close");
                window.location.replace("#");
                console.log("sign up succeded!");
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
    }
});

window.LayersView = Backbone.View.extend({
});

window.SettingsView = Backbone.View.extend({

    template:_.template($('#settings').html()),

    checkboxNames: ["Setting1", "Setting2"],

    checkboxNamesToIds: { "Setting1": "wat", "Setting2": "wut" },

    render: function() {
        $(this.el).html(this.template({
            checkboxNames: this.checkboxNames
        }));
    }
});

window.AddEntityView = Backbone.View.extend({
});

window.MapView = Backbone.View.extend({

    template: _.template($('#mappage').html()),

    defaults: {
        layerIds: layerIds
    },

    initialize: function() {
        this.map = new Map();
        this.shownLayers = layerIds;
    },

    render: function() {
        var self = this;
        var initmap = function () {
//            $('#map_canvas').height(
//                window.innerHeight - $('#header').height() - $('#footer').height());
            $('#map_canvas').height(400);
            self.gmap = new google.maps.Map($('#map_canvas')[0], { 
                center: new google.maps.LatLng(40.4430322,         
                            -79.9429397),                          
                zoom: 17,                                          
                mapTypeId: google.maps.MapTypeId.ROADMAP           
            });                                                    
            gmap = self.gmap;
        };
        $(this.el).html(this.template({
            user : Parse.User.current().getUsername()
        }));
        setTimeout(initmap, 250);
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
        infoBubble.content = '<a STYLE="text-decoration:none" href="#info_window_page" class="phoneytext">'+markers[entity.get("name")].title+'</a>';
        selected_entity=entity;
        console.log("selected entity: "+ markers[selected_entity.get("name")].title);
        $(infoBubble.bubble_).live("click", function() {
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

    // exposed event
    OnNextClick: function(HandleClickCoordinates) {
        google.maps.event.addListener(
            this.gmap, 'click',
            function(e) {
                console.log('google maps listener got click');
                console.log(this.gmap);
                google.maps.event.clearListeners(this.gmap, 'click');
                HandleClickCoordinates(e.latLng.Xa, e.latLng.Ya);
            }.bind(this));
    },

    Center: function(lat,lng) {
        this.gmap.setCenter(new google.maps.LatLng(lat,lng));
    },

    TriggerGmapEvent: function(eventname) {
        google.maps.event.trigger(this.gmap, eventname);
    },

    RenderLayers: function(layerIds) {
        _.each(
                layerIds,
                function(layerId) {
                    this.DoWithEntities(layerId, function(entities) {
                        _.each(entities, this.DrawEntity, this);
                    });
                },
                this);
    },

    ClearLayers: function(layerIds) {
        _.each(
                layerIds,
                function(layerId) {
                    this.DoWithEntities(layerId, function(entities) {
                        _.each(entities, this.EraseEntity, this);
                    });
                },
                this);
    },

    ForceRefreshLayers: function(layerIds) {
        this.ClearLayers(layerIds);
        this.RenderLayers(shownLayers);
        this.set(entitiesAdded, {});
    },

    // This function should be called after the user modifies the
    // "Select Layer(s)" dialog with an array of the layerIds that
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
                function(layerId) {
                    this.get("map").DoWithEntities(layerId, function(entities) {
                        _.each(entities, this.DrawEntity, this);
                    }.bind(this));
                }.bind(this),
                this);
        _.each(
                this.get("layersNowHidden"),
                function(layerId) {
                    this.get("map").DoWithEntities(layerId, function(entities) {
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
        "/logout":"logout",
        "/settings":"settings",
        "/layers":"layers",
        "/add_entity":"add_entity"
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
        this.firstPage = true;
    },

    home: function () {
        console.log('#home');
        this.changePage(Parse.User.current() ? new MapView() : new LoginView());
    },

    logout: function () {
        console.log('#logout');
        Parse.User.logOut();
        this.changePage(new LoginView());
    },

    settings: function () {
        console.log('#settings');
        this.changePage(new SettingsView());
    },

    layers: function () {
        console.log('#layers');
        this.changePage(new LayersView());
    },

    add_entity: function () {
        console.log('#add_entity');
        this.changePage(new AddEntityView());
    },

    changePage:function (page) {
        $(page.el).attr('data-role', 'page');
        page.render();
        $('body').append($(page.el));
        var transition = $.mobile.defaultPageTransition;
        // We don't want to slide the first page
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }
        $.mobile.changePage($(page.el), {changeHash:false, transition: transition});
    }

});

$(document).ready(function () {
    console.log('document ready');
    app = new AppRouter();
    Backbone.history.start();
});
