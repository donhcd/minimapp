 (function () {
    var layerNames = ["People", "Landmarks"];
    var layerids = ["users", "landmarks"];
    var layerNamesToIds = {
        "Person": "users",
        "People": "users",
        "Landmark": "landmarks",
        "Landmarks": "landmarks"
    };

//    // TODO(jzzhang) find a place for this
//    var infoBubble = new InfoBubble({
//        map: gmap,
//        content: '<div class="phoneytext" > Click me </div>',
//        shadowStyle: 1,
//        padding: 0,
//        backgroundColor: 'rgb(57,57,57)',
//        borderRadius: 4,
//        arrowSize: 10,
//        borderWidth: 1,
//        borderColor: '#2c2c2c',
//        disableAutoPan: true,
//        hideCloseButton: true,
//        arrowPosition: 30,
//        backgroundClassName: 'phoney',
//        arrowStyle: 2
//    });
//
//    // updates info window with selected entity
//    var selected_entity;
//    // binds click event on infobubble to render infowindow


    window.layerNames = layerNames;
    window.layerids = layerids;
    window.GetLayerIdFromName = function(name) {
        return layerNamesToIds[name];
    };

    window.markers = {};

    window.Entity = Parse.Object.extend("Entity", {
        // This should be constructed with a map providing the name, ownerId,
        // layerid, and latLng coordinates
        initialize: function() {

            if (!(this.get("name") &&
                    this.get("ownerId") && this.get("layerid") &&
                    this.get("lat") && this.get("lng"))) {
                if (this.get("lat")) {
                    // We weren't given a user. This should never happen.
                    throw "something is fucked up";
                }
                // everything is probably missing
//                console.log(this.attributes.name +', '+
//                    this.attributes.ownerId +', '+ this.attributes.layerid +', '+
//                    this.attributes.lat +', '+ this.attributes.lng);
//                console.log(this.get("name") +', '+
//                    this.get("ownerId") +', '+ this.get("layerid") +', '+
//                    this.get("lat") +', '+ this.get("lng"));
//                console.log(this);
                return;
//                throw "name, ownerId, layerid, lat, and lng must be " +
//                      "provided to the constructor for an Entity";
            }
            var currenttime = new Date();
            markers[this.get("name")] = markers[this.get("name")] ||
                new MarkerWithLabel({
                    title: this.get("name"),
                    labelContent: this.get("name"),
                    // drop marker with animation
                    animation: google.maps.Animation.DROP,
                    position: new google.maps.LatLng(
                        this.get("lat"),
                        this.get("lng")),
                    icon: layers[this.get("layerid")].getImage(),
                    map: gmap
                });
//            this.get("ownerId").fetch({});
            google.maps.event.addListener(
                    markers[this.get("name")],
                    'click', function() {
                  console.log("added event listener  " + markers[this.get("name")].title);
                  mapview.DisplayInfoWindow(this);
            }.bind(this));

            this.bind("change:lat change:lng", function() {
                markers[this.get("name")].setPosition(new google.maps.LatLng(
                        this.get("lat"),
                        this.get("lng")));
            });
            this.save();
        }
    });

    /* expect a layerid field */
    window.EntitySet = Parse.Collection.extend({

        model: Entity,

        addEntity: function(entity) {
            this.add(entity);
            entity.initialize();
        }
    });

    window.Layer = Parse.Object.extend("Layer", {

        initialize: function() {
            if (!this.get("layerid")) {
                throw "Layer initializer requires layerid attribute";
            }
            this.entities = new EntitySet();
            this.entities.query = new Parse.Query(Entity);
            this.entities.query.equalTo("layerid", this.get("layerid"));
        },

        getImage: function() {
            switch(this.get("layerid")) {
                case 'users':
                    return 'images/markers/man.png';
                    //return 'scripts/images/person_generic.png';
                case 'landmarks':
                    return 'images/markers/landmark.png';
                    //return 'scripts/images/green_75.png';
            }
        },

        addEntity: function(entity) {
            entity.set('layerid', this.get('layerid'));
            this.entities.addEntity(entity);
        }
    });

    window.Layers = Parse.Collection.extend({

        model: Layer,

        initialize: function() {
            _.bindAll(this, 'addEntity');
            this.add(new Layer({
                layerid: 'users',
                layerName: 'People',
                layerNameSingular: 'Person'
            }));
            this.add(new Layer({
                layerid: 'landmarks',
                layerName: 'Landmarks',
                layerNameSingular: 'Landmark'
            }));
        },

        getLayerWithName: function(name) {
            return this.find(function(layer) {
                return layer.get("layerNameSingular") === name;
            });
        },

        addEntity: function(entity) {
            var layerToAddEntityTo =
                this.getLayerWithName(entity.get("layerNameSingular"));
            if (layerToAddEntityTo) {
                layerToAddEntityTo.addEntity(entity);
            } else {
                alert("this layer is not a thing");
            }
        }
    });

    var layers = {};

    window.Map = Parse.Object.extend("Map", {
        defaults: {
            subscribed: layerids,
            shownLayers: layerids,
            // weren't shown before but now are
            layersNowShown: [],
            // were shown before but now should hide
            layersNowHidden: [],
            layers: new Layers()
        },
        initialize: function() {
            this.InstantiateWithIds(this.get("subscribed"));
            setInterval(function () {
                if (Parse.User.current()) {
                    // callback handles each layer update separately!
                    _.each(this.get("subscribed"), this.UpdateLocalLayer, this);
                }
            }.bind(this), 30000);
        },
        addEntity: function(entity) {
            // (assume ownerId is already authenticated)

            // only if it valid:
            console.log("adding entity to layer: " + entity.get("layerNameSingular"));

            this.get('layers').addEntity(entity);
        },
        DoWithEntities: function(layerid, action) {
            if (layers[layerid]) {
                // if we already have a cached version, use that
                action(layers[layerid].entities.models);
                return;
            } else {
                console.log("Called DoWithEntities with no" +
                        "such local layer: " + layerid);
                console.log("local layers:");
                console.log(layers);
            }
        },
        UpdateLocalLayer: function(layerid) {
            layers[layerid].entities.fetch({
                success: function(entities) {
                   entities.each(function(entity) {
                       entity.initialize();
                   });
                },
                error: function(entities) {
                    //alert("fuck, got an error");
                }
            });
        },
        Subscribe: function(layerids) {
            this.subscribed = _.union(layerids, this.subscribed);
        },
        Unsubscribe: function(layerids) {
            this.subscribed = _.difference(this.subscribed, layerids);
        },
        InstantiateWithIds: function(ids) {
            _.each(
                    ids,
                    function(id) {
                        var layer = new Layer({layerid: id});
                        layers[id] = layer;
                        this.UpdateLocalLayer(id);
                    },
                    this);
        }
    });

 })();
