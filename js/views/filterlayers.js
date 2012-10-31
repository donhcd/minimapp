define(['handlebars'], function(Handlebars) {

    var FilterLayersView = Parse.View.extend({

        template: Handlebars.compile(this.$('#layers').html()),

        render: function() {
            this.delegateEvents();
            this.$el.html(this.template({
                layers: this.collection.toJSON()
            }));
            console.log('rendered layers view');
        }
    });

    return FilterLayersView;
});
