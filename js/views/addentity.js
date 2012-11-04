define([
    'handlebars',
    'models/entity',
    'text!templates/addentity.html'
], function(Handlebars, Entity, addentityTemplate) {

    // Handles Add Entity page
    var AddEntityView = Parse.View.extend({

        template: Handlebars.compile(addentityTemplate),

        events: {
            'submit form.add-entity-form': 'save'
        },

        save: function(e) {
            console.log('saving entity');
            // Go to home,
            // Merges date and time together.
            var startDate = this.$('#startDate').data('datebox').theDate;
            var endDate = this.$('#endDate').data('datebox').theDate;
            var startTime = this.$('#startTime').data('datebox').theDate;
            var endTime = this.$('#endTime').data('datebox').theDate;

            startDate.setHours(startTime.getHours());
            startDate.setMinutes(startTime.getMinutes());
            startDate.setMilliseconds(startTime.getMilliseconds());
            endDate.setHours(endTime.getHours());
            endDate.setMinutes(endTime.getMinutes());
            endDate.setMilliseconds(endTime.getMilliseconds());
            var variables = {
                name: this.$('#marker-name').val(),
                layerNameSingular: this.$('#layer-select').val(),
                time: startDate.toLocaleString(),
                endtime: endDate.toLocaleString(),
                ownerId: Parse.User.current().id,
                ownerUsername: Parse.User.current().getUsername(),
                text: this.$('#textarea').val(),
                useLocation: $('input[name="use-position"]:checked').length > 0,
                popularity: 0
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
