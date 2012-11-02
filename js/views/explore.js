define([
    'handlebars',
    'text!templates/explore.html',
    'collections/explorelist',
    'models/entity',
    'views/exploreitem'
], function(Handlebars, exploreTemplate, ExploreList, entity, exploreitem) {

    // Handle Settings page
    var exploreView = Parse.View.extend({

        template: Handlebars.compile(exploreTemplate),

        initialize: function() {
            var self=this;
            _.bindAll(this,'render','addOne','addAll');   
            
            // create collection of entities
            this.exploreitems = new ExploreList() ;
            // re-render every time fetch is called
            this.collection.bind('reset', this.render);
            console.log('initialized exploreView');                 
        },

        render: function() {
            this.delegateEvents();
            this.$el.html(this.template());
            this.addAll(this.exploreitems);
        },
        
        addOne: function(entity) {
            var view = new exploreitem({model : entity});
            this.$('#entity-list').append(view.render().el);
        },
        addAll: function(collection) {
            this.$('#entity-list').html('');
            this.exploreitems.each(this.addOne);
        }
    });

    return exploreView;
});
