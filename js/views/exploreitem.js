define([
    'handlebars',
    'text!templates/exploreitem.html'
], function(Handlebars, exploreitemTemplate) {

    // Handle Settings page
    var ExploreItemView = Parse.View.extend({
    
        template: Handlebars.compile(exploreitemTemplate),
        
        tagName: 'li',
        
        events:{
            'click .subscribebutton' : 'subscribe' 
        },

        initialize: function() {
            _.bindAll(this,'render','clear');
        
        },
        
        getImage: function(layerid) {
            switch(layerid) {
                case 'users':
                    return 'images/markers/man.png';
                //return 'scripts/images/person_generic.png';
                case 'landmarks':
                    return 'images/markers/landmark.png';
                //return 'scripts/images/green_75.png';
            }
        },
        
        render: function() {
            var modelVariables = this.model.toJSON();
            this.$el.html(this.template(modelVariables));
            return this;
        },
        
        clear: function() {
            this.model.destroy();
        },
        
        subscribe: function() {
            console.log('subscribe clicked');
        }
    });

    return ExploreItemView;
});
