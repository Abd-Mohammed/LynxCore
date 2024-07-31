(function (places, undefined) {

    var infowindow;
    var markers = [];

    places.showAll = function initialize(map) {
        this.showAirports(map);
        this.showBanks(map);
        this.showGasStations(map);
        this.showHospitals(map);
        this.showMosques(map);
        this.showPharmacies(map);
        this.showPoliceStations(map);
        this.showCarRepairs(map);
        this.showFireStations(map);
        this.showPostOffices(map);
    }

    places.showAirports = function (map) {
        var service;
        var request = {
            location: map.getCenter(),
            radius: '500',
            type: ['airport']
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    }

    places.showBanks = function (map) {
        var service;
        var request = {
            location: map.getCenter(),
            radius: '500',
            type: ['bank']
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    }

    places.showGasStations = function (map) {
        var service;
        var request = {
            location: map.getCenter(),
            radius: '500',
            type: ['gas_station']
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    }

    places.showHospitals = function (map) {
        var service;
        var request = {
            location: map.getCenter(),
            radius: '500',
            type: ['hospital']
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    }

    places.showMosques = function (map) {
        var service;
        var request = {
            location: map.getCenter(),
            radius: '500',
            type: ['mosque']
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    }

    places.showPharmacies = function (map) {
        var service;
        var request = {
            location: map.getCenter(),
            radius: '500',
            type: ['pharmacy']
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    }

    places.showPoliceStations = function (map) {
        var service;
        var request = {
            location: map.getCenter(),
            radius: '500',
            type: ['police']
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    }

    places.showPostOffices = function (map) {
        var service;
        var request = {
            location: map.getCenter(),
            radius: '500',
            type: ['post_office']
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    }

    places.showFireStations = function (map) {
        var service;
        var request = {
            location: map.getCenter(),
            radius: '500',
            type: ['fire_station']
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    }

    places.showCarRepairs = function (map) {
        var service;
        var request = {
            location: map.getCenter(),
            radius: '500',
            type: ['car_repair']
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    }

    places.clearAll = function (map) {

        var length = markers.length;
        for (var i = 0; i < length; i++) {
            markers[i].setMap(null);
        }

        infowindow = null;
        markers.length = 0;
    };

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                createMarker(results[i], map);
            }
        }
    }

    function createMarker(place, map) {

        infowindow = new google.maps.InfoWindow({
            pixelOffset: new google.maps.Size(-25, 0)
        });

        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            }
        });

        marker.addListener('click', function () {

            infowindow.setContent(place.name);
            infowindow.open(map, marker);
        });

        markers.push(marker);
    }

}(window.places = window.places || {}));