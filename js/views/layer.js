define(['views/entitymarker'], function(EntityMarkerView) {

    var LayerView = Parse.View.extend({

        initialize: function() {
            this.collection = this.model.entities;
            _.bindAll(this, 'render', 'drawEntity');
            this.collection.bind('add', this.drawEntity);
            this.collection.bind('reset', this.render);
        },

        render: function() {
            this.delegateEvents();
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

    return LayerView;
});
