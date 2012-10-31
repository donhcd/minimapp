define([
    'models/entity'
], function(Entity) {

    /* expect a layerid field */
    var EntitySet = Parse.Collection.extend({

        model: Entity,

        addEntity: function(entity) {
            this.add(entity);
            entity.initialize();
        }
    });

    return EntitySet;
});
