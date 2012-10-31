define(['handlebars'], function(Handlebars) {

    // Should be instantiated with a collection of Layers
    var FilterLayersView = Parse.View.extend({

        template: Handlebars.compile(this.$('#layers').html()),

        events: {
            "click #confirm-layers-button": "selectLayers",
            // FIXME(donaldh) selectAll and selectNone don't quite work
            // with the label-wrapped checkboxes...
            "click #select-all-button": "selectAll",
            "click #select-none-button": "selectNone"
        },

        render: function() {
            this.delegateEvents();
            this.$el.html(this.template({
                layers: this.collection.toJSON()
            }));
            console.log('rendered layers view');
        },

        selectAll: function(event) {
            this.collection.each(function(layer) {
                document.getElementById(layer.get('layerName')).checked = 1;
            });
        },

        selectNone: function(event) {
            this.collection.each(function(layer) {
                document.getElementById(layer.get('layerName')).checked = 0;
            });
        },
        selectLayers: function( event ){
            var newShownLayers = [];
            var self = this;
            this.collection.each(function(layer) {
                layer.set(
                    'shown',
                    document.getElementById(layer.get('layerName')).checked);
            });
        }
    });

    return FilterLayersView;
});
