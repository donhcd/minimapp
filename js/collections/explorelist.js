define(['models/entity'], function(Entity) {

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
            this.query.equalTo('layerid', this.filters['layer'] );
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