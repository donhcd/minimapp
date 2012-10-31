define([
    'handlebars',
    'text!templates/settings.html'
], function(Handlebars, settingsTemplate) {

    // Handle Settings page
    var SettingsView = Parse.View.extend({

        template: Handlebars.compile(settingsTemplate),

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
