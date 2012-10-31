define(['handlebars'], function(Handlebars) {

    // Log in View
    var LoginView = Parse.View.extend({

        template: Handlebars.compile(this.$('#login').html()),

        events: {
            'submit form.login-form': 'logIn'
        },

        initialize: function() {
            console.log('initialized LoginView');
            _.bindAll(this, 'logIn');
        },

        logIn: function(e) {
            var self = this;
            var username = this.$('#login-username').val();
            var password = this.$('#login-password').val();
            console.log('attempting to log in with user: ' +
                        username + ' pass: ' + password);

            // Will eventually change this to our own user
            Parse.User.logIn(username, password, {
                success: function(user) {
                    console.log('log in succeded!');
                    $(document).trigger('goto', '');
                    // REVIEW(donaldh) not sure if this stuff is necessary but
                    // whatever
                    self.undelegateEvents();
                },
                error: function(user, error) {
                    this.$('.login-form .error')
                        .html('Invalid username or password. Please try again.')
                        .show();
                    this.$('.login-form button').removeAttr('disabled');
                    console.log('log in failure!');
                }
            });

            //this.$('.login-form button').attr('disabled', 'disabled');
            return false;
        },

        render: function() {
            this.$el.html(this.template());
            this.delegateEvents();
            console.log('rendered login view');
        }
    });

    return LoginView;
});
