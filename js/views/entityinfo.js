define([
    'jquery',
    'handlebars'
], function($, Handlebars) {

    var EntityInfoView = Backbone.View.extend({

        template: Handlebars.compile(this.$('#entity-info-view').html()),

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
