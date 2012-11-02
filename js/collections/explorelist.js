define(['models/entity','collections/entityset'], function(Entity,EntitySet) {

    /* expect a layerid field */
    var ExploreList = Parse.Collection.extend({

        model: Entity,
        initialize: function() {
            console.log('initialized explorelist');
    
            
            this.query = new Parse.Query(Entity);
            this.fetch({
                    success: function(entities) {
                        entities.each(function(entity) {
                            entity.initialize();
                        });
                    },
                    error: function(entities) {
                        alert('fuck, got an error');
                    }
                });  
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