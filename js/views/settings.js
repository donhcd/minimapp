define(['handlebars'], function(Handlebars) {

    // Handle Settings page
    var SettingsView = Parse.View.extend({

        template: Handlebars.compile(this.$('#settings').html()),

        checkboxNames: ['Setting1', 'Setting2'],

        checkboxNamesToIds: { 'Setting1': 'wat', 'Setting2': 'wut' },

        render: function() {
            this.delegateEvents();
            this.$el.html(this.template({
                checkboxNames: this.checkboxNames
            }));
        }
    });

    return SettingsView;
});
