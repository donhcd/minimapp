window.Entity = Parse.Object.extend('Entity', {
    // This should be constructed with a map providing the name, ownerId,
    // layerid, and latLng coordinates
    initialize: function() {

        if (!(this.get('name') &&
              this.get('ownerId') && this.get('layerid') &&
                  this.get('lat') && this.get('lng'))) {
            if (this.get('lat')) {
                // We weren't given a user. This should never happen.
                throw 'something is fucked up';
            }
            // everything is probably missing
            // console.log(this.attributes.name +', '+
            //     this.attributes.ownerId +', '+ this.attributes.layerid +', '+
            //     this.attributes.lat +', '+ this.attributes.lng);
            // console.log(this.get('name') +', '+
            //     this.get('ownerId') +', '+ this.get('layerid') +', '+
            //     this.get('lat') +', '+ this.get('lng'));
            // console.log(this);
            // throw 'name, ownerId, layerid, lat, and lng must be ' +
            //       'provided to the constructor for an Entity';
            return;
        }
        this.save();
    }
});

/* expect a layerid field */
window.EntitySet = Parse.Collection.extend({

    model: Entity,

    addEntity: function(entity) {
        this.add(entity);
        entity.initialize();
    }
});

window.Layer = Parse.Object.extend('Layer', {

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
            case 'users':
                return 'images/markers/man.png';
            //return 'scripts/images/person_generic.png';
            case 'landmarks':
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

window.Layers = Parse.Collection.extend({

    model: Layer,

    initialize: function() {
        _.bindAll(this, 'addEntity');
        this.add(new Layer({
            layerid: 'users',
            layerName: 'People',
            layerNameSingular: 'Person'
        }));
        this.add(new Layer({
            layerid: 'landmarks',
            layerName: 'Landmarks',
            layerNameSingular: 'Landmark'
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
            return layer.get('layerNameSingular') === name;
        });
        if (layerToAddEntityTo) {
            layerToAddEntityTo.addEntity(entity);
        } else {
            alert('this layer is not a thing');
        }
    }
});

window.Map = Parse.Object.extend('Map', {

    defaults: {
        // weren't shown before but now are
        layersNowShown: [],
        // were shown before but now should hide
        layersNowHidden: []
    },

    initialize: function() {
        this.layers = new Layers();
        // this.instantiateWithIds(this.get('subscribed'));
        // setInterval(function () {
        //     if (Parse.User.current()) {
        //         // callback handles each layer update separately!
        //         _.each(this.get('subscribed'), this.updateLocalLayer, this);
        //     }
        // }.bind(this), 30000);
    },

    addEntity: function(entity) {
        // (assume ownerId is already authenticated)

        // only if it valid:
        console.log('adding entity to layer: ' +
                    entity.get('layerNameSingular'));

        this.layers.addEntity(entity);
    }
});
