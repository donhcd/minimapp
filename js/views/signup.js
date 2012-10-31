define([
    'jquery',
    'handlebars'
], function($, Handlebars) {

    var SignupView = Parse.View.extend({

        template: Handlebars.compile(this.$('#signup').html()),

        events: {
            'submit form.signup-form': 'signUp'
        },

        initialize: function() {
            console.log('initialized SignupView');
            _.bindAll(this, 'signUp');
        },

        signUp: function(e) {
            var self = this;
            var username = this.$('#signup-username').val();
            var password = this.$('#signup-password').val();
            console.log('attempting to sign up with user: ' + username +
                        ' pass: ' + password);
            Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
                success: function(user) {
                    $(document).trigger('goto', '');
                    console.log('sign up succeded!');
                    // REVIEW(donaldh) not sure if this stuff is necessary but
                    // whatever
                    self.undelegateEvents();
                },
                error: function(user, error) {
                    this.$('.signup-form .error').html(error.message).show();
                    this.$('.signup-form button').removeAttr('disabled');
                    console.log('sign up Failed...');
                }
            });
            //this.$('.signup-form button').attr('disabled', 'disabled');
            return false;
        },

        render: function() {
            this.$el.html(this.template());
            this.delegateEvents();
            console.log('rendered sign up view');
        }
    });

    return SignupView;
});
