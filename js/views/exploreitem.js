define([
    'handlebars',
    'text!templates/exploreitem.html'
], function(Handlebars, exploreitemTemplate) {

    // Handle Settings page
    var ExploreItemView = Parse.View.extend({
    
        template: Handlebars.compile(exploreitemTemplate),
        
        tagName: 'li',
        
        events:{
            'click .subscribebutton' : 'addStar' ,
            'click .listitem' : 'displayEntity'
        },

        initialize: function() {
            _.bindAll(this,'render','clear','displayEntity','addStar');
            
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
            
            var posStr = this.model.get('lat') + ',' + this.model.get('lng') ;
            var markerStr = '&markers=color:blue%7Clabel:S%7C' + posStr;
            var staticMap = 'http://maps.googleapis.com/maps/api/staticmap?' +
                            'center=' + posStr +
                            '&zoom=15&size=80x80&sensor=false' + markerStr;
        
        
            var modelVariables = this.model.toJSON();
            $.extend(modelVariables, {markerMapUri: staticMap});
            this.$el.html(this.template(modelVariables));
            return this;
        },
        
        clear: function() {
            this.model.destroy();
        },
        
        addStar: function() {
            console.log('add star');
            console.log(this.model.get('popularity'));
            this.model.save({
                popularity: this.model.get('popularity')+1
            }, {
                success: function(gameScore) {
                    console.log('saved');
                    // The object was saved successfully.
                },
                error: function(gameScore, error) {
                    console.log('error trying to save');
                    // The save failed.
                    // error is a Parse.Error with an error code and description.
                }
            });
            // TODO(Jim) refresh the item
            
            
        },
        
        displayEntity: function(){
            this.options.collection.add(this.model);
            
            $(document).trigger('goto', '#/entity_info');
        }
    });

    return ExploreItemView;
});
