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

/*
render: function(entity) {
            console.log("rendering infowindow");
            console.log(entity.marker.title);
            console.log(entity.marker.icon);
            console.log(entity.get("lat"));
            console.log(entity.get("lng"));
            console.log(entity.get("ownerId"));
            posStr = entity.get("lat") + "," + entity.get("lng") ;
            markerStr = "&markers=color:blue%7Clabel:S%7C" + posStr;
            var static_map = "http://maps.googleapis.com/maps/api/staticmap?"+
                            "center="+posStr+
                            "&zoom=13&size=450x120&sensor=false"+markerStr;
            console.log(static_map);
            //markerOwner : entity.get("ownerId").getUsername()
            var variables = {
                markerTitle: entity.marker.title,
                markerOwner : entity.get("ownerId").id ,
                markerMap: static_map,
                Description: entity.get("description")
            };
            console.log(variables);
            //var variables = {};
            var template = _.template($("#info-template").html(), {
                markerTitle: entity.marker.title,
                markerOwner : entity.get("ownerId").id ,
                markerMap: static_map,
                Description: entity.get("description")
            });
            $(this.el).html(template);
        }
*/