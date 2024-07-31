(function (geocoder, undefined) {
    directionService.caclulate = function (origin, destination, callback) {
        var host = base_url();
        url = host + 'Layout/Directions?origin=' + origin + '&destination=' + destination;
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if (typeof callback === 'function') {
                    var response = {
                        successStatus: data.Status == "OK" ? true : false,
                        distance: data.Route.Distance,
                        duration: data.Route.Duration,
                        encodedPath: data.Route.EncodedPath        
                    }
                    callback(response);
                }
            },
            error: function () {
                if (typeof callback === 'function') {
                    var response = {
                        successStatus: false
                    }
                    callback(response);
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
}(window.directionService = window.directionService || {}));