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

        render: function () {
            this.delegateEvents();
            this.$el.html(this.template({
                layers: this.collection.toJSON()
            }));
            console.log('rendered layers view');
//          Attempt at a view that remembers previously checked values.
//          Doesn't seem to be working at this time.
//          this.collection.each(function (layer) {
//              console.log('collection name:' + layer.get('layerName'));
//              $('#' + layer.get('layerName')).attr('checked', $('#' + layer.get('layerName')).checked);
//              $('#' + layer.get('layerName')).checkboxradio('refresh');
//          });
        },

        selectAll: function(event) {
            this.collection.each(function(layer) {
                console.log('collection name:' + layer.get('layerName'));
                $('#' + layer.get('layerName'))[0].checked = 1;
                $('#' + layer.get('layerName')).checkboxradio("refresh");
            });

        },

        selectNone: function(event) {
            this.collection.each(function(layer) {
                $('#' + layer.get('layerName'))[0].checked = 0;
                $('#' + layer.get('layerName')).checkboxradio("refresh");
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
