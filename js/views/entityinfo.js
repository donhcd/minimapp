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
            'click .subscribe_entity': 'subscribeEntity'
        },

        subscribeEntity: function(e){
            console.log('subscribe entity clicked');
        },

        events: {
            'click .subscribe_entity': 'subscribeEntity',
            'click #remove-element-button': 'removeElement'
        },

        subscribeEntity: function(e){
            console.log('subscribe entity clicked');
        },

        removeElement: function (e) {
            console.log(e);
            console.log("in function");
            if (this.model.get('ownerId') == Parse.User.current().id) {
                console.log(this);
                this.model.destroy();
            }
            else {
                //TODO(tzx): Add message for user.
                console.log("Not the right user! Uh oh.");
            }
            
        },

        render: function() {
            var modelVariables = this.model.toJSON();

            var posStr = this.model.get('lat') + ',' + this.model.get('lng') ;
            var markerStr = '&markers=color:blue%7Clabel:S%7C' + posStr;
            var staticMap = 'http://maps.googleapis.com/maps/api/staticmap?' +
                            'center=' + posStr +
                            '&zoom=13&size=450x120&sensor=false' + markerStr;
            $.extend(modelVariables, {markerMapUri: staticMap});
            this.$el.html(this.template(modelVariables));
            if (this.model.get('ownerId') == Parse.User.current().id) {
                console.log('changing');
                console.log(this.$('#remove-element-button').css('display'));
                this.$('#remove-element-button').css('display', 'block');
                console.log(this.$('#remove-element-button').css('display'));
            }
        }
    });

    return EntityInfoView;
});
