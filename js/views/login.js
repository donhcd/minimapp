define([
    'handlebars',
    'text!templates/login.html'
], function(Handlebars, loginTemplate) {

    // Log in View
    var LoginView = Parse.View.extend({

        template: Handlebars.compile(loginTemplate),

        events: {
            'submit form.login-form': 'logIn',
            'click .guestSignIn': 'guestLogIn'
        },

        initialize: function() {
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
        
        guestLogIn: function(e){
            Parse.User.logIn('guest', 'guest', {
                success: function(user) {
                    console.log('log in succeded!');
                    $(document).trigger('goto', '');
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
            this.delegateEvents();
            this.$el.html(this.template());
            console.log('rendered login view');
        }
    });

    return LoginView;
});
