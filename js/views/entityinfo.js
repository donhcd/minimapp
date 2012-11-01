define([
    'handlebars',
    'text!templates/entityinfo.html'
], function(Handlebars, entityinfoTemplate) {

    var EntityInfoView = Parse.View.extend({

        template: Handlebars.compile(entityinfoTemplate),

        initialize: function() {
            this.collection.bind('add', function(entity) {
                this.model = entity;
                this.collection.remove(entity);
            }, this);
        },
        events: {
            "click .subscribe_entity": "subscribeEntity"
        },
        subscribeEntity: function(e){
            console.log("subscribe entity clicked");
        },       

        render: function() {
            var modelVariables = this.model.toJSON();
            
            var posStr = this.model.get("lat") + "," + this.model.get("lng") ;
            var markerStr = "&markers=color:blue%7Clabel:S%7C" + posStr;
            var static_map = "http://maps.googleapis.com/maps/api/staticmap?"+
                            "center="+posStr+
                            "&zoom=13&size=450x120&sensor=false"+markerStr;
            $.extend(modelVariables,{markerMapUri: static_map});
            
            
            this.$el.html(this.template(modelVariables));
        
        
        
        
        }
    });

    return EntityInfoView;
});