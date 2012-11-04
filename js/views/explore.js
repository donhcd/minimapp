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
        
        events: {
            "click #TipsTab" : "changeTab",
            "click #EventsTab" : "changeTab",
            "click #SubscribedTab" : "changeTab"
        },

        initialize: function() {
            _.bindAll(this,'render','addOne','addAll');   
            // tracks current tab
            this.tab = 'Tips';
            // create collection of entities
            this.exploreitems = new ExploreList();
            // re-render every time fetch is called
            this.exploreitems.bind('reset', this.render);
            
            console.log('initialized exploreView');                 
        },

        render: function() {
            this.delegateEvents();
            this.$el.html(this.template({
                tab: this.tab
            }));
            this.addAll(this.exploreitems);
            console.log(this.$el);
            this.$el.trigger('create');
        },
        
        changeTab: function(e) {
            this.tab = $(e.target).text();
            console.log('recieved click from:' + this.tab);
            switch (this.tab) {
                case 'Tips':
                    console.log('tips');
                    this.exploreitems.put('layer', 'tips');
                    break;
                case 'Events':
                    console.log('events');
                    this.exploreitems.put('layer', 'events');
                    break;
                case 'Subscribed':
                    console.log('subscribed');
                    console.log('todo: subscribed');
                    break;
                default:
                    console.log('error!');
            }
        },
        
        addOne: function(entity) {
            var view = new ExploreItem({
                model : entity,
                collection: this.options.entitiesToDisplay
            });
            this.$('#entity-list').append(view.render().el);
        },
        
        addAll: function(collection) {
            this.$('#entity-list').html('');
            console.log(this.$('#entity-list'));
            this.exploreitems.each(this.addOne);
        }
        
    });

    return ExploreView;
});