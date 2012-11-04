define([
    'models/entity',
    'collections/entityset'
], function(Entity, EntitySet) {

    var Layer = Parse.Object.extend('Layer', {

        initialize: function() {
            if (!this.get('layerid')) {
                throw 'Layer initializer requires layerid attribute';
            }
            this.entities = new EntitySet();
            this.entities.query = new Parse.Query(Entity);
            this.entities.query.equalTo('layerid', this.get('layerid'));
        },

        getImage: function() {
            switch(this.get('layerid')) {
                case 'tips':
                    return 'images/markers/bluecircle.png';
                //return 'scripts/images/person_generic.png';
                case 'events':
                    return 'images/markers/landmark.png';
                //return 'scripts/images/green_75.png';
            }
        },

        addEntity: function(entity) {
            entity.set('layerid', this.get('layerid'));
            entity.set('image', this.getImage());
            this.entities.addEntity(entity);
        }
    });

    return Layer;
});
