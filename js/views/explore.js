define([
    'handlebars',
    'collections/explorelist',
    'models/entity',
    'views/exploreitem',
    'text!templates/explore.html'
], function(Handlebars, ExploreList, entity, ExploreItem, exploreTemplate) {
    // Handle Settings page
    var ExploreView = Parse.View.extend({

        template: Handlebars.compile(exploreTemplate),

        initialize: function() {
            _.bindAll(this,'render','addOne','addAll');   
            
            // create collection of entities
            this.exploreitems = new ExploreList() ;
            // re-render every time fetch is called
            this.collection.bind('reset', this.render);
            this.collection.bind('add', this.addOne);
            
            console.log('initialized exploreView');                 
        },

        render: function() {
            this.delegateEvents();
            this.$el.html(this.template());
            this.addAll(this.exploreitems);
        },
        
        addOne: function(entity) {
            var view = new ExploreItem({model : entity});
            this.$('#entity-list').append(view.render().el);
        },
        
        addAll: function(collection) {
            this.$('#entity-list').html('');
            this.exploreitems.each(this.addOne);
        }
    });

    return ExploreView;
});
