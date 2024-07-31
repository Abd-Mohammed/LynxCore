(function (geocoder, undefined) {
    geocoder.geocode = function (lat, lng, callback) {
        var host = base_url();
        url = host + 'Layout/Geocode?lat=' + lat + '&lng=' + lng;
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if (typeof callback === 'function') {
                    var address = lat + ',' + lng;
                    if (data.successStatus === true) {
                        address = data.address;
                    }
                    callback(address);
                }
            },
            error: function () {

                if (typeof callback === 'function') {
                    var address = lat + ',' + lng;
                    callback(address);
                }
            }
        });
    };

    // Work around for base url in localhost and qa website.
    function base_url() {
        var url = location.origin + '/';
        var pathparts = location.pathname.split('/');
        if (location.host === 'localhost') {
            url = location.origin + '/' + pathparts[1].trim('/') + '/';
        }

        return url;
    }

}(window.geocoder = window.geocoder || {}));