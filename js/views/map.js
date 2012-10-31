// Handle mapview page
define([
    'handlebars',
    'views/layer'
], function(Handlebars, LayerView) {

    var MapView = Parse.View.extend({

        template: Handlebars.compile(this.$('#mappage').html()),

        initialize: function() {
            this.options.addedEntities.bind(
                'add', this.prepareToAddEntity, this);
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

    return MapView;
});

