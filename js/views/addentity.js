define([
    'handlebars',
    'models/entity'
], function(Handlebars, Entity) {

    // Handles Add Entity page
    var AddEntityView = Parse.View.extend({

        template: Handlebars.compile(this.$('#addentity').html()),

        events: {
            'submit form.add-entity-form': 'save'
        },

        save: function(e) {
            console.log('saving entity');
            // Go to home,
            var variables = {
                name: this.$('#marker-name').val(),
                layerNameSingular: this.$('#layer-select').val(),
                time: this.$('time').val(),
                ownerId: Parse.User.current().id,
                ownerUsername: Parse.User.current().getUsername(),
                text: this.$('#textarea').val(),
                useLocation: $('input[name="use-position"]:checked').length > 0
            };
            this.collection.add(new Entity(variables));
            console.log(variables);
            // TODO(donaldh) add entity with the above variables.
            $(document).trigger('goto', '');
            return false;
        },

        render: function() {
            this.delegateEvents();
            this.$el.html(this.template({
            }));
            console.log('rendered add entity view');
        }
    });

    return AddEntityView;
});
