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
            startDate.setHours(this.$('#startTime').data('datebox').theDate.getHours());
            startDate.setMinutes(this.$('#startTime').data('datebox').theDate.getMinutes());
            startDate.setMilliseconds(this.$('#startTime').data('datebox').theDate.getMilliseconds());
            var endDate = this.$('#endDate').data('datebox').theDate
            endDate.setHours(this.$('#endTime').data('datebox').theDate.getHours());
            endDate.setMinutes(this.$('#endTime').data('datebox').theDate.getMinutes());
            endDate.setMilliseconds(this.$('#endTime').data('datebox').theDate.getMilliseconds());
            var variables = {
                name: this.$('#marker-name').val(),
                layerNameSingular: this.$('#layer-select').val(),
                time: startDate.toLocaleString(),
                endtime: endDate.toLocaleString(),
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
