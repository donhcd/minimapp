define(['handlebars'], function(Handlebars) {

    var EntityMarkerView = Parse.View.extend({

        initialize: function() {
            var self = this;
            this.model.bind('change:lat change:lng', function() {
                this.marker.setPosition(new google.maps.LatLng(
                        self.model.get('lat'),
                        self.model.get('lng')));
            });
        },

        render: function() {
            this.marker = this.marker || new MarkerWithLabel({
                title: this.model.get('name'),
                labelContent: this.model.get('name'),
                // drop marker with animation
                animation: google.maps.Animation.DROP,
                position: new google.maps.LatLng(
                    this.model.get('lat'),
                    this.model.get('lng')),
                icon: this.options.image
            });
            this.marker.setMap(this.options.gmap);
            google.maps.event.addListener(this.marker, 'click', function() {
                console.log('added event listener ' + this.marker.title);
                this.collection.add(this.model);
                $(document).trigger('goto', '#/entity_info');
            }.bind(this));
        },

        remove: function() {
            if (this.marker) {
                this.marker.setMap(null);
            }
        }

    });

    return EntityMarkerView;
});
