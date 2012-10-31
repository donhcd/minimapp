define([], function() {

    var Entity = Parse.Object.extend('Entity', {
        // This should be constructed with a map providing the name, ownerId,
        // layerid, and latLng coordinates
        initialize: function() {

            if (!(this.get('name') &&
                  this.get('ownerId') && this.get('layerid') &&
                      this.get('lat') && this.get('lng'))) {
                if (this.get('lat')) {
                    // We weren't given a user. This should never happen.
                    throw 'something is fucked up';
                }
                // everything is probably missing
                // console.log(this.attributes.name +', '+
                //     this.attributes.ownerId +', '+ this.attributes.layerid +', '+
                //     this.attributes.lat +', '+ this.attributes.lng);
                // console.log(this.get('name') +', '+
                //     this.get('ownerId') +', '+ this.get('layerid') +', '+
                //     this.get('lat') +', '+ this.get('lng'));
                // console.log(this);
                // throw 'name, ownerId, layerid, lat, and lng must be ' +
                //       'provided to the constructor for an Entity';
                return;
            }
            this.save();
        }
    });

    return Entity;
});
