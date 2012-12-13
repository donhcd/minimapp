// Handle mapview page
define([
    'handlebars',
    'views/layer',
    'util/geolocation',
    'text!templates/map.html'
], function(Handlebars, LayerView, Geolocation, mapTemplate) {

    var MapView = Parse.View.extend({

        template: Handlebars.compile(mapTemplate),

        initialize: function() {
            _.bindAll(this, 'refreshEntities', 'prepareToAddEntity');
            this.options.addedEntities.bind(
                'add', this.prepareToAddEntity, this);
            var self = this;
            setInterval(function() {self.refreshEntities(self);}, 900000);
        },

        render: function() {
            this.delegateEvents();
            this.$el.html(this.template({
                user: Parse.User.current().getUsername()
            }));
            // this.$('#map-canvas').height(
            //     window.innerHeight - this.$('#header').height() -
            //     $('#footer').height());
            this.$('#map-canvas').height(400);

            var gmap = new google.maps.Map(this.$('#map-canvas')[0], {
                center: new google.maps.LatLng(40.4430322, -79.9429397),
                zoom: 18,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

//            Geolocation.enqueueTodo(function(latLng) {
//                gmap.setCenter(latLng);
//            });

            // Listener is fired after the map becomes idle after
            // zooming/panning
            google.maps.event.addListener(gmap, "idle", function() {
                google.maps.event.trigger(gmap, 'resize');
            });

            gmap.setZoom(gmap.getZoom() - 1);
            this.gmap = gmap;

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
            this.refreshEntities(this);
            return this;
        },

        refreshEntities: function() {
            var self = this;
            // TODO(tzx): move logic into entity, change to
            // event listen/trigger.
            self.model.get('layers').each(function(layer) {
                //console.log(layer.entities);
                layer.entities.each(function(entity) {
                    var end = new Date(entity.get('endtime'));
                    var current = new Date();
                    if (end < current) {
                        layer.entities.removeEntity(entity);
                        if (layer.get('shown')) {
                            self.layerViews[layer.get('layerid')]
                                .entityViews[entity.get('name')].remove();
                            self.layerViews[layer.get('layerid')].model = layer;
                        }
                    }
                });
            });
        },

        prepareToAddEntity: function(entity) {
            var self = this;
            self.options.addedEntities.remove(entity);
            function todoWithLatLng(latLng) {
                entity.set({
                    lat: latLng.lat(),
                    lng: latLng.lng()
                });
                self.model.addEntity(entity);
            }
            if (entity.get('useLocation')) {
                Geolocation.enqueueTodo(todoWithLatLng);
            } else {
                self.stuffToDo = function() {
                    google.maps.event.addListener(
                        self.gmap, 'click', function(e) {
                            google.maps.event.clearListeners(
                                self.gmap, 'click');
                            todoWithLatLng(e.latLng);
                        });
                };
            }
        }
    });

    return MapView;
});

