define([
    'models/entity',
    'util/geolocation'
], function(Entity, Geolocation) {

    /* expect a layerid field */
    var ExploreList = Parse.Collection.extend({

        model: Entity,

        initialize: function() {
            _.bindAll(this, 'put','filterFetch');
            console.log('initialized explorelist');

            // use meta data storage for collections
            this.filters = {layer: 'tips'};
            // load objects into collection
            this.filterFetch();
            //this.on('change this.filters', this.reFetch);
        },

        put: function(prop, value) {
            console.log('put called');
            this.filters[prop] = value;
            console.log(this.filters);
            if (prop == 'layer' ) this.filterFetch();
        },

        getFilter: function(prop) {
            return this.filters[prop];
        },

        filterFetch: function() {
            // construct the query
            this.query = new Parse.Query(Entity);
            // add filter for layer
            this.query.equalTo('layerid', this.filters.layer);
            this.fetch({
                success: function(entities) {
                    console.log('successfully fetched from server');
                    console.log(entities);
                    entities.each(function(entity) {
                        entity.initialize();
                    });
                },
                error: function(entities) {
                    alert('fuck, got an error');
                }
            });
            console.log('filterfetch called');

        },

        computeDistanceTo: function (entity) {
            var entityLoc = new google.maps.LatLng(
                entity.get('lat'), entity.get('lng'));
            var defaultLoc = new google.maps.LatLng(40.4430322, -79.9429397);
            var currentLoc;
            Geolocation.enqueueTodo(function(latLng) {
                currentLoc = latLng;
            }, defaultLoc);
            if (currentLoc === defaultLoc) {
                console.log('geolocation failed');
            }
            return google.maps.geometry.spherical.computeDistanceBetween(
                entityLoc, currentLoc);
        }

        /*
        nextOrder: function(entity) {
            if (!this.length) return 1;
            return this.last().get('order') + 1;
        },

        comparator: function(entity){
            return entity.get('order');
        },
        */
    });

    return ExploreList;
});
