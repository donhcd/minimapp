define([
    'handlebars',
    'text!templates/filterlayers.html'
], function(Handlebars, filterlayersTemplate) {

    // Should be instantiated with a collection of Layers
    var FilterLayersView = Parse.View.extend({

        template: Handlebars.compile(filterlayersTemplate),

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
                // TODO(donaldh) show this in the UI
                $('#' + layer.get('layerName'))[0].checked = 1;
            });
        },

        selectNone: function(event) {
            this.collection.each(function(layer) {
                // TODO(donaldh) show this in the UI
                $('#' + layer.get('layerName'))[0].checked = 0;
            });
        },

        selectLayers: function( event ){
            this.collection.each(function(layer) {
                layer.set('shown', $('#' + layer.get('layerName'))[0].checked);
            });
        }
    });

    return FilterLayersView;
});
