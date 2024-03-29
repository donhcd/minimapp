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

        defaultDuration: 7*24*60*60*1000,

        save: function(e) {
            // Merges date and time together.
            var startDate = this.$('#startDate').data('datebox').theDate;
            var startTime = this.$('#startTime').data('datebox').theDate;

            startDate.setHours(startTime.getHours());
            startDate.setMinutes(startTime.getMinutes());
            startDate.setMilliseconds(startTime.getMilliseconds());

            var endDate;

            if (this.$('#endDate').val() === '' &&
                this.$('#endTime').val() === '') {
                console.log("endDate/endTime blank");
                endDate = new Date(startDate.getTime() + this.defaultDuration);
                // TODO(donaldh) add more cases...
            }
            else {
                endDate = this.$('#endDate').data('datebox').theDate;
                var endTime = this.$('#endTime').data('datebox').theDate;

                endDate.setHours(endTime.getHours());
                endDate.setMinutes(endTime.getMinutes());
                endDate.setMilliseconds(endTime.getMilliseconds());
            }
            this.collection.add(new Entity({
                name: this.$('#marker-name').val(),
                layerNameSingular: this.$('#layer-select').val(),
                time: startDate.getTime(),
                endtime: endDate.getTime(),
                ownerId: Parse.User.current().id,
                ownerUsername: Parse.User.current().getUsername(),
                text: this.$('#textarea').val(),
                useLocation:
                    this.$('#use-position:checked').val() ? true : false,
                popularity: 0
            }));
            // Go to home
            $(document).trigger('goto', '');
            return false;
        },

        render: function() {
            this.delegateEvents();
            function makeNDigits(num, n) {
                numString = num.toString();
                while (numString.length < 2) {
                    numString = '0' + numString;
                }
                return numString;
            }
            function dateToDateString(date) {
                return makeNDigits(date.getMonth(), 2) + '/' +
                    makeNDigits(date.getDate(), 2) + '/' +
                    makeNDigits(date.getFullYear(), 4);
            }
            function dateToTimeString(date) {
                var hour = date.getHours();
                if (1 <= hour && hour <= 12) {
                    return makeNDigits(hour, 2) + ':' +
                        makeNDigits(date.getMinutes(), 2) + ' AM';
                } else {
                    if (hour === 0) {
                        hour = 12;
                    }
                    return makeNDigits(hour, 2) + ':' +
                        makeNDigits(date.getMinutes(), 2) + ' PM';
                }
            }
            var currentTime = new Date();
            var currentTimePlusWeek =
                new Date(currentTime.getTime() + this.defaultDuration);
            this.$el.html(this.template({
                defaultStartDate: dateToDateString(currentTime),
                defaultStartTime: dateToTimeString(currentTime),
                defaultEndDate: dateToDateString(currentTimePlusWeek),
                defaultEndTime: dateToTimeString(currentTimePlusWeek)
            }));
            console.log('rendered add entity view');
        }
    });

    return AddEntityView;
});
