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

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
        }
    });

    return EntityInfoView;
});
