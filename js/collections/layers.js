define([
    'models/layer'
], function(Layer) {

    var Layers = Parse.Collection.extend({

        model: Layer,

        initialize: function() {
            _.bindAll(this, 'addEntity');
            this.add(new Layer({
                layerid: 'tips',
                layerName: 'Tips',
                layerNameSingular: 'Tip',
                shown: true
            }));
            this.add(new Layer({
                layerid: 'events',
                layerName: 'Events',
                layerNameSingular: 'Event',
                shown: true
            }));
            this.each(function(layer) {
                layer.entities.fetch({
                    success: function(entities) {
                        entities.each(function(entity) {
                            entity.initialize();
                        });
                    },
                    error: function(entities) {
                        //alert('fuck, got an error');
                    }
                });
            }); 
        },

        addEntity: function(entity) {
            var layerToAddEntityTo = this.find(function(layer) {
                return layer.get('layerNameSingular') ===
                    entity.get('layerNameSingular');
            });
            if (layerToAddEntityTo) {
                layerToAddEntityTo.addEntity(entity);
            } else {
                alert('this layer ' + entity.get('layerNameSingular') +
                      'is not a thing');
            }
        }
    });

    return Layers;
});
