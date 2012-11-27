define([
    'handlebars',
    'text!templates/entityinfo.html'
], function(Handlebars, entityinfoTemplate) {

    var EntityInfoView = Parse.View.extend({

        template: Handlebars.compile(entityinfoTemplate),

        events: {
            'click .subscribe_entity': 'starEntity',
            'click #remove-element-button': 'removeElement'
        },

        initialize: function() {
            _.bindAll(this, 'starEntity', 'removeElement', 'render');
            this.collection.bind('add', function(entity) {
                this.model = entity;
                this.collection.remove(entity);
            }, this);
        },

        starEntity: function(e){
            console.log('add star');
            console.log(this.model.get('popularity'));
            this.model.save({
                popularity: this.model.get('popularity') + 1
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
            this.render();

        },

        removeElement: function (e) {
            if (this.model.get('ownerId') == Parse.User.current().id) {
                this.model.destroy();
            }
            else {
                alert('If not an admin, you may only remove' +
                      'your own entities');
            }
            return true;
        },

        render: function() {
            this.delegateEvents();
            var modelVariables = this.model.toJSON();

            var posStr = this.model.get('lat') + ',' + this.model.get('lng') ;
            var markerStr = '&markers=color:blue%7Clabel:S%7C' + posStr;
            var staticMap = 'http://maps.googleapis.com/maps/api/staticmap?' +
                            'center=' + posStr +
                            '&zoom=13&size=450x120&sensor=false' + markerStr;
            $.extend(modelVariables, {
                markerMapUri: staticMap,
                timeString:
                    new Date(this.model.get('time')).toLocaleString(),
                endtimeString:
                    new Date(this.model.get('endtime')).toLocaleString()
            });
            this.$el.html(this.template(modelVariables));
            if (this.model.get('ownerId') == Parse.User.current().id) {
                console.log('changing');
                console.log(this.$('#remove-element-button').css('display'));
                this.$('#remove-element-button').css('display', 'block');
                console.log(this.$('#remove-element-button').css('display'));
            }
            this.$el.trigger('create');
        }
    });

    return EntityInfoView;
});
