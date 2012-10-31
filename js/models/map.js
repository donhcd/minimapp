define([], function() {

    var Map = Parse.Object.extend('Map', {

        defaults: {
            // weren't shown before but now are
            layersNowShown: [],
            // were shown before but now should hide
            layersNowHidden: []
        },

        initialize: function() {
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

            this.get('layers').addEntity(entity);
        }
    });

    return Map;
});
