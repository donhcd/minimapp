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
            
            
            this.collection.bind('reset', this.render);
            console.log('initialized exploreView');                 
        },

        render: function() {
            console.log('exploreview render called');
            this.delegateEvents();
            this.$el.html(this.template());
            this.addAll(this.exploreitems);
        },
        
        addOne: function(entity) {
            console.log('adding entity list element');
            console.log(entity);
            var view = new exploreitem({model : entity});
            this.$('#entity-list').append(view.render().el);
        },
        addAll: function(collection) {
            console.log('add all called');
            this.$('#entity-list').html('');
            console.log(this.exploreitems);
            this.exploreitems.each(this.addOne);
            console.log(this.$('#entity-list'));
        }
    });

    return exploreView;
});
