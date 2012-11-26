define([], function() {
    var geolocator;
    var updatePositionInterval;

    if (!navigator.geolocation) {
        return geolocator;
    }

    geolocator = {
        todoFns: [],
        currentLatLng: null,
        enqueueTodo: function(todoFn, defaultLocation) {
            if (geolocator.currentLatLng) {
                todoFn(geolocator.currentLatLng);
            } else {
                if (defaultLocation) {
                    todoFn(defaultLocation);
                } else {
                    geolocator.todoFns.push(todoFn);
                }
            }
        }
    };

    var updatePosition = function() {
        navigator.geolocation.getCurrentPosition(
            function(geopos) {
                // success
                geolocator.currentLatLng = new google.maps.LatLng(
                    geopos.coords.latitude,
                    geopos.coords.longitude);
                // REVIEW(donaldh) possible race condition with this
                _.each(geolocator.todoFns, function(todoFn) {
                    todoFn(geolocator.currentLatLng);
                });
                geolocator.todoFns.length = 0;
            },
            function() {
                // error
                alert('geolocation\'s not working for some reason');
                window.clearInterval(updatePositionInterval);
                console.log('Error getting the current position');
            }
        );
    };

    updatePositionInterval = window.setInterval(updatePosition, 600000);
    updatePosition();

    return geolocator;
});
