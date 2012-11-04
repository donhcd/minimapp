// Handle mapview page
define([
    'handlebars',
    'views/layer',
    'text!templates/map.html'
], function(Handlebars, LayerView, mapTemplate) {

    var MapView = Parse.View.extend({

        template: Handlebars.compile(mapTemplate),

        initialize: function() {
            this.options.addedEntities.bind(
                'add', this.prepareToAddEntity, this);

            this.refreshEntities(this);
            var self = this;
            setInterval(function () {self.refreshEntities(self) }, 900000);
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

            this.getCurrentLatLng({
                success: function(latLng) {
                    console.log("successfully detected geolocation");
                    gmap.setCenter(latLng);
                }
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
            this.model.get('layers').each(function(layer) {
                if (layer.get('shown')) {
                    var layerView = new LayerView({
                        model: layer,
                        entitiesToDisplay: this.options.entitiesToDisplay,
                        gmap: gmap
                    });
                    layerView.render();
                    this.layerViews[layer.get('layerid')] = layerView;
                }
            }, this);

            this.delegateEvents();
            return this;
        },

        refreshEntities: function (self) {
            //TODO(tzx): move logic into entity, change to event listen/trigger.
            //console.log("init refresh");
            //console.log(this);
            self.model.get('layers').each(function (layer) {
                layer.entities.each(function (entity) {
                    //console.log(entity);
                    var end = new Date(entity.get('endtime'));
                    var current = new Date();
                    //console.log(end);
                    //console.log(current);
                    if (end < current) {
                        layer.entities.removeEntity(entity);
                        if (layer.get('shown')) {
                            self.layerViews[layer.get('layerid')].entityViews[entity.get('name')].remove();
                            self.layerViews[layer.get('layerid')].model = layer;
                        }
                    }
                });
            });
        },

        prepareToAddEntity: function(entity) {
            var self = this;
            self.options.addedEntities.remove(entity);
            if (entity.get('useLocation')) {
                self.getCurrentLatLng({
                    success: function(latLng) {
                        entity.set('latLng', latLng);
                        entity.set('lat', latLng.lat());
                        entity.set('lng', latLng.lng());
                        self.model.addEntity(entity);
                    }
                });
            } else {
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
            }
        },

        getCurrentLatLng: function(options) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(geopos) { // success
                        console.log('Successfully got current position');
                        options.success(new google.maps.LatLng(
                            geopos.coords.latitude,
                            geopos.coords.longitude));
                    },
                    function() { // error
                        if (options.error) {
                            options.error();
                        } else {
                            console.log('Error getting the current position');
                        }
                    }
                );
            } else {
                console.log('geolocation not enabled');
            }
        }
    });

    return MapView;
});

